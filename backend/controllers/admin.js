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

module.exports = {getAllUsers,};