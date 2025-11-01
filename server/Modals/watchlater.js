import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    user: {                       
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",           
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",          
      required: true,
    },
    addedOn: {                  
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("watchlaters", watchLaterSchema);
