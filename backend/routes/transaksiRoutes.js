const express = require("express");
const router = express.Router();

const {
  createTransaksi,
  getTransaksiByUser,
} = require("../controllers/transaksi");

router.post("/", createTransaksi);
router.get("/user/:id_user", getTransaksiByUser);

module.exports = router;
