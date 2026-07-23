const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.verified) {
      return res.status(400).json({
        message: "User already exists with this email. Please login.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    let user;
    if (existingUser && !existingUser.verified) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      user = await existingUser.save();
    } else {
      user = await User.create({
        name,
        email,
        password,
        otp,
        otpExpires,
      });
    }

    let otpSent = true;
    try {
      await sendEmail(
        email,
        "ShopNest OTP Verification",
        `Your verification OTP is ${otp}. It expires in 10 minutes.`,
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      otpSent = false;
    }

    res.status(201).json({
      message: otpSent
        ? "Registration successful. OTP sent to your email."
        : `Registration successful! Email sending failed, use OTP: ${otp}`,
      email: user.email,
      otpSent,
      debugOtp: otp,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      message: error.message || "Server error during registration",
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "User is already verified",
      });
    }

    if (!user.otp || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({
      message: "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Block / Unblock User
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin account cannot be blocked",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  getUsers,
  toggleUserStatus,
};
