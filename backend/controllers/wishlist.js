const prisma = require("../lib/prisma");

// GET wishlist berdasarkan user
const getWishlistByUser = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);

    if (!id_user) {
      return res.status(400).json({
        message: "ID user tidak valid.",
      });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        id_user: id_user,
      },
      include: {
        produk: {
          include: {
            kategori: true,
            fotos: true,
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

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error Get Wishlist:", error);
    res.status(500).json({
      message: "Gagal mengambil wishlist.",
      detail: error.message,
    });
  }
};

// POST tambah produk ke wishlist
const addWishlist = async (req, res) => {
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

    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    if (existingWishlist) {
      return res.status(400).json({
        message: "Produk sudah ada di wishlist.",
      });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        id_user: id_user,
        id_produk: id_produk,
      },
      include: {
        produk: {
          include: {
            kategori: true,
            fotos: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Produk berhasil ditambahkan ke wishlist.",
      wishlist: wishlist,
    });
  } catch (error) {
    console.error("Error Add Wishlist:", error);
    res.status(500).json({
      message: "Gagal menambahkan wishlist.",
      detail: error.message,
    });
  }
};

// DELETE hapus wishlist berdasarkan id produk dan id user
const deleteWishlist = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const { id_produk } = req.params;

    if (!id_user || !id_produk) {
      return res.status(400).json({
        message: "ID user dan ID produk wajib diisi.",
      });
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    if (!existingWishlist) {
      return res.status(404).json({
        message: "Wishlist tidak ditemukan.",
      });
    }

    await prisma.wishlist.delete({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    res.status(200).json({
      message: "Produk berhasil dihapus dari wishlist.",
    });
  } catch (error) {
    console.error("Error Delete Wishlist:", error);
    res.status(500).json({
      message: "Gagal menghapus wishlist.",
      detail: error.message,
    });
  }
};

// GET cek apakah produk sudah ada di wishlist user
const checkWishlist = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const { id_produk } = req.params;

    if (!id_user || !id_produk) {
      return res.status(400).json({
        message: "ID user dan ID produk wajib diisi.",
      });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        id_user_id_produk: {
          id_user: id_user,
          id_produk: id_produk,
        },
      },
    });

    res.status(200).json({
      isWishlisted: !!wishlist,
    });
  } catch (error) {
    console.error("Error Check Wishlist:", error);
    res.status(500).json({
      message: "Gagal mengecek wishlist.",
      detail: error.message,
    });
  }
};

module.exports = {
  getWishlistByUser,
  addWishlist,
  deleteWishlist,
  checkWishlist,
};