const express = require("express");
const router = express.Router();

const {
  getWishlistByUser,
  addWishlist,
  deleteWishlist,
  checkWishlist,
} = require("../controllers/wishlist");


router.get("/:id_user", getWishlistByUser);
router.post("/:id_user", addWishlist);
router.get("/:id_user/check/:id_produk", checkWishlist);
router.delete("/:id_user/:id_produk", deleteWishlist);

module.exports = router;