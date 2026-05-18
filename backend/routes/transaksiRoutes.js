const express = require("express");
const router = express.Router();

const {
  createTransaksi,
  getTransaksiByUser,
  getTransaksiBySeller,
  konfirmasiKirim,
} = require("../controllers/transaksi");

router.post("/", createTransaksi);
router.get("/user/:id_user", getTransaksiByUser);
router.get("/seller/:id_seller", getTransaksiBySeller);
router.put("/:id_transaksi/konfirmasi-kirim", konfirmasiKirim);

module.exports = router;
