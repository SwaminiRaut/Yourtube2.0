import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videotitle: { type: String, required: true },
    filename: { type: String, required: true },   // keep only once
    filetype: { type: String, required: true },
    filepath: { type: String, required: true },   // lowercase is correct
    filesize: { type: String, required: true },
    videochannel: { type: String, required: true },
    Like: { type: [String], default: [] },
    Dislike: { type: [String], default: [] },         // add this if needed
    views: { type: Number, default: 0 },
    uploader: { type: String },
    thumbnail: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("videofiles", videoSchema);
