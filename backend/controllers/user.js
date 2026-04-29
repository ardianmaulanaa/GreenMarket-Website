const { pool } = require('../config/db');

//GET User untuk menampilkan info user di profile
const getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const result = await pool.query(
      'SELECT * FROM "User" WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(result.rows[0]);
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

    const result = await pool.query(
      'UPDATE "User" SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "Profile berhasil diupdate",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update profile" });
  }
};

module.exports = { getProfile, updateProfile };