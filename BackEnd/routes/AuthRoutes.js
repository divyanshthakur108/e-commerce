const express = require("express");
const router = express.Router();

const {
registerUser,
loginUser,
verifyOtp,
getUsers,
toggleUserStatus,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);

// Admin Routes
router.get("/users", protect, admin, getUsers);

router.put(
"/users/:id/toggle-block",
protect,
admin,
toggleUserStatus
);

module.exports = router;
