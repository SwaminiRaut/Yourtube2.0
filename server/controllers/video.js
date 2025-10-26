

// export const uploadvideo = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "Please upload an mp4 video file only" });
//   }

//   try {
//     const file = new video({
//       videotitle: req.body.videotitle,
//       filename: req.file.filename,
//       filetype: req.file.mimetype,
//       filepath: `/uploads/${req.file.filename}`, // ✅ Always forward slash + leading /
//       filesize: req.file.size,
//       videochannel: req.body.videochannel,
//       uploader: req.body.uploader,
//     });

//     await file.save();
//     return res.status(201).json("File uploaded successfully");
//   } catch (error) {
//     console.error("Error uploading video:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

import video from "../Modals/video.js";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const uploadvideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an mp4 video file only" });
  }

  try {
    // Ensure uploads folder exists
    const uploadsFolder = path.join(process.cwd(), "server", "uploads");
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    // Save video info to DB
    const file = new video({
      videotitle: req.body.videotitle,
      filename: req.file.filename,
      filetype: req.file.mimetype,
      filepath: `/uploads/${req.file.filename}`,
      filesize: req.file.size,
      videochannel: req.body.videochannel,
      uploader: req.body.uploader,
    });

    await file.save();

    // Generate thumbnail (first frame)
    const videoPath = path.join(uploadsFolder, req.file.filename);
    const thumbnailFilename = `${req.file.filename}-thumbnail.png`;
    const thumbnailPath = `/uploads/${req.file.filename}-thumbnail.png`;

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ["00:00:01"], // first second
        filename: thumbnailFilename,
        folder: uploadsFolder,
        size: "320x240",
      })
      .on("end", async () => {
        console.log("✅ Thumbnail generated successfully!");
        // Save thumbnail path to DB
        file.thumbnail =  `/uploads/${req.file.filename}-thumbnail.png`;
        await file.save();
      })
      .on("error", (err) => {
        console.error("❌ Thumbnail generation error:", err);
      });

    return res.status(201).json({ 
      message: "File uploaded successfully", 
      thumbnail: `/uploads/${thumbnailFilename}` 
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Like a video
// 📁 controllers/video.js
export const likeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const vid = await video.findById(req.params.id);
    if (!vid) return res.status(404).json({ message: "Video not found" });

    if (vid.Like.includes(userId)) {
      // If already liked → remove like
      vid.Like = vid.Like.filter(id => id !== userId);
    } else {
      // Add like → remove dislike
      vid.Like.push(userId);
      vid.Dislike = vid.Dislike.filter(id => id !== userId);
    }

    await vid.save();
    return res.json({
      liked: vid.Like.includes(userId),
      totalLikes: vid.Like.length,
      totalDislikes: vid.Dislike.length
    });
  } catch (err) {
    console.error("❌ Like video error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const dislikeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const vid = await video.findById(req.params.id);
    if (!vid) return res.status(404).json({ message: "Video not found" });

    if (vid.Dislike.includes(userId)) {
      // remove dislike
      vid.Dislike = vid.Dislike.filter(id => id !== userId);
    } else {
      // add dislike and remove like
      vid.Dislike.push(userId);
      vid.Like = vid.Like.filter(id => id !== userId);
    }

    await vid.save();
    return res.json({
      disliked: vid.Dislike.includes(userId),
      totalLikes: vid.Like.length,
      totalDislikes: vid.Dislike.length
    });
  } catch (err) {
    console.error("❌ Dislike video error:", err);
    res.status(500).json({ message: err.message });
  }
};
