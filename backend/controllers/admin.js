const prisma = require("../lib/prisma");

const getAllUsers = async (req, res) => {
  const { role } = req.query;

  if (role !== "ADMIN") {
    return res.status(403).json({
      message: "Akses ditolak! Kamu bukan Admin.",
    });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Gagal mengambil data dari database",
    });
  }
};

const getAdminStats = async (req, res) => {
  const { role } = req.query;

  if (role !== "ADMIN") {
    return res.status(403).json({
      message: "Akses ditolak! Kamu bukan Admin.",
    });
  }

  try {
    const totalUsers = await prisma.user.count();
    const activeProducts = await prisma.produk.count({
      where: {
        status_produk: "AKTIF",
      },
    });
    const pendingProducts = await prisma.produk.count({
      where: {
        status_produk: {
          not: "AKTIF",
        },
      },
    });
    const totalTransactions = await prisma.transaksi.count();

    res.json({
      totalUsers,
      activeProducts,
      pendingProducts,
      totalTransactions,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      message: "Gagal mengambil data statistik",
    });
  }
};

module.exports = {
  getAllUsers,
  getAdminStats,
};