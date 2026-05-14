const express = require("express");
const router = express.Router();

const { getJasaKirim } = require("../controllers/jasakirim");

router.get("/", getJasaKirim);

module.exports = router;
