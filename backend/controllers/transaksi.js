const prisma = require("../lib/prisma");

const createTransaksi = async (req, res) => {
  try {
    const {
      id_user,
      id_produk,
      id_alamat,
      id_jasa_kirim,
      id_metode_pembayaran,
      kuantitas,
    } = req.body;

    if (
      !id_user ||
      !id_produk ||
      !id_alamat ||
      !id_jasa_kirim ||
      !id_metode_pembayaran
    ) {
      return res.status(400).json({
        message: "Data transaksi belum lengkap",
      });
    }

    const userId = Number(id_user);
    const jumlahBeli = Number(kuantitas) || 1;

    // Validasi user id
    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "ID user tidak valid",
      });
    }

    // Validasi jumlah beli
    if (Number.isNaN(jumlahBeli) || jumlahBeli <= 0) {
      return res.status(400).json({
        message: "Jumlah beli tidak valid",
      });
    }

    // Cek produk
    const produk = await prisma.produk.findUnique({
      where: {
        id_produk,
      },
    });

    if (!produk) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    // Cek stok cukup
    if (produk.stok < jumlahBeli) {
      return res.status(400).json({
        message: `Stok tidak cukup. Stok tersedia hanya ${produk.stok}`,
      });
    }

    // Cek alamat milik user
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

    // Cek jasa kirim
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

    // Cek metode pembayaran
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
    // Menentukan status berdasarkan metode pembayaran
    const statusTransaksi =
      metode.kode_metode === "CASH" ? "DIKEMAS" : "BELUM_BAYAR";

    const statusPembayaran =
      metode.kode_metode === "CASH" ? "BAYAR_DI_TEMPAT" : "MENUNGGU_PEMBAYARAN";

    // Buat transaksi dan kurangi stok
    const transaksi = await prisma.$transaction(async (tx) => {
      const transaksiBaru = await tx.transaksi.create({
        data: {
          id_user: userId,
          id_produk,
          id_alamat,
          id_jasa_kirim,
          id_metode_pembayaran,
          kuantitas: jumlahBeli,
          status_transaksi: statusTransaksi,

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

      await tx.produk.update({
        where: {
          id_produk,
        },
        data: {
          stok: {
            decrement: jumlahBeli,
          },
        },
      });

      return transaksiBaru;
    });

    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaksi,
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

    res.json(transaksi);
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
