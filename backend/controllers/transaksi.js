const prisma = require("../lib/prisma");
const snap = require("../config/midtrans");

const getDemoStatusByTime = (transaksi) => {
  if (transaksi.status_transaksi === "BELUM_BAYAR") {
    return "BELUM_BAYAR";
  }

  if (transaksi.status_transaksi === "SELESAI") {
    return "SELESAI";
  }

  const dibuatPada = new Date(transaksi.tanggal_transaksi).getTime();
  const sekarang = Date.now();
  const selisihJam = (sekarang - dibuatPada) / (1000 * 60 * 60);

  if (selisihJam >= 24) {
    return "SELESAI";
  }

  if (selisihJam >= 6) {
    return "DIKIRIM";
  }

  return "DIKEMAS";
};

const createTransaksi = async (req, res) => {
  try {
    const {
      id_user,
      id_produk,
      id_alamat,
      id_jasa_kirim,
      id_metode_pembayaran,
      kuantitas,
      items,
    } = req.body;

    const userId = Number(id_user);

    if (!id_user || !id_alamat || !id_jasa_kirim || !id_metode_pembayaran) {
      return res.status(400).json({
        message: "Data transaksi belum lengkap",
      });
    }

    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "ID user tidak valid",
      });
    }

    const normalizedItems =
      Array.isArray(items) && items.length > 0
        ? items.map((item) => ({
            id_produk: item.id_produk,
            kuantitas: Number(item.kuantitas) || 1,
          }))
        : [
            {
              id_produk,
              kuantitas: Number(kuantitas) || 1,
            },
          ];

    for (const item of normalizedItems) {
      if (!item.id_produk || item.kuantitas <= 0) {
        return res.status(400).json({
          message: "Data produk tidak valid",
        });
      }
    }

    const alamat = await prisma.alamat.findFirst({
      where: {
        id_alamat,
        id_user: userId,
      },
    });

    if (!alamat) {
      return res.status(404).json({
        message: "Alamat tidak ditemukan atau bukan milik user ini",
      });
    }

    const jasaKirim = await prisma.jasa_Kirim.findUnique({
      where: {
        id_jasa: id_jasa_kirim,
      },
    });

    if (!jasaKirim) {
      return res.status(404).json({
        message: "Jasa kirim tidak ditemukan",
      });
    }

    const metode = await prisma.metode_Pembayaran.findUnique({
      where: {
        id_metode: id_metode_pembayaran,
      },
    });

    if (!metode) {
      return res.status(404).json({
        message: "Metode pembayaran tidak ditemukan",
      });
    }

    const produkIds = normalizedItems.map((item) => item.id_produk);

    const produkList = await prisma.produk.findMany({
      where: {
        id_produk: {
          in: produkIds,
        },
      },
    });

    if (produkList.length !== produkIds.length) {
      return res.status(404).json({
        message: "Ada produk yang tidak ditemukan",
      });
    }

    for (const item of normalizedItems) {
      const produk = produkList.find((p) => p.id_produk === item.id_produk);

      if (!produk) {
        return res.status(404).json({
          message: "Produk tidak ditemukan",
        });
      }

      if (produk.stok < item.kuantitas) {
        return res.status(400).json({
          message: `Stok ${produk.nama_produk} tidak cukup. Stok tersedia hanya ${produk.stok}`,
        });
      }
    }

    const totalProduk = normalizedItems.reduce((total, item) => {
      const produk = produkList.find((p) => p.id_produk === item.id_produk);
      return total + produk.harga * item.kuantitas;
    }, 0);

    const totalHarga = totalProduk + jasaKirim.harga_pengiriman;

    const statusTransaksi =
      metode.kode_metode === "CASH" ? "DIKEMAS" : "BELUM_BAYAR";

    const statusPembayaran =
      metode.kode_metode === "CASH" ? "BAYAR_DI_TEMPAT" : "MENUNGGU_PEMBAYARAN";

    const transaksi = await prisma.$transaction(async (tx) => {
      const transaksiBaru = await tx.transaksi.create({
        data: {
          id_user: userId,
          id_alamat,
          id_jasa_kirim,
          id_metode_pembayaran,
          total_harga: totalHarga,
          status_transaksi: statusTransaksi,

          detail_transaksi: {
            create: normalizedItems.map((item) => {
              const produk = produkList.find(
                (p) => p.id_produk === item.id_produk,
              );

              return {
                id_produk: item.id_produk,
                kuantitas: item.kuantitas,
                harga_satuan: produk.harga,
                subtotal: produk.harga * item.kuantitas,
              };
            }),
          },

          pembayaran: {
            create: {
              status_pembayaran: statusPembayaran,
            },
          },

          tracking_logs: {
            create:
              metode.kode_metode === "CASH"
                ? [
                    { status: "Transaksi dibuat" },
                    { status: "Pesanan sedang dikemas" },
                  ]
                : [
                    { status: "Transaksi dibuat" },
                    { status: "Menunggu pembayaran" },
                  ],
          },
        },
        include: {
          user: true,
          detail_transaksi: {
            include: {
              produk: {
                include: {
                  seller: {
                    select: {
                      username: true,
                      email: true,
                    },
                  },
                  kategori: true,
                },
              },
            },
          },
          alamat: true,
          jasa_kirim: true,
          metode_pembayaran: true,
          pembayaran: true,
          tracking_logs: {
            orderBy: {
              waktu: "asc",
            },
          },
        },
      });

      if (metode.kode_metode === "CASH") {
        for (const item of normalizedItems) {
          await tx.produk.update({
            where: {
              id_produk: item.id_produk,
            },
            data: {
              stok: {
                decrement: item.kuantitas,
              },
            },
          });
        }
      }

      await tx.keranjang.deleteMany({
        where: {
          id_user: userId,
          id_produk: {
            in: produkIds,
          },
        },
      });

      return transaksiBaru;
    });

    let midtransToken = null;

    if (metode.kode_metode === "QRIS") {
      const parameter = {
        transaction_details: {
          order_id: transaksi.id_transaksi,
          gross_amount: totalHarga,
        },
        customer_details: {
          first_name: transaksi.user.username,
          email: transaksi.user.email,
        },
        item_details: [
          ...transaksi.detail_transaksi.map((detail) => ({
            id: detail.produk.id_produk,
            price: detail.harga_satuan,
            quantity: detail.kuantitas,
            name: detail.produk.nama_produk,
          })),
          {
            id: jasaKirim.id_jasa,
            price: jasaKirim.harga_pengiriman,
            quantity: 1,
            name: jasaKirim.nama_jasa,
          },
        ],
      };

      midtransToken = await snap.createTransactionToken(parameter);
    }

    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaksi,
      midtransToken,
    });
  } catch (error) {
    console.error("Error Create Transaksi:", error);
    res.status(500).json({
      message: "Gagal membuat transaksi",
      detail: error.message,
    });
  }
};

const getTransaksiByUser = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);

    const transaksi = await prisma.transaksi.findMany({
      where: {
        id_user,
      },
      include: {
        detail_transaksi: {
          include: {
            produk: {
              include: {
                seller: {
                  select: {
                    username: true,
                    email: true,
                  },
                },
                kategori: true,
              },
            },
          },
        },
        alamat: true,
        jasa_kirim: true,
        metode_pembayaran: true,
        pembayaran: true,
        tracking_logs: {
          orderBy: {
            waktu: "asc",
          },
        },
      },
      orderBy: {
        tanggal_transaksi: "desc",
      },
    });

    const transaksiTerupdate = [];

    for (const trx of transaksi) {
      const statusDemo = getDemoStatusByTime(trx);

      if (statusDemo !== trx.status_transaksi) {
        const trackingStatus =
          statusDemo === "DIKIRIM"
            ? "Pesanan sedang dikirim"
            : "Pesanan selesai";

        const updated = await prisma.transaksi.update({
          where: {
            id_transaksi: trx.id_transaksi,
          },
          data: {
            status_transaksi: statusDemo,
            tracking_logs: {
              create: {
                status: trackingStatus,
              },
            },
          },
          include: {
            detail_transaksi: {
              include: {
                produk: {
                  include: {
                    seller: {
                      select: {
                        username: true,
                        email: true,
                      },
                    },
                    kategori: true,
                  },
                },
              },
            },
            alamat: true,
            jasa_kirim: true,
            metode_pembayaran: true,
            pembayaran: true,
            tracking_logs: {
              orderBy: {
                waktu: "asc",
              },
            },
          },
        });

        transaksiTerupdate.push(updated);
      } else {
        transaksiTerupdate.push(trx);
      }
    }

    res.json(transaksiTerupdate);
  } catch (error) {
    console.error("Error Get Transaksi:", error);
    res.status(500).json({
      message: "Gagal mengambil transaksi",
      detail: error.message,
    });
  }
};

module.exports = {
  createTransaksi,
  getTransaksiByUser,
};
