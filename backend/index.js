const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const userRoutes = require("./routes/user");
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const alamatRoutes = require("./routes/alamat");

// Setup Prisma dengan Adapter untuk Supabase agar koneksi lebih stabil
const poolConnection = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});
const adapter = new PrismaPg(poolConnection);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---

app.get("/", (req, res) => {
  res.send("Backend GreenMarket running");
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Field tidak lengkap" });
    }

    const checkUser = await prisma.user.findUnique({ where: { email } });
    if (checkUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, role: 'BUYER' }
    });

    res.json({ message: "Register berhasil", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "Email tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password salah" });

    res.json({
      message: "Login berhasil",
      user: {
        id: user.id, // Pastikan ini 'id' sesuai schema Supabase kamu
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
});

// Endpoint Upgrade Role (Fixing id_user & NaN error)
app.put('/api/users/upgrade/:id', async (req, res) => {
  const { id } = req.params;
  
  // Konversi string ke integer dan validasi
  const userIdInt = parseInt(id);

  if (!id || id === "undefined" || isNaN(userIdInt)) {
    return res.status(400).json({ 
      error: "ID User tidak valid (NaN). Pastikan kamu sudah login ulang di browser." 
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt }, // Menggunakan 'id' sesuai saran error Prisma sebelumnya
      data: { role: 'SELLER' },
    });

    res.status(200).json({
      message: "Selamat! Akun kamu berhasil ditingkatkan menjadi Penjual!",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error upgrade role:", error);
    res.status(500).json({ error: "Gagal memproses pendaftaran penjual ke database." });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.produk.findMany({
      include: {
        kategori: true,
        fotos: true,
        seller: { select: { username: true, email: true } }
      }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
});

app.use("/profile", userRoutes);

<<<<<<< HEAD
// --- ERROR HANDLING & LISTENER ---
=======
app.use("/address", alamatRoutes);

>>>>>>> f88a1dbf4c2c468c93ed963b773d7f40a50a6f65
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("DATABASE_URL TERDETEKSI:", process.env.DATABASE_URL);
});