const express = require("express");
const router = express.Router();

const {register, login, loginGuest} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/guest", loginGuest);

module.exports = router;