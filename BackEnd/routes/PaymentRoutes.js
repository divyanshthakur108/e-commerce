const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getRazorpayKey,
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Allow public retrieval of Razorpay Key ID for payment modal initialization
router.get("/key", getRazorpayKey);
router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
