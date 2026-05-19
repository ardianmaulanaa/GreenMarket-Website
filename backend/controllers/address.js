const prisma = require('../lib/prisma');

const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  let cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  if (cleaned.length < 11 || cleaned.length > 15) {
    return null;
  }
  return '+' + cleaned;
};

// GET semua alamat milik user
const getAddresses = async (req, res) => {
  try {
    const id_user = parseInt(req.params.id_user);

    const result = await prisma.alamat.findMany({
      where: {
        id_user: id_user
      }
    });

    res.json(result);
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

    const normalizedPhone = normalizePhoneNumber(nomor_hp);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Nomor telepon Indonesia tidak valid" });
    }

    const result = await prisma.alamat.create({
      data: {
        id_user: id_user,
        nama_penerima: nama_penerima,
        nomor_hp: normalizedPhone,
        alamat_lengkap: alamat_lengkap
      }
    });

    res.status(201).json({
      message: "Alamat berhasil ditambahkan",
      alamat: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambah alamat" });
  }
};

// PUT update alamat
const updateAddress = async (req, res) => {
  try {
    const id_alamat = req.params.id_alamat;
    const id_user   = parseInt(req.params.id_user);
    const { nama_penerima, nomor_hp, alamat_lengkap } = req.body;

    if (!nama_penerima || !nomor_hp || !alamat_lengkap) {
      return res.status(400).json({ message: "Data tidak boleh kosong" });
    }

    const normalizedPhone = normalizePhoneNumber(nomor_hp);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Nomor telepon Indonesia tidak valid" });
    }

    // Pastikan alamat milik user yang benar
    const alamat = await prisma.alamat.findUnique({
      where: {
        id_alamat: id_alamat
      }
    });

    if (!alamat || alamat.id_user !== id_user) {
      return res.status(404).json({ message: "Alamat tidak ditemukan" });
    }

    const result = await prisma.alamat.update({
      where: {
        id_alamat: id_alamat
      },
      data: {
        nama_penerima: nama_penerima,
        nomor_hp: normalizedPhone,
        alamat_lengkap: alamat_lengkap
      }
    });

    res.json({
      message: "Alamat berhasil diperbarui",
      alamat: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update alamat" });
  }
};

// DELETE hapus alamat
const deleteAddress = async (req, res) => {
  try {
    const id_alamat = req.params.id_alamat;
    const id_user   = parseInt(req.params.id_user);

    // Pastikan alamat milik user yang benar
    const alamat = await prisma.alamat.findUnique({
      where: {
        id_alamat: id_alamat
      }
    });

    if (!alamat || alamat.id_user !== id_user) {
      return res.status(404).json({ message: "Alamat tidak ditemukan" });
    }

    await prisma.alamat.delete({
      where: {
        id_alamat: id_alamat
      }
    });

    res.json({ message: "Alamat berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal hapus alamat" });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };