const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("WARNING: MONGO_URI is missing in environment variables!");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Atlas Connection Error:", error.message);

    // On cloud servers (Render/Vercel), do NOT fall back to local 127.0.0.1 or exit process
    if (process.env.NODE_ENV === "production" || process.env.RENDER || process.env.PORT) {
      console.error(
        "CRITICAL NOTICE for Render Deployment: Please ensure 0.0.0.0/0 (Allow Everywhere) is added to your MongoDB Atlas Network Access IP Whitelist."
      );
    } else {
      console.log("Attempting local MongoDB fallback...");
      try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/shopnest", {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`Local MongoDB Connected Successfully: ${conn.connection.host}`);
      } catch (localErr) {
        console.error("Local MongoDB connection failed:", localErr.message);
      }
    }
  }
};

module.exports = connectDB;