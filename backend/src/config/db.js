import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log("MongoDB connection successful:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};
