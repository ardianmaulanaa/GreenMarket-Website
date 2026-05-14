const prisma = require("../lib/prisma");

// GET keranjang berdasarkan user
const getKeranjangByUser = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);

    if (!id_user) {
      return res.status(400).json({
        message: "ID user tidak valid.",
      });
    }

    const keranjang = await prisma.keranjang.findMany({
      where: {
        id_user: id_user,
      },
      include: {
        produk: {
          include: {
            kategori: true,
            seller: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(keranjang);
  } catch (error) {
    console.error("Error Get Keranjang:", error);
    res.status(500).json({
      message: "Gagal mengambil keranjang.",
      detail: error.message,
    });
  }
};

// POST tambah produk ke keranjang
const addKeranjang = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const { id_produk } = req.body;

    if (!id_user || !id_produk) {
      return res.status(400).json({
        message: "ID user dan ID produk wajib diisi.",
      });
    }

    const existingProduct = await prisma.produk.findUnique({
      where: {
        id_produk: id_produk,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Produk tidak ditemukan.",
      });
    }

    const existingKeranjang = await prisma.keranjang.findUnique({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    if (existingKeranjang) {
      return res.status(400).json({
        message: "Produk sudah ada di keranjang.",
      });
    }

    const keranjang = await prisma.keranjang.create({
      data: {
        id_user: id_user,
        id_produk: id_produk,
      },
      include: {
        produk: {
          include: {
            kategori: true,
            seller: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Produk berhasil ditambahkan ke keranjang.",
      keranjang: keranjang,
    });
  } catch (error) {
    console.error("Error Add Keranjang:", error);
    res.status(500).json({
      message: "Gagal menambahkan keranjang.",
      detail: error.message,
    });
  }
};

// DELETE hapus produk dari keranjang berdasarkan id user dan id produk
const deleteKeranjang = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const { id_produk } = req.params;

    if (!id_user || !id_produk) {
      return res.status(400).json({
        message: "ID user dan ID produk wajib diisi.",
      });
    }

    const existingKeranjang = await prisma.keranjang.findUnique({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    if (!existingKeranjang) {
      return res.status(404).json({
        message: "Keranjang tidak ditemukan.",
      });
    }

    await prisma.keranjang.delete({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    res.status(200).json({
      message: "Produk berhasil dihapus dari keranjang.",
    });
  } catch (error) {
    console.error("Error Delete Keranjang:", error);
    res.status(500).json({
      message: "Gagal menghapus keranjang.",
      detail: error.message,
    });
  }
};

module.exports = {
  getKeranjangByUser,
  addKeranjang,
  deleteKeranjang,
};