import mongoose from "mongoose";
import Users from "../Modals/Auth.js";
import nodemailer from "nodemailer";
import twilio from "twilio";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const calculateTheme = (user) => {
  const SouthStates = ["tamil nadu", "kerala", "karnataka", "andhra", "telangana"];
  const normalizedCity = (user.city || "").trim().toLowerCase();
  let hours;

  if (user.timezone) {
    hours = parseInt(
      new Date().toLocaleString("en-US", { timeZone: user.timezone, hour: "numeric", hour12: false })
    );
  } else {
    hours = new Date(user.time).getHours();
  }

  if (hours >= 10 && hours <= 12 && SouthStates.includes(normalizedCity)) return "white";
  return "dark";
};

const sendOTP = async (user) => {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  const SouthStates = ["tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"];
  const normalizedState = (user.state || "").trim().toLowerCase();
  const normalizedCity = (user.city || "").trim().toLowerCase();

  const isSouth = SouthStates.includes(normalizedState) || SouthStates.includes(normalizedCity);

  console.log("TWILIO_SID inside sendOTP:", process.env.TWILIO_SID);
  console.log("TWILIO_AUTH_TOKEN inside sendOTP:", process.env.TWILIO_AUTH_TOKEN);
  console.log("TWILIO_PHONE_NUMBER inside sendOTP:", process.env.TWILIO_PHONE_NUMBER);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  if (isSouth) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    return "email";
  }

  if (!user.phoneNumber) {
    return "require-phone"; 
  }

  await client.messages.create({
    body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.phoneNumber,
  });

  return "mobile";
};

export const login = async (req, res) => {
  const { email, name, image, city, state, plan, time, timezone, phoneNumber } = req.body;

  try {
    let user = await Users.findOne({ email });

    if (!user) {
      user = await Users.create({
        email,
        name: name && name !== "Guest" ? name : "User",
        image,
        city,
        state,
        plan,
        time,
        timezone,
        phoneNumber,
      });
    } else {
      let updated = false;
      if (name && name !== "Guest" && user.name === "Guest") {
        user.name = name;
        updated = true;
      }
      if (phoneNumber && !user.phoneNumber) {
        user.phoneNumber = phoneNumber;
        updated = true;
      }
      if (state && !user.state) {
        user.state = state;
        updated = true;
      }
      if (updated) await user.save();
    }


    const theme = calculateTheme(user);
    const otpsentvia = await sendOTP(user);

    if (otpsentvia === "require-phone") {
      return res.status(400).json({ message: "Phone number required for SMS OTP" });
    }

    return res.status(user.isNew ? 201 : 200).json({
      message: "Login successful",
      user,
      theme: calculateTheme(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await Users.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user,
      theme: calculateTheme(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const normalizedCity = (user.city || "").trim().toLowerCase();
    let theme = calculateTheme(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      city: user.city || "unknown",
      plan: user.plan || "free",
      time: user.time,
      theme,
      phoneNumber: user.phoneNumber || "not-provided",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description, city, plan, time } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "User unavailable..." });
  }

  try {
    const updatedData = await Users.findByIdAndUpdate(
      _id,
      { $set: { channelname, description, city, plan, time } },
      { new: true }
    );
    return res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
