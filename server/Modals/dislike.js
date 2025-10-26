import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate dislikes by same user on same video
dislikeSchema.index({ video: 1, user: 1 }, { unique: true });

const Dislike = mongoose.models.Dislike || mongoose.model("Dislike", dislikeSchema);

export default Dislike;
