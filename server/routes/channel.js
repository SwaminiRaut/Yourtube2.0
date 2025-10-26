import express from "express";
import { subscribeChannel } from "../controllers/channel.js";
const router = express.Router();

router.post("/subscribe/:channelId", subscribeChannel);

export default router;
