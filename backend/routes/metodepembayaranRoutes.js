const express = require("express");
const router = express.Router();

const { getMetodePembayaran } = require("../controllers/metodepembayaran");

router.get("/", getMetodePembayaran);

module.exports = router;
