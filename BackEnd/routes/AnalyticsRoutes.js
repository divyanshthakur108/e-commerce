const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getAdminStats } = require("../controllers/analyticsController");

const router = express.Router();

// Admin Analytics Route
router.get("/", protect, admin, getAdminStats);

module.exports = router;