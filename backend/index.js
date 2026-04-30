const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const userRoutes = require("./routes/user");
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Setup Prisma dengan Adapter untuk Supabase agar koneksi lebih stabil
const poolConnection = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});
const adapter = new PrismaPg(poolConnection);
const prisma = new PrismaClient({ adapter });

const app = express();

// Middleware CORS - pastikan mengarah ke port frontend Anda
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

// Endpoint Register
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

// Endpoint Login
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
        id: user.id,
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

// Endpoint Upgrade Role
app.put('/api/users/upgrade/:id', async (req, res) => {
  const { id } = req.params;
  const userIdInt = parseInt(id);

  if (!id || id === "undefined" || isNaN(userIdInt)) {
    return res.status(400).json({ 
      error: "ID User tidak valid (NaN). Pastikan kamu sudah login ulang di browser." 
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt },
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

// Endpoint Get Categories - Menggunakan Nama Model Sesuai Schema
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.kategori_Produk.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error Get Categories:", error);
    res.status(500).json({ message: "Gagal mengambil kategori", detail: error.message });
  }
});

// Endpoint Get Products
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
    console.error("Error Get Products:", error);
    res.status(500).json({ message: "Gagal mengambil data produk", detail: error.message });
  }
});

// Endpoint Post Products - Penyesuaian UUID & Foreign Key
app.post('/api/products', async (req, res) => {
  try {
    const { nama_produk, harga, stok, image_url, id_kategori, id_user } = req.body;

    // Log untuk memastikan data yang masuk sudah benar
    console.log("Payload diterima:", { nama_produk, id_kategori, id_user });

    // 1. Validasi Input Dasar
    if (!nama_produk || !harga || !id_user || !id_kategori) {
      return res.status(400).json({ message: "Data produk atau kategori tidak lengkap." });
    }

    // 2. Simpan ke Database
    const newProduct = await prisma.produk.create({
      data: {
        nama_produk: nama_produk,
        harga: Number(harga),
        stok: Number(stok) || 0,
        deskripsi: req.body.deskripsi || "Produk ramah lingkungan.", 
        status_produk: "AKTIF",
        
        // id_user_seller adalah Int di schema
        id_user_seller: Number(id_user), 

        // id_kategori adalah String (UUID) di schema, jangan di-parseInt
        id_kategori: id_kategori, 

        // Create nested untuk foto
        fotos: {
          create: [
            { url_foto: image_url || "https://via.placeholder.com/150" }
          ]
        }
      },
      include: {
        fotos: true 
      }
    });

    res.status(201).json({ 
      message: "Produk berhasil diunggah!", 
      product: newProduct 
    });

  } catch (error) {
    console.error("Error detail:", error);
    
    // Error P2003 = Foreign key constraint failed
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: "Gagal: Kategori atau Penjual tidak terdaftar di database." 
      });
    }

    res.status(500).json({ 
      message: "Gagal menyimpan produk ke database.", 
      detail: error.message 
    });
  }
});

// Route Profil
app.use("/profile", userRoutes);

// --- LISTENER ---
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});