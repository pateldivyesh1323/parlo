import mongoose from "mongoose";
import environments from "../environments";

const connectDB = async () => {
  try {
    if (!environments.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(environments.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default connectDB;
