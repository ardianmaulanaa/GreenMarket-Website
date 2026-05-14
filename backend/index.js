const express = require("express");
const cors = require("cors");

require("dotenv").config();

// Import routes - Menghubungkan dengan file di folder routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const keranjangRoutes = require("./routes/keranjangRoutes");
const jasaKirimRoutes = require("./routes/jasakirimRoutes");
const metodePembayaranRoutes = require("./routes/metodepembayaranRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");

const app = express();

// Middleware CORS - pastikan mengarah ke port frontend Anda
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

//Root endpoint
app.get("/", (req, res) => {
  res.send("Backend GreenMarket running");
});

//API routes
app.use("/", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alamat", addressRoutes);
app.use("/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/keranjang", keranjangRoutes);
app.use("/api/jasa-kirim", jasaKirimRoutes);
app.use("/api/metode-pembayaran", metodePembayaranRoutes);
app.use("/api/transaksi", transaksiRoutes);

// --- LISTENER ---
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
