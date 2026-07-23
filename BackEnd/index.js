const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://e-commerce-git-main-divyanshthakur108s-projects.vercel.app",
  "https://e-commerce-lae4tld3b-divyanshthakur108s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "ShopNest Backend API Server is running..." });
});

app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/products", require("./routes/ProductRoutes"));
app.use("/api/orders", require("./routes/OrderRoutes"));
app.use("/api/order", require("./routes/OrderRoutes")); // Route alias for singular path
app.use("/api/payment", require("./routes/PaymentRoutes"));
app.use("/api/analytics", require("./routes/AnalyticsRoutes"));

// Catch 404 routes and return JSON instead of HTML
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource Not Found: [${req.method}] ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware - Guarantees JSON response in all error cases
app.use((err, req, res, next) => {
  console.error("[Backend Global Error Handler]:", err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
