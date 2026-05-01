const prisma = require("../lib/prisma");

const getProducts = async (req, res) => {
  try {
    const products = await prisma.produk.findMany({
      include: {
        kategori: true,
        fotos: true,
        seller: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error Get Products:", error);
    res.status(500).json({
      message: "Gagal mengambil data produk",
      detail: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      nama_produk,
      harga,
      stok,
      image_url,
      id_kategori,
      id_user,
    } = req.body;

    console.log("Payload diterima:", {
      nama_produk,
      id_kategori,
      id_user,
    });

    if (!nama_produk || !harga || !id_user || !id_kategori) {
      return res.status(400).json({
        message: "Data produk atau kategori tidak lengkap.",
      });
    }

    const newProduct = await prisma.produk.create({
      data: {
        nama_produk,
        harga: Number(harga),
        stok: Number(stok) || 0,
        deskripsi: req.body.deskripsi || "Produk ramah lingkungan.",
        status_produk: "AKTIF",
        id_user_seller: Number(id_user),
        id_kategori,
        fotos: {
          create: [
            {
              url_foto: image_url || "https://via.placeholder.com/150",
            },
          ],
        },
      },
      include: {
        fotos: true,
      },
    });

    res.status(201).json({
      message: "Produk berhasil diunggah!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error detail:", error);

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Gagal: Kategori atau Penjual tidak terdaftar di database.",
      });
    }

    res.status(500).json({
      message: "Gagal menyimpan produk ke database.",
      detail: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
};