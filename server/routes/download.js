import express from "express";
import { handleDownload, getAllDownloads, removeDownload } from "../controllers/download.js";
const router = express.Router();
router.post("/:videoId", handleDownload);
router.get("/:userId", getAllDownloads);
router.delete("/:downloadId", removeDownload);
export default router;