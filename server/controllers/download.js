import mongoose from "mongoose";
import Download from "../Modals/download.js";  // check correct path
import User from "../Modals/User.js";


// Toggle download
// export const handleDownload = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const { videoId } = req.params;

//     if (!userId || !videoId) {
//       return res.status(400).json({ success: false, message: "Missing userId or videoId" });
//     }

//     // 🔍 1️⃣ Check if user exists and get plan type
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // ⚡ If user is premium → allow unlimited downloads
//     if (user.plan === "premium") {
//       const newDownload = new Download({ user: userId, video: videoId });
//       await newDownload.save();
//       return res.status(201).json({
//         success: true,
//         message: "Video downloaded successfully (premium user)",
//       });
//     }

//     // 🕐 2️⃣ For free users → check daily limit
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const existingDownload = await Download.findOne({
//       user: userId,
//       downloadedOn: { $gte: startOfDay, $lte: endOfDay },
//     });

//     if (existingDownload) {
//       return res.status(200).json({
//         success: false,
//         reason: "limit_reached",
//         message: "Free users can only download one video per day",
//       });
//     }

//     // 🆕 3️⃣ Allow first download of the day
//     const newDownload = new Download({
//       user: userId,
//       video: videoId,
//     });
//     await newDownload.save();

//     return res.status(201).json({
//       success: true,
//       message: "Video downloaded successfully (free user)",
//     });
//   } catch (error) {
//     console.error("Download error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };


export const handleDownload = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ success: false, message: "Missing userId or videoId" });
    }

    // 1️⃣ Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Auto-expire plan if expired
    if (user.plan !== "free" && user.planExpiry && new Date() > new Date(user.planExpiry)) {
      user.plan = "free";
      user.isPremium = false;
      user.planExpiry = null;
      await user.save();
    }

    // 3️⃣ Premium users → unlimited downloads
    if (user.plan !== "free") {
      const newDownload = new Download({ user: userId, video: videoId });
      await newDownload.save();

      return res.status(201).json({
        success: true,
        downloaded: true,
        message: `Video downloaded successfully (${user.plan} plan)`,
      });
    }

    // 4️⃣ Free user logic → only one download per day
    const today = new Date();
    const lastDownload = user.lastDownloadDate ? new Date(user.lastDownloadDate) : null;

    if (lastDownload) {
      const sameDay =
        today.getFullYear() === lastDownload.getFullYear() &&
        today.getMonth() === lastDownload.getMonth() &&
        today.getDate() === lastDownload.getDate();

      // ✅ PLACE THE REDIRECT HERE 👇
      if (sameDay) {
        return res.status(403).json({
          success: false,
          reason: "limit_reached",
          message: "Free users can download only one video per day.",
          redirectUrl: "http://localhost:3000/premium", // ⚡ use your real URL
        });
      }
    }

    // 5️⃣ Allow first download of the day
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
// Get all downloads for user
// export const getAllDownloads = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // ✅ Validate userId
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid or missing user ID" });
//     }

//     // ✅ Convert string to ObjectId
//     const downloads = await Download.find({ user: new mongoose.Types.ObjectId(userId) })
//       .populate("video")
//       .exec();
//     console.log("Downloads from DB", downloads)

//     // Optional: remove downloads with missing video
//     const filteredDownloads = downloads.filter(d => d.video !== null);

//     res.status(200).json(filteredDownloads);
//   } catch (error) {
//     console.error("Error fetching downloads:", error);
//     res.status(500).json({ message: "Something went wrong", error: error.message });
//   }
// };

export const getAllDownloads = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const downloads = await Download.find({ user: userId })
      .populate("video") // ✅ fetch full video details
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

