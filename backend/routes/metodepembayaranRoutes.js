const express = require("express");
const router = express.Router();

const { getMetodePembayaran } = require("../controllers/metodePembayaran");

router.get("/", getMetodePembayaran);

module.exports = router;
