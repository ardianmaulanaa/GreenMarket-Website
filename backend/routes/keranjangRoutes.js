const express = require("express");
const router = express.Router();

const {
  getKeranjangByUser,
  addKeranjang,
  deleteKeranjang,
} = require("../controllers/keranjang");

router.get("/:id_user", getKeranjangByUser);
router.post("/:id_user", addKeranjang);
router.delete("/:id_user/:id_produk", deleteKeranjang);

module.exports = router;