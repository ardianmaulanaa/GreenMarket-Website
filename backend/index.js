const express = require("express");
const cors = require("cors");

require("dotenv").config();

// Import routes
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

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://project-76nni.vercel.app",
  "https://project-76nni-git-main-ardianmaulana92251-gmailcoms-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Izinkan request tanpa origin seperti Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Backend GreenMarket running");
});

// API routes
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

// Listener untuk local / Render
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;