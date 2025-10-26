import express from "express";
import { handleLike, handleDislike, getAllLikedVideos } from "../controllers/like.js";

const router = express.Router();

router.post("/like/:videoId", handleLike);
router.post("/dislike/:videoId", handleDislike);
router.get("/:userId", getAllLikedVideos);

export default router;
