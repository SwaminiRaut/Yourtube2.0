import express from "express";
import { login, updateprofile, getUser, verifyOTP } from "../controllers/auth.js";
const routes = express.Router();



routes.post("/login", login);
routes.post("/verify", verifyOTP);
routes.patch("/update/:id", updateprofile);
routes.get("/:id", getUser);

// ✅ New route to fetch user info by ID
routes.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      city: user.city || "unknown", // send city
      time:user.time,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default routes;