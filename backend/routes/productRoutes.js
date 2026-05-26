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

const MAX_PRODUCT_PHOTOS = 4;
const MAX_PRODUCT_IMAGE_SIZE_MB = 5;
const MAX_PRODUCT_IMAGE_SIZE_BYTES =
  MAX_PRODUCT_IMAGE_SIZE_MB * 1024 * 1024;

// Simpan file sementara di memory, karena nanti langsung upload ke Supabase Storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    files: MAX_PRODUCT_PHOTOS,
    fileSize: MAX_PRODUCT_IMAGE_SIZE_BYTES,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File harus berupa PNG, JPG, atau JPEG."));
    }

    cb(null, true);
  },
});

const uploadProductPhotos = (req, res, next) => {
  upload.array("foto_produk_list", MAX_PRODUCT_PHOTOS)(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: `Ukuran tiap foto maksimal ${MAX_PRODUCT_IMAGE_SIZE_MB} MB.`,
        });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          message: `Maksimal ${MAX_PRODUCT_PHOTOS} foto produk.`,
        });
      }
    }

    return res.status(400).json({
      message: error.message || "Foto produk tidak valid.",
    });
  });
};

router.get("/", getProducts);
router.get("/:id", getProductById);

// Ini yang penting: menerima file dari frontend dengan nama field "foto_produk_list"
router.post("/", uploadProductPhotos, createProduct);
router.put("/:id", uploadProductPhotos, updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
