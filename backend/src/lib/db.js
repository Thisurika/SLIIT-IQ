import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL || ENV.DB_URL.includes("<db_username>")) {
      console.warn("⚠️ DB_URL is not configured; skipping MongoDB connection.");
      return false;
    }

    const conn = await mongoose.connect(ENV.DB_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Connected to MongoDB:", conn.connection.host);
    return true;
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed; continuing without DB:", error.message);
    return false;
  }
};

  
