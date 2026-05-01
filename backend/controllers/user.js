const prisma = require("../lib/prisma");

//GET User untuk menampilkan info user di profile
const getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const result = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!result) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error server" });
  }
};

// Put User untuk update profile
const updateProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email } = req.body;

    const result = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        username: username,
        email: email
      }
    });

    res.json({
      message: "Profile berhasil diupdate",
      user: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update profile" });
  }
};

const upgradeUserRole = async (req, res) => {
  const { id } = req.params;
  const userIdInt = parseInt(id);

  if (!id || id === "undefined" || isNaN(userIdInt)) {
    return res.status(400).json({
      error: "ID User tidak valid (NaN). Pastikan kamu sudah login ulang di browser.",
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt },
      data: { role: "SELLER" },
    });

    res.status(200).json({
      message: "Selamat! Akun kamu berhasil ditingkatkan menjadi Penjual!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error upgrade role:", error);
    res.status(500).json({
      error: "Gagal memproses pendaftaran penjual ke database.",
    });
  }
};

module.exports = { getProfile, updateProfile, upgradeUserRole };