const prisma = require("../lib/prisma");

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.kategori_Produk.findMany();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error Get Categories:", error);
    res.status(500).json({
      message: "Gagal mengambil kategori",detail: error.message,
    });
  }
};

module.exports = {getCategories};