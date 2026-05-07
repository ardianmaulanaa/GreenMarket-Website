const express = require("express");
const router = express.Router();

const { getJasaKirim } = require("../controllers/jasaKirim");

router.get("/", getJasaKirim);

module.exports = router;
