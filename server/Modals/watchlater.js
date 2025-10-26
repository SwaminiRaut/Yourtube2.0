// import mongoose from "mongoose";

// const watchLaterSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",   // ✅ should match your User model name
//       required: true,
//     },
//     videoid: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Video",  // ✅ should match your Video model name
//       required: true,
//     },
//     likedon: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("WatchLater", watchLaterSchema);


import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    user: {                       // 👈 matches controller now
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",               // ✅ matches your User collection
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",          // ✅ matches your Video collection
      required: true,
    },
    addedOn: {                    // renamed from likedon for clarity
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("watchlaters", watchLaterSchema);
