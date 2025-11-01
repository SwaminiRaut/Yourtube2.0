import mongoose from "mongoose";

const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles", 
      required: true,
    },
    likes:{
      type:Number,
      default:0
    },
    dislikes:{
      type:Number,
      default:0
    },
    city:{
      type:String,
      required:false,
      default:"unknown"
    },
    commentbody: {
      type: String,
      required: true,
      trim: true,
    },
    commentedon: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comment", commentschema);
