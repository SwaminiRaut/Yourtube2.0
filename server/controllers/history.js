// import video from "../Modals/video.js";
// import history from "../Modals/history.js";

// export const handlehistory = async (req, res) => {
//   const { userId } = req.body;
//   const { videoId } = req.params;

//   try {
//     // ✅ FIXED: changed `video` -> `videoid`
//     await history.create({
//       viewer: userId,
//       videoid: videoId,
//     });

//     await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

//     return res.status(200).json({ history: true });
//   } catch (error) {
//     console.error("Login error", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const handleview = async (req, res) => {
//   const { videoId } = req.params;

//   try {
//     await video.findByIdAndUpdate(videoId, { $inc: { views: -1 } });
//     return res.status(200).json({ message: "View removed" });
//   } catch (error) {
//     console.error("Error in handleview:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const getallhistoryVideo = async (req, res) => {
//   const { userId } = req.params;
//   console.log("Fetching history for userId:", userId);

//   try {
//     const historyvideo = await history
//       .find({ viewer: userId })
//       .populate({
//         path: "videoid",
//         model: "videofiles",
//       })
//       .exec();

//     console.log("History found:", historyvideo.length);
//     return res.status(200).json(historyvideo);
//   } catch (error) {
//     console.error("History error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };


import video from "../Modals/video.js";
import history from "../Modals/history.js";

// ✅ For logged-in users
export const handlehistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    await history.create({
      viewer: userId,
      videoid: videoId,
    });

    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ For guests (not logged-in)
export const handleview = async (req, res) => {
  const { videoId } = req.params;

  try {
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }); // ✅ FIXED increment
    return res.status(200).json({ message: "View added" });
  } catch (error) {
    console.error("Error in handleview:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallhistoryVideo = async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching history for userId:", userId);

  try {
    const historyvideo = await history
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .exec();

    console.log("History found:", historyvideo.length);
    return res.status(200).json(historyvideo);
  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
