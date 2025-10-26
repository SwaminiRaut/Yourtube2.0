import express from "express";
import { getallvideo, uploadvideo, likeVideo, dislikeVideo } from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";

const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);
routes.get("/getall", getallvideo);
routes.post("/like/:id", likeVideo);
routes.post("/dislike/:id", dislikeVideo);

export default routes;