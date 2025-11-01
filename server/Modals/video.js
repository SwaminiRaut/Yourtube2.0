import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videotitle: { type: String, required: true },
    filename: { type: String, required: true },   
    filetype: { type: String, required: true },
    filepath: { type: String, required: true },
    filesize: { type: String, required: true },
    videochannel: { type: String, required: true },
    Like: { type: [String], default: [] },
    Dislike: { type: [String], default: [] },        
    views: { type: Number, default: 0 },
    uploader: { type: String },
    thumbnail: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("videofiles", videoSchema);
