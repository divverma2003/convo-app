import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

// Communication with Stream API
const streamClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);

export const upsertStreamUser = async (userData) => {
  try {
    // id, image, name, email
    await streamClient.upsertUser(userData);
    console.log("Stream user upserted:", userData.name);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("Stream user deleted:", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

// stream function for authentication (on stream end)
export const generateStreamToken = (userId) => {
  try {
    const userIdString = userId.toString();
    const token = streamClient.createToken(userIdString);
    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return null;
  }
};
