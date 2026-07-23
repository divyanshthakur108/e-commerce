const User = require("../models/User");
const Product = require("../models/product");
const Order = require("../models/Order");

const getAdminStats = async (req, res) => {
  try {
    // Counts
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue Calculation
    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0,
    );

    // Send data to frontend
    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};
