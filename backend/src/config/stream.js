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

    // Also delete any direct message channels involving this user
    // await deleteDirectMessagesChannel(userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

const deleteDirectMessagesChannel = async (userId) => {
  try {
    const channels = await streamClient.queryChannels({
      type: "messaging",
      members: { $in: [userId] },
      member_count: 2,
      id: { $autocomplete: "user_" }, // DM channels have 'user_' prefix
    });
    for (const channel of channels) {
      await channel.delete();
      console.log(`Deleted channel ${channel.id} for user ${userId}`);
    }
  } catch (error) {
    console.error("Error deleting channels for user:", error);
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

export const addUserToPublicChannels = async (newUserId) => {
  console.log("Adding new user to public channels:", newUserId);
  const publicChannels = await streamClient.queryChannels({
    discoverable: true,
  });

  for (const channel of publicChannels) {
    await channel.addMembers([newUserId]);
  }
};
