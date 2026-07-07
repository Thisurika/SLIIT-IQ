import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/user.js";


export const inngest = new Inngest({ id: "SLIIT-IQ" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    }

    await User.create(newUSer)
  }

)

export const functions = { syncUser }

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user" },
  { event : "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    // todo: do sth else
  }

);

export const functions = { syncUser,deleteUserFromDB };

