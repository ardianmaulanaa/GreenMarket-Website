const prisma = require("../lib/prisma");

const getProducts = async (req, res) => {
  try {
    const products = await prisma.produk.findMany({
      include: {
        kategori: true,
        fotos: true,
        detail: true, // Memastikan detail deskripsi manual terbawa
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
      konten_deskripsi, // Ambil deskripsi manual dari body
    } = req.body;

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
        // deskripsi di sini tetap menyimpan pilihan (pakaian organik, dll)
        deskripsi: req.body.deskripsi || "Produk ramah lingkungan.", 
        status_produk: "AKTIF",
        id_user_seller: Number(id_user),
        id_kategori,
        // Menambahkan data ke tabel relasi Produk_Detail
        detail: {
          create: {
            konten_deskripsi: konten_deskripsi || "Belum ada detail produk.",
          },
        },
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
        detail: true,
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
        message: "Gagal: Kategori atau Penjual tidak terdaftar.",
      });
    }
    res.status(500).json({
      message: "Gagal menyimpan produk.",
      detail: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama_produk,
      harga,
      stok,
      image_url,
      id_kategori,
      deskripsi, // Pilihan kategori lama
      konten_deskripsi, // Ketikan manual baru
    } = req.body;

    const existingProduct = await prisma.produk.findUnique({
      where: { id_produk: id },
      include: { detail: true }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    const updatedProduct = await prisma.produk.update({
      where: { id_produk: id },
      data: {
        nama_produk,
        harga: Number(harga),
        stok: Number(stok) || 0,
        deskripsi: deskripsi || existingProduct.deskripsi,
        id_kategori,
        // Menggunakan upsert agar aman jika data detail sebelumnya belum ada
        detail: {
          upsert: {
            create: {
              konten_deskripsi: konten_deskripsi || "Belum ada detail produk.",
            },
            update: {
              konten_deskripsi: konten_deskripsi || existingProduct.detail?.konten_deskripsi,
            },
          },
        },
        fotos: {
          deleteMany: {},
          create: [{ url_foto: image_url || "https://via.placeholder.com/150" }],
        },
      },
      include: {
        kategori: true,
        fotos: true,
        detail: true,
        seller: { select: { username: true, email: true } },
      },
    });

    res.status(200).json({
      message: "Produk berhasil diperbarui.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error Update Product:", error);
    res.status(500).json({
      message: "Gagal memperbarui produk.",
      detail: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Menghapus relasi detail secara manual jika tidak diset CASCADE di Prisma
    await prisma.Produk_Detail.deleteMany({
      where: { id_produk: id }
    });

    await prisma.produk.update({
      where: { id_produk: id },
      data: { fotos: { deleteMany: {} } },
    });

    await prisma.produk.delete({
      where: { id_produk: id },
    });

    res.status(200).json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    console.error("Error Delete Product:", error);
    res.status(500).json({ message: "Gagal menghapus produk." });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};