const express = require("express");
const router = express.Router();

const { getCategories } = require("../controllers/category");

router.get("/", getCategories);

module.exports = router;