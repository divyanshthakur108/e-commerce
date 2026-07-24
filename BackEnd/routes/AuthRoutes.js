const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword,
  logoutUser,
  getUsers,
  toggleUserStatus,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Public Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected Profile & Account Routes
router.get("/profile", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);
router.post("/upload-avatar", protect, uploadAvatar);
router.put("/change-password", protect, changePassword);

// Admin Routes
router.get("/users", protect, admin, getUsers);
router.put("/users/:id/toggle-block", protect, admin, toggleUserStatus);

module.exports = router;
