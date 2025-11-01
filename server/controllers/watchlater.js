import watchlater from "../Modals/watchlater.js";

export const handlewatchlater = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    const existing = await watchlater.findOne({ user: userId, videoid: videoId });
    
    if (existing) {
      await watchlater.findByIdAndDelete(existing._id);
      return res.status(200).json({ watchlater: false });
    } else {
      await watchlater.create({ user: userId, videoid: videoId });
      return res.status(200).json({ watchlater: true });
    }
  } catch (error) {
    console.error("Watch Later error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallwatchlater = async (req, res) => {
  const { userId } = req.params;

  try {
    const videos = await watchlater
      .find({ user: userId })
      .populate("videoid")
      .exec();

    return res.status(200).json(videos);
  } catch (error) {
    console.error("Get Watch Later error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
