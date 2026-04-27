const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const userRoutes = require("./routes/user");
require('dotenv').config();

const app = express()
app.use(cors({ origin: "http://127.0.0.1:5500" }))
app.use(express.json())

// koneksi PostgreSQL
const pool = new Pool({
  user: 'ardian',
  host: 'localhost',
  database: 'greenmarket',
  password: 'ardian123',
  port: 5434,
})

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

app.use("/profile", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server GreenMarket berjalan di http://localhost:${PORT}`);
});
