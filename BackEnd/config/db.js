const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn("MongoDB Atlas connection failed:", error.message);
    console.log("Attempting fallback to local MongoDB...");
    try {
      const conn = await mongoose.connect("mongodb://127.0.0.1:27017/shopnest", {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`Local MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (localErr) {
      console.error("Local MongoDB connection also failed:", localErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;