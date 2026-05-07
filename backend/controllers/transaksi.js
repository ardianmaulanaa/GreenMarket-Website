const prisma = require("../lib/prisma");

const createTransaksi = async (req, res) => {
  try {
    const {
      id_user,
      id_alamat,
      id_jasa_kirim,
      id_metode_pembayaran,
      kuantitas,
    } = req.body;

    if (!id_user || !id_alamat || !id_jasa_kirim || !id_metode_pembayaran) {
      return res.status(400).json({
        message: "Data transaksi belum lengkap",
      });
    }

    const transaksi = await prisma.transaksi.create({
      data: {
        id_user: parseInt(id_user),
        id_alamat,
        id_jasa_kirim,
        id_metode_pembayaran,
        kuantitas: parseInt(kuantitas) || 1,
        status_transaksi: "MENUNGGU_KONFIRMASI",
        pembayaran: {
          create: {
            status_pembayaran: "BERHASIL",
          },
        },
      },
      include: {
        user: true,
        alamat: true,
        jasa_kirim: true,
        metode_pembayaran: true,
        pembayaran: true,
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
        alamat: true,
        jasa_kirim: true,
        metode_pembayaran: true,
        pembayaran: true,
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
