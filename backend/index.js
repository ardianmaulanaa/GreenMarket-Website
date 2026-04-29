const express = require('express')
const cors = require('cors')
const { pool } = require('./config/db');
const bcrypt = require('bcrypt')
const userRoutes = require("./routes/user");
require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Gunakan koneksi dari .env
const poolConnection = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(poolConnection);
const prisma = new PrismaClient({ adapter });
const app = express()

app.use(cors({
  origin: "http://localhost:3000", // Mengizinkan Next.js kamu
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));app.use(express.json())


app.get("/", (req, res) => {
  res.send("Backend GreenMarket running");
});

app.post("/register", async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Field tidak lengkap" });
    }

    const checkUser = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email sudah terdaftar"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO "User" (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.json({
      message: "Register berhasil",
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      detail: err.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Email tidak ditemukan"
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Password salah"
      });
    }

    res.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      detail: err.message
    });
  }
});

// Route untuk mengambil semua produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.produk.findMany({
      include: {
        kategori: true, // Mengambil nama kategori (Alat Tulis)
        fotos: true,    // Mengambil daftar foto produk
        seller: {       // Mengambil info penjual (Ardian)
          select: {
            username: true,
            email: true
          }
        }
      }
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data produk" });
  }
});



process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.use("/profile", userRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server GreenMarket berjalan di http://localhost:${PORT}`);
});

