const prisma = require("../lib/prisma");

// 1. GET: Menampilkan produk berdasarkan seller yang login
const getProducts = async (req, res) => {
  try {
    const { userId } = req.query;

    const products = await prisma.produk.findMany({
      where: {
        // Jika userId ada, filter produk milik seller tersebut
        id_user_seller: userId ? Number(userId) : undefined,
      },
      include: {
        kategori: true,
        fotos: true,
        detail: true,
        seller: {
          select: { username: true, email: true },
        },
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error Get Products:", error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params; 

    const product = await prisma.produk.findUnique({
      where: {
        id_produk: id,
      },
      include: {
        kategori: true,
        fotos: true,
        detail: true,
        seller: {
          select: { username: true, email: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error Get Product By ID:", error);
    res.status(500).json({ message: "Gagal mengambil detail produk." });
  }
};

// 2. POST: Membuat produk baru
const createProduct = async (req, res) => {
  try {
    const {
      nama_produk, harga, stok, image_url,
      id_kategori, id_user, konten_deskripsi, deskripsi
    } = req.body;

    if (!nama_produk || !harga || !id_user || !id_kategori) {
      return res.status(400).json({ message: "Data tidak lengkap." });
    }

    const newProduct = await prisma.produk.create({
      data: {
        nama_produk,
        harga: Number(harga),
        stok: Number(stok) || 0,
        deskripsi: deskripsi || "Produk ramah lingkungan.",
        status_produk: "AKTIF",
        id_user_seller: Number(id_user),
        id_kategori,
        detail: {
          create: { konten_deskripsi: konten_deskripsi || "Belum ada detail." },
        },
        fotos: {
          create: [{ url_foto: image_url || "https://via.placeholder.com/150" }],
        },
      },
    });

    res.status(201).json({ message: "Produk berhasil diunggah!", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan produk.", detail: error.message });
  }
};

// 3. PUT: Update produk (Hanya Pemilik)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_user, nama_produk, harga, stok,
      image_url, id_kategori, deskripsi, konten_deskripsi
    } = req.body;

    // Cari produk untuk cek kepemilikan
    const existingProduct = await prisma.produk.findUnique({
      where: { id_produk: id },
      include: { detail: true }
    });

    if (!existingProduct) return res.status(404).json({ message: "Produk tidak ditemukan." });

    // SECURITY CHECK: Pastikan yang update adalah pemiliknya
    if (existingProduct.id_user_seller !== Number(id_user)) {
      return res.status(403).json({ message: "Akses ditolak! Ini bukan produk Anda." });
    }

    const updatedProduct = await prisma.produk.update({
      where: { id_produk: id },
      data: {
        nama_produk,
        harga: Number(harga),
        stok: Number(stok) || 0,
        deskripsi: deskripsi || existingProduct.deskripsi,
        id_kategori,
        detail: {
          upsert: {
            create: { konten_deskripsi: konten_deskripsi || "" },
            update: { konten_deskripsi: konten_deskripsi || "" },
          },
        },
        fotos: {
          deleteMany: {},
          create: [{ url_foto: image_url }],
        },
      },
    });

    res.status(200).json({ message: "Update berhasil!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Gagal update.", detail: error.message });
  }
};

// 4. DELETE: Hapus produk (Hanya Pemilik)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const product = await prisma.produk.findUnique({ where: { id_produk: id } });

    if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

    // SECURITY CHECK: Pastikan yang hapus adalah pemiliknya
    if (product.id_user_seller !== Number(userId)) {
      return res.status(403).json({ message: "Akses ditolak!" });
    }

    // Eksekusi Hapus (Manual handling untuk relasi jika tidak CASCADE)
    await prisma.Produk_Detail.deleteMany({ where: { id_produk: id } });
    await prisma.produk.update({ where: { id_produk: id }, data: { fotos: { deleteMany: {} } } });
    await prisma.produk.delete({ where: { id_produk: id } });

    res.status(200).json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk." });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };