import Users from "../Modals/Auth.js";

export const subscribeChannel = async (req, res) => {
  try {
    const { userId } = req.body;
    const { channelId } = req.params;

    if (!userId || !channelId) {
      return res.status(400).json({ message: "Missing userId or channelId" });
    }

    const user = await Users.findById(userId);
    const channel = await Users.findById(channelId);

    if (!user || !channel) {
      return res.status(404).json({ message: "User or Channel not found" });
    }

    const isSubscribed = user.subscriptions?.includes(channelId);

    if (isSubscribed) {
      user.subscriptions = user.subscriptions.filter((id) => id.toString() !== channelId);
      channel.subscribersCount = Math.max((channel.subscribersCount || 0) - 1, 0);
      await user.save();
      await channel.save();
      return res.json({ success: true, message: "Unsubscribed" });
    } else {
      user.subscriptions = [...(user.subscriptions || []), channelId];
      channel.subscribersCount = (channel.subscribersCount || 0) + 1;
      await user.save();
      await channel.save();
      return res.json({ success: true, message: "Subscribed successfully" });
    }
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
