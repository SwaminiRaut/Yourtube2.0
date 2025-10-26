import express from "express";
import Comment from "../Modals/comment.js"; // ✅ VERY IMPORTANT

import {
  postcomment,
  getallcomment,
  deletecomment,
  editcomment,
} from "../controllers/comment.js";

const router = express.Router();

router.post("/postcomment", postcomment);
router.get("/:videoid", getallcomment);
router.delete("/deletecomment/:id", deletecomment);
router.patch("/editcomment/:id", editcomment); // ✅ PATCH used

router.put("/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.likes = (comment.likes || 0) + 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ message: "Server error while liking comment" });
  }
});

router.put("/:id/dislike", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.dislikes = (comment.dislikes || 0) + 1;

    if (comment.dislikes >= 2) {
      await comment.deleteOne();
      return res.json({ message: "Comment removed due to dislikes" });
    }

    await comment.save();
    res.json({ dislikes: comment.dislikes });
  } catch (err) {
    console.error("Error disliking comment:", err);
    res.status(500).json({ message: "Server error while disliking comment" });
  }
});
export default router;



