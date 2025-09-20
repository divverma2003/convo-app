import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/User.model.js";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "convo-app" });
const syncUser = inngest.createFunction(
  { id: "sync-user", name: "Sync User" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data; // available data from clerk user.created event
    const newUser = new User({
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
      clerkId: id,
    });

    await newUser.save();

    // TODO: handle errors and edge cases
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user", name: "Delete User" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
    // TODO: handle errors and edge cases
  }
);
// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB];
