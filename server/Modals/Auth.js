import mongoose from "mongoose";
const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },
  city: { type: String },
  joinedon: { type: Date, default: Date.now },
  time: { type: Date },
  theme: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  timezone: { type: String },
  phoneNumber: { type: String },
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  subscribersCount: { type: Number, default: 0 },

})
export default mongoose.model("user", userschema);