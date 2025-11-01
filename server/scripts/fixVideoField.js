import mongoose from "mongoose";
import dotenv from "dotenv";
import video from "../Modals/video.js";

dotenv.config();

const DBURL = process.env.DB_URL;

if (!DBURL) {
  console.error("DB_URL is missing in your .env file");
  process.exit(1);
}

const fixVideoField = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("Connected to MongoDB");

    const result = await video.updateMany(
      { videochannel: { $exists: false } }, 
      { $set: { videochannel: "Unknown Channel" } }
    );

    console.log(`Fixed ${result.modifiedCount} documents`);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error fixing videochannel field:", error);
    process.exit(1);
  }
};

fixVideoField();
