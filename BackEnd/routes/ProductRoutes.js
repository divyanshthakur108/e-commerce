const express = require("express");
const multer = require("multer");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
  getProducts,
  getHomeProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = multer({ dest: "upload/" });
const router = express.Router();

// Specific routes MUST be defined before /:id
router.get("/home", getHomeProducts);
router.get("/featured", getFeaturedProducts);
router.get("/best-sellers", getBestSellers);
router.get("/new-arrivals", getNewArrivals);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);

router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
