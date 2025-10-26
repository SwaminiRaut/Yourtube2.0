import User from "../Modals/User.js";

export const activatePlan = async (req, res) => {
  try {
    const { userId, planType } = req.body; // "bronze", "silver", or "gold"
    const duration = 30; // days

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + duration);

    user.plan = planType;
    user.planExpiry = expiry;
    user.isPremium = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `${planType} plan activated for ${duration} days.`,
    });
  } catch (error) {
    console.error("Plan activation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
