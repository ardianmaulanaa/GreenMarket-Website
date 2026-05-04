const express = require("express");
const router = express.Router();

const {
  getWishlistByUser,
  addWishlist,
  deleteWishlist,
} = require("../controllers/wishlist");


router.get("/:id_user", getWishlistByUser);
router.post("/:id_user", addWishlist);
router.delete("/:id_user/:id_produk", deleteWishlist);

module.exports = router;