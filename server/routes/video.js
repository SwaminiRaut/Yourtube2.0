import express from "express";
import { getallvideo, uploadvideo, likeVideo, dislikeVideo } from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";
import Video from "../Modals/video.js";

const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);
routes.get("/getall", getallvideo);
routes.get("/get/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    res.status(200).json({ success: true, video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
routes.post("/like/:id", likeVideo);
routes.post("/dislike/:id", dislikeVideo);

export default routes;
