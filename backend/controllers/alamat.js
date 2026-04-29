const { pool } = require('../config/db');

// GET semua alamat milik user
const getAddresses = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);

    const result = await pool.query(
      'SELECT * FROM "Alamat" WHERE id_user = $1',
      [id_user]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error server" });
  }
};

// POST tambah alamat baru
const addAddress = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);
    const { nama_penerima, nomor_hp, alamat_lengkap } = req.body;

    if (!nama_penerima || !nomor_hp || !alamat_lengkap) {
      return res.status(400).json({ message: "Data tidak boleh kosong" });
    }

    const result = await pool.query(
      `INSERT INTO "Alamat" (id_user, nama_penerima, nomor_hp, alamat_lengkap)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_user, nama_penerima, nomor_hp, alamat_lengkap]
    );

    res.status(201).json({
      message: "Alamat berhasil ditambahkan",
      alamat: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambah alamat" });
  }
};

// PUT update alamat
const updateAddress = async (req, res) => {
  try {
    const id_alamat = parseInt(req.params.id_alamat);
    const id_user   = parseInt(req.params.id_user);
    const { nama_penerima, nomor_hp, alamat_lengkap } = req.body;

    if (!nama_penerima || !nomor_hp || !alamat_lengkap) {
      return res.status(400).json({ message: "Data tidak boleh kosong" });
    }

    const result = await pool.query(
      `UPDATE "Alamat"
       SET nama_penerima = $1, nomor_hp = $2, alamat_lengkap = $3
       WHERE id_alamat = $4 AND id_user = $5
       RETURNING *`,
      [nama_penerima, nomor_hp, alamat_lengkap, id_alamat, id_user]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Alamat tidak ditemukan" });
    }

    res.json({
      message: "Alamat berhasil diperbarui",
      alamat: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update alamat" });
  }
};

// DELETE hapus alamat
const deleteAddress = async (req, res) => {
  try {
    const id_alamat = parseInt(req.params.id_alamat);
    const id_user   = parseInt(req.params.id_user);

    const result = await pool.query(
      'DELETE FROM "Alamat" WHERE id_alamat = $1 AND id_user = $2 RETURNING id_alamat',
      [id_alamat, id_user]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Alamat tidak ditemukan" });
    }

    res.json({ message: "Alamat berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal hapus alamat" });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };