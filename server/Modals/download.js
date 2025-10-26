import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // should match your User model name
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",  // should match your Video model name
      required: true,
    },
    downloadedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Download", downloadSchema);
