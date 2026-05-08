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

    const metode = await prisma.metode_Pembayaran.findUnique({
      where: {
        id_metode: id_metode_pembayaran,
      },
    });

    const statusTransaksi =
      metode?.kode_metode === "CASH" ? "DIKEMAS" : "BELUM_BAYAR";

    const statusPembayaran =
      metode?.kode_metode === "CASH"
        ? "BAYAR_DI_TEMPAT"
        : "MENUNGGU_PEMBAYARAN";

    const transaksi = await prisma.transaksi.create({
      data: {
        id_user: parseInt(id_user),
        id_produk,
        id_alamat,
        id_jasa_kirim,
        id_metode_pembayaran,
        kuantitas: parseInt(kuantitas) || 1,
        status_transaksi: statusTransaksi,
        pembayaran: {
          create: {
            status_pembayaran: statusPembayaran,
          },
        },
        tracking_logs: {
          create:
            metode?.kode_metode === "CASH"
              ? [
                  { status: "Transaksi dibuat" },
                  { status: "Pesanan sedang dikemas" },
                ]
              : [
                  { status: "Transaksi dibuat" },
                  { status: "Menunggu pembayaran QRIS" },
                ],
        },
      },
      include: {
        user: true,
        produk: {
          include: {
            fotos: true,
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
      where: { id_user },
      include: {
        produk: {
          include: {
            fotos: true,
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
