const express = require("express");
const app = express();
const cors = require("cors");
const User = require("../Modals/User");

app.use(cors({ origin: "http://localhost:3000" })); // allow Next.js dev server
app.use(express.json());
app.post("/verify-otp", async (req, res) => {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    try {
        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(401).json({ message: "Invalid or expired otp" });
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully",
            user: { _id: user._id, name: user.name, email: user.email, city: user.city, plan: user.plan },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
})