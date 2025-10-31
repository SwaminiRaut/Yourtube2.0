import mongoose from "mongoose";
import Download from "../Modals/download.js"; 
import User from "../Modals/User.js";
export const handleDownload = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ success: false, message: "Missing userId or videoId" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.plan !== "free" && user.planExpiry && new Date() > new Date(user.planExpiry)) {
      user.plan = "free";
      user.isPremium = false;
      user.planExpiry = null;
      await user.save();
    }

    if (user.plan !== "free") {
      const newDownload = new Download({ user: userId, video: videoId });
      await newDownload.save();

      return res.status(201).json({
        success: true,
        downloaded: true,
        message: `Video downloaded successfully (${user.plan} plan)`,
      });
    }

    const today = new Date();
    const lastDownload = user.lastDownloadDate ? new Date(user.lastDownloadDate) : null;

    if (lastDownload) {
      const sameDay =
        today.getFullYear() === lastDownload.getFullYear() &&
        today.getMonth() === lastDownload.getMonth() &&
        today.getDate() === lastDownload.getDate();

      if (sameDay) {
        return res.status(403).json({
          success: false,
          reason: "limit_reached",
          message: "Free users can download only one video per day.",
          redirectUrl: "https://yourtube2-0-five.vercel.app/premium", // ⚡ use your real URL
        });
      }
    }

    const newDownload = new Download({ user: userId, video: videoId });
    await newDownload.save();

    user.lastDownloadDate = today;
    await user.save();

    return res.status(201).json({
      success: true,
      downloaded: true,
      message: "Video downloaded successfully (free plan)",
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllDownloads = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const downloads = await Download.find({ user: userId })
      .populate("video")
      .sort({ createdAt: -1 });

    res.status(200).json(downloads);
  } catch (error) {
    console.error("Error fetching downloads:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const removeDownload = async (req, res) => {
  try {
    const { downloadId } = req.params;

    if (!downloadId) {
      return res.status(400).json({ message: "Missing downloadId" });
    }

    await Download.findByIdAndDelete(downloadId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing download:", error);
    res.status(500).json({ message: "Failed to remove download", error: error.message });
  }
};

