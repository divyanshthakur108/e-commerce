const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

// Get Public Razorpay Key ID
const getRazorpayKey = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({
        success: false,
        message: "Razorpay Key ID is missing in server environment.",
      });
    }
    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("[paymentController] Error retrieving key:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve Razorpay Key ID",
    });
  }
};

// Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid order amount is required",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // rupees to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      amount: order.amount,
      currency: order.currency,
      id: order.id,
      order,
    });
  } catch (error) {
    console.error("[paymentController] Razorpay order creation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

// Verify Payment Signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: "Payment Verified Successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid Payment Signature. Verification failed.",
    });
  } catch (error) {
    console.error("[paymentController] Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during payment verification",
    });
  }
};

module.exports = {
  getRazorpayKey,
  createOrder,
  verifyPayment,
};
