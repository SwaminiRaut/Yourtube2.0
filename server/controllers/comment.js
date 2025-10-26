import comment from "../Modals/comment.js";
import mongoose from "mongoose";

export const postcomment = async (req, res) => {
  const { userid, videoid, commentbody, usercommented, city } = req.body;

  if (!userid || !videoid || !commentbody) {
    return res.status(400).json({ message: "userid, videoid, commentbody is required" });
  }

  const validcomment = /^[\p{L}\p{N}\s.,!?'"-]+$/u;
  if (!validcomment.test(commentbody)) {
    return res.status(400).json({ message: "Invalid message" });
  }

  try {
    const newComment = new comment({
      userid,
      videoid,
      commentbody,
      usercommented,
      city: city || "unknown"
    });

    // ✅ Save first
    await newComment.save();

    // ✅ Then populate after saving
    const populatedComment = await newComment.populate("userid", "_id name image city");
    
    return res.status(201).json({
      success: true,
      newComment: populatedComment
    });

  } catch (error) {
    console.error("Error saving comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await comment.find({ videoid }).populate("userid", "name email image").sort({ createdAt: -1 });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error("Get comment error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }

  try {
    const updatedComment = await comment.findByIdAndUpdate(
      _id,
      { $set: { commentbody } },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Edit comment error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

