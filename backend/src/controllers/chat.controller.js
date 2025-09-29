import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    // we have req.auth from clerk middleware
    const token = generateStreamToken(req.auth().userId);
    console.log("Generated Stream token for user:", token);
    res
      .status(200)
      .json({ message: "Token generated successfully", data: { token } });
  } catch (error) {
    console.error("Error in getStreamToken:", error);
    res.status(500).json({ message: "Failed to generate token" });
  }
};
