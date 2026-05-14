const prisma = require("../lib/prisma");
const supabase = require("../lib/supabase");

// Upload maksimal 4 foto ke Supabase Storage bucket "produk"
const uploadProductImages = async (files = []) => {
  const uploadedUrls = [];

  for (const file of files.slice(0, 4)) {
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

    // folder di dalam bucket, boleh tetap "produk/"
    const filePath = `produk/${fileName}`;

    const { error } = await supabase.storage
      .from("produk")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Gagal upload foto: ${error.message}`);
    }

    const { data } = supabase.storage
      .from("produk")
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};

// 1. GET: Menampilkan produk
const getProducts = async (req, res) => {
  try {
    const { userId } = req.query;

    const products = await prisma.produk.findMany({
      where: {
        id_user_seller: userId ? Number(userId) : undefined,
      },
      include: {
        kategori: true,
        seller: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
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

// 2. GET: Detail produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.produk.findUnique({
      where: {
        id_produk: id,
      },
      include: {
        kategori: true,
        seller: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error Get Product By ID:", error);
    res.status(500).json({
      message: "Gagal mengambil detail produk.",
      detail: error.message,
    });
  }
};

// 3. POST: Membuat produk baru
const createProduct = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      nama_produk,
      harga,
      stok,
      id_kategori,
      id_user,
      konten_deskripsi,
      catatan_penjual,
      deskripsi,
    } = body;

    if (!nama_produk || !harga || !id_user || !id_kategori) {
      return res.status(400).json({
        message: "Data tidak lengkap.",
        body,
      });
    }

    const files = req.files || [];
    const uploadedUrls = await uploadProductImages(files);

    if (uploadedUrls.length === 0) {
      return res.status(400).json({
        message: "Minimal upload 1 foto produk.",
      });
    }

    const fotoUtama = uploadedUrls[0];

    const newProduct = await prisma.produk.create({
      data: {
        nama_produk,
        harga: Number(harga),
        stok: stok ? Number(stok) : 0,
        deskripsi: deskripsi || "Produk ramah lingkungan.",
        status_produk: "AKTIF",

        id_user_seller: Number(id_user),
        id_kategori,

        foto_produk: fotoUtama,
        foto_produk_list: uploadedUrls,

        konten_deskripsi: konten_deskripsi || "Belum ada detail produk.",
        catatan_penjual: catatan_penjual || "Belum ada catatan penjual.",
      },
    });

    res.status(201).json({
      message: "Produk berhasil diunggah!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error Create Product:", error);
    res.status(500).json({
      message: "Gagal menyimpan produk.",
      detail: error.message,
    });
  }
};

// 4. PUT: Update produk
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const {
      id_user,
      nama_produk,
      harga,
      stok,
      id_kategori,
      deskripsi,
      konten_deskripsi,
      catatan_penjual,
      status_produk,
      existing_foto_produk_list,
    } = body;

    const existingProduct = await prisma.produk.findUnique({
      where: {
        id_produk: id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    if (existingProduct.id_user_seller !== Number(id_user)) {
      return res.status(403).json({
        message: "Akses ditolak! Ini bukan produk Anda.",
      });
    }

    const files = req.files || [];
    let daftarFoto = existingProduct.foto_produk_list || [];

    // Kalau upload foto baru, replace semua foto lama
    if (files.length > 0) {
      daftarFoto = await uploadProductImages(files);
    } else if (existing_foto_produk_list) {
      try {
        const parsed = JSON.parse(existing_foto_produk_list);

        if (Array.isArray(parsed)) {
          daftarFoto = parsed.slice(0, 4);
        }
      } catch (error) {
        daftarFoto = existingProduct.foto_produk_list || [];
      }
    }

    const fotoUtama =
      daftarFoto.length > 0 ? daftarFoto[0] : existingProduct.foto_produk;

    const updatedProduct = await prisma.produk.update({
      where: {
        id_produk: id,
      },
      data: {
        nama_produk: nama_produk || existingProduct.nama_produk,

        harga:
          harga !== undefined && harga !== null && harga !== ""
            ? Number(harga)
            : existingProduct.harga,

        stok:
          stok !== undefined && stok !== null && stok !== ""
            ? Number(stok)
            : existingProduct.stok,

        deskripsi: deskripsi || existingProduct.deskripsi,
        status_produk: status_produk || existingProduct.status_produk,
        id_kategori: id_kategori || existingProduct.id_kategori,

        foto_produk: fotoUtama,
        foto_produk_list: daftarFoto,

        konten_deskripsi:
          konten_deskripsi || existingProduct.konten_deskripsi,

        catatan_penjual:
          catatan_penjual || existingProduct.catatan_penjual,
      },
    });

    res.status(200).json({
      message: "Update berhasil!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error Update Product:", error);
    res.status(500).json({
      message: "Gagal update.",
      detail: error.message,
    });
  }
};

// 5. DELETE: Hapus produk
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const product = await prisma.produk.findUnique({
      where: {
        id_produk: id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    if (product.id_user_seller !== Number(userId)) {
      return res.status(403).json({
        message: "Akses ditolak! Ini bukan produk Anda.",
      });
    }

    await prisma.produk.delete({
      where: {
        id_produk: id,
      },
    });

    res.status(200).json({
      message: "Produk berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error Delete Product:", error);
    res.status(500).json({
      message: "Gagal menghapus produk.",
      detail: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};