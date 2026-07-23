const Order = require("../models/order");
const sendEmail = require("../utils/sendEmail");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items cannot be empty",
      });
    }

    if (!address || !address.fullName || !address.street || !address.city || !address.postalCode || !address.country) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    const formattedItems = items.map((item) => ({
      productId: item.productId || item._id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      imageUrl: item.imageUrl,
    }));

    const order = await Order.create({
      userId: req.user._id,
      items: formattedItems,
      totalAmount,
      address,
      paymentId: paymentId || "N/A",
    });

    try {
      if (req.user && req.user.email) {
        await sendEmail(
          req.user.email,
          "Order Confirmation - ShopNest",
          `
          Hello ${req.user.name || "Customer"},

          Your order has been placed successfully.

          Order ID: ${order._id}
          Total Amount: ₹${totalAmount}
          Payment Ref: ${paymentId || "N/A"}
          Status: ${order.status}

          Thank you for shopping with us!
          `
        );
      }
    } catch (emailError) {
      console.error("Order confirmation email notification failed:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("[orderController] Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order in database",
    });
  }
};

// Get Logged In User Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).populate("items.productId");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
