import express from "express";
import { activatePlan } from "../controllers/user.js";

const router = express.Router();

router.post("/activate-plan", activatePlan);

export default router;
