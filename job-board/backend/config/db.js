// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI missing in environment variables");
      throw new Error("MONGO_URI is not defined");
    }

    // Recommended for latest Mongoose versions
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30s timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:");
    console.error("Reason:", error.message);
    console.error("Stack:", error);

    // Don't hard-exit, just fail gracefully on Render
    throw error;
  }
};

export default connectDB;
