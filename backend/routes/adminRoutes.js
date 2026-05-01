const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/admin");

router.get("/users", getAllUsers);

module.exports = router;