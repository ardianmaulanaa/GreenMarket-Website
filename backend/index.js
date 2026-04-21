const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')

const app = express()
app.use(cors())
app.use(express.json())

// koneksi PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'greenmarket',
  password: 'postgres',
  port: 5432,
})

app.get("/", (req, res) => {
  res.send("Backend GreenMarket running");
});

app.post("/register", (req, res) => {
  console.log("BODY MASUK:", req.body);

  const body = req.body || {};
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Body kosong / field belum lengkap",
      received: req.body
    });
  }

  res.json({
    message: "Register endpoint berhasil",
    data: { username, email, password }
  });
});
// test koneksi database
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected",
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Database error",
      error
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});