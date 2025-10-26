import video from "../Modals/video.js";
import like from "../Modals/like.js";

// ✅ Handle Like
export const handleLike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    const existing = await like.findOne({ viewer: userId, video: videoId });

    if (existing && existing.type === "like") {
      // Remove like
      await like.findByIdAndDelete(existing._id);
      await video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
      return res.status(200).json({ liked: false });
    } else {
      // If previously disliked, remove that
      if (existing && existing.type === "dislike") {
        await like.findByIdAndDelete(existing._id);
        await video.findByIdAndUpdate(videoId, { $inc: { dislikes: -1 } });
      }
      // Add like
      await like.create({ viewer: userId, video: videoId, type: "like" });
      await video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Handle Dislike
export const handleDislike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    const existing = await like.findOne({ viewer: userId, video: videoId });

    if (existing && existing.type === "dislike") {
      // Remove dislike
      await like.findByIdAndDelete(existing._id);
      await video.findByIdAndUpdate(videoId, { $inc: { dislikes: -1 } });
      return res.status(200).json({ disliked: false });
    } else {
      // If previously liked, remove that
      if (existing && existing.type === "like") {
        await like.findByIdAndDelete(existing._id);
        await video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });
      }
      // Add dislike
      await like.create({ viewer: userId, video: videoId, type: "dislike" });
      await video.findByIdAndUpdate(videoId, { $inc: { dislikes: 1 } });
      return res.status(200).json({ disliked: true });
    }
  } catch (error) {
    console.error("Error handling dislike:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ Get all liked videos for a user
export const getAllLikedVideos = async (req, res) => {
  const { userId } = req.params;

  try {
    const likedVideos = await like
      .find({ viewer: userId, type: "like" })
      .populate("video");

    return res.status(200).json(likedVideos);
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

