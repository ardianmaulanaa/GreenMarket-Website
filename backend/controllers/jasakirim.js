const prisma = require("../lib/prisma");

const getJasaKirim = async (req, res) => {
  try {
    const jasaKirim = await prisma.jasa_Kirim.findMany({
      orderBy: {
        harga_pengiriman: "asc",
      },
    });

    res.json(jasaKirim);
  } catch (error) {
    console.error("Error Get Jasa Kirim:", error);
    res.status(500).json({
      message: "Gagal mengambil jasa kirim",
      detail: error.message,
    });
  }
};

module.exports = { getJasaKirim };
