import express from "express";
import { activatePlan } from "../controllers/user.js";

const router = express.Router();

// POST /user/activate-plan
router.post("/activate-plan", activatePlan);

export default router;
