const prisma = require("../lib/prisma");

const getMetodePembayaran = async (req, res) => {
  try {
    const metodePembayaran = await prisma.metode_Pembayaran.findMany({
      where: {
        kode_metode: {
          in: ["QRIS", "CASH"],
        },
      },
    });

    res.json(metodePembayaran);
  } catch (error) {
    console.error("Error Get Metode Pembayaran:", error);
    res.status(500).json({
      message: "Gagal mengambil metode pembayaran",
      detail: error.message,
    });
  }
};

module.exports = { getMetodePembayaran };
