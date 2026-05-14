const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

// Simpan file sementara di memory, karena nanti langsung upload ke Supabase Storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    files: 4, // maksimal 4 foto
    fileSize: 5 * 1024 * 1024, // maksimal 5MB per file
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File harus berupa PNG, JPG, atau JPEG."));
    }

    cb(null, true);
  },
});

router.get("/", getProducts);
router.get("/:id", getProductById);

// Ini yang penting: menerima file dari frontend dengan nama field "foto_produk_list"
router.post("/", upload.array("foto_produk_list", 4), createProduct);
router.put("/:id", upload.array("foto_produk_list", 4), updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;