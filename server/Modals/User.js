import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, 
      minlength: 6,
    },
    channelname: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    city: {
      type: String,
    },
    joinedOn: {
      type: Date,
      default: Date.now,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    theme: {
      type: String,
      default: "dark",
    },
    plan: {
      type: String,
      enum: ["free", "bronze", "silver", "gold"],
      default: "free",
    },
    planExpiry: {
      type: Date,
      default: null,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    timezone: {
      type: String,
    },
    phoneNumber: {
      type: String, 
      required: false,
    },
    lastDownloadDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
