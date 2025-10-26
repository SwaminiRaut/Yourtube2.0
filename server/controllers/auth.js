// import mongoose from "mongoose";
// import users from "../Modals/Auth.js";
// import nodemailer from "nodemailer";
// import twilio from "twilio";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


// export const login = async (req, res) => {
//   const { email, name, image, city, plan, time, timezone } = req.body;

//   try {
//     const existingUser = await users.findOne({ email });
//     let user = existingUser || await users.create({ email, name, image, city, plan, time, timezone });
//     const normalizedcity = (user.city || "").trim().toLowerCase();
//     let hours;
//     if (user.timezone) {
//       hours = parseInt(new Date().toLocaleString("en-US", { timeZone: user.timezone, hour: "numeric", hour12: false }));
//     } else {
//       hours = new Date(user.time).getHours();
//     }
//     let theme = "dark";
//     const Southstates = ["tamil nadu", "kerala", "karnataka", "andhra", "telangana"];
//     if (hours >= 10 && hours <= 12 && Southstates.includes(normalizedcity)) {
//       theme = "white";
//     }
//     if (!existingUser) {
//       const newUser = user;
//       return res.status(201).json({
//         result: {
//           _id: newUser._id,
//           name: newUser.name,
//           email: newUser.email,
//           image: newUser.image,
//           city: newUser.city || "unknown",
//           plan: newUser.plan || "free",
//           time: newUser.time,
//           theme,
//           timezone: newUser.timezone || "unknown",
//         }
//       });
//     } else {
//       return res.status(200).json({
//         result: {
//           _id: existingUser._id,
//           name: existingUser.name,
//           email: existingUser.email,
//           image: existingUser.image,
//           city: existingUser.city || "unknown",
//           plan: existingUser.plan || "free",
//           time: existingUser.time,
//           theme,
//           timezone: existingUser.timezone || "unknown",
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const getUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await users.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const normalizedcity = (user.city || "").trim().toLowerCase();
//     let theme = "dark";
//     let otp = Math.floor(100000 + Math.random() * 900000);
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 5 * 60 * 1000;
//     await user.save();
//     let hours;
//     if (user.timezone) {
//       hours = parseInt(new Date().toLocaleString("en-US", { timeZone: user.timezone, hour: "numeric", hour12: false }));
//     } else {
//       hours = new Date(user.time).getHours();
//     }
//     const Southstates = ["tamil nadu", "kerala", "karnataka", "andhra", "telangana"];
//     let otpsentvia = "mobile";
//     if (Southstates.includes(normalizedcity)) {
//       otpsentvia = "email";
//       console.log("email otp", otp);
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Your OTP Code",
//         text: `Your OTP is ${user.otp}. It will expire in 5 minutes.`
//       };
//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) console.error(err);
//         else console.log("Email sent:", info.response);
//       });
//     }
//     else {
//       client.messages.create({
//         body: `Your OTP is ${user.otp}. It will expire in 5 minutes.`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: user.phoneNumber   // make sure user model has phoneNumber
//       }).then(message => console.log("SMS sent:", message.sid))
//         .catch(err => console.error(err));

//       console.log("mobile otp", otp);
//     }
//     if (hours >= 10 && hours <= 12 && Southstates.includes(normalizedcity)) {
//       theme = "white";
//     }
//     res.json({ _id: user._id, name: user.name, email: user.email, image: user.image, city: user.city || "unknown", plan: user.plan || "free", time: user.time, theme, otpsentvia });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };


// export const updateprofile = async (req, res) => {
//   const { id: _id } = req.params;
//   const { channelname, description, city, plan, time } = req.body;
//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(500).json({ message: "User unavailable..." });
//   }
//   try {
//     const updatedata = await users.findByIdAndUpdate(
//       _id,
//       {
//         $set: {
//           channelname: channelname,
//           description: description,
//           city,
//           plan,
//           time,
//         },
//       },
//       { new: true }
//     );
//     return res.status(201).json(updatedata);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };


// import mongoose from "mongoose";
// import Users from "../Modals/Auth.js";
// import nodemailer from "nodemailer";
// import twilio from "twilio";

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });


// // Helper: calculate theme based on city and time
// const calculateTheme = (user) => {
//   const SouthStates = ["tamil nadu", "kerala", "karnataka", "andhra", "telangana"];
//   const normalizedCity = (user.city || "").trim().toLowerCase();
//   let hours;

//   if (user.timezone) {
//     hours = parseInt(new Date().toLocaleString("en-US", { timeZone: user.timezone, hour: "numeric", hour12: false }));
//   } else {
//     hours = new Date(user.time).getHours();
//   }

//   if (hours >= 10 && hours <= 12 && SouthStates.includes(normalizedCity)) return "white";
//   return "dark";
// };

// // Helper: generate and send OTP
// // Helper: generate and send OTP
// const sendOTP = async (user) => {
//   const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
//   const SouthStates = ["tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"];
//   const normalizedState = (user.state || "").trim().toLowerCase();
//   const normalizedCity = (user.city || "").trim().toLowerCase();

//   const isSouth = SouthStates.includes(normalizedState) || SouthStates.includes(normalizedCity);
//     console.log("TWILIO_SID inside sendOTP:", process.env.TWILIO_SID);
//   console.log("TWILIO_AUTH_TOKEN inside sendOTP:", process.env.TWILIO_AUTH_TOKEN);
//   console.log("TWILIO_PHONE_NUMBER inside sendOTP:", process.env.TWILIO_PHONE_NUMBER);

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   user.otp = otp;
//   user.otpExpiry = Date.now() + 5 * 60 * 1000;
//   await user.save();

//   if (isSouth) {
//     // ✅ Always email OTP for South India
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. It will expire in 5 minutes.`
//     });
//     return "email";
//   }

//   // ✅ For other states, require phone
//   if (!user.phoneNumber) {
//     return "require-phone"; // 🔑 don't crash, just tell frontend
//   }

//   await client.messages.create({
//     body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: user.phoneNumber
//   });
//   return "mobile";
// };



// // =================== LOGIN ===================
// // export const login = async (req, res) => {
// //   const { email, name, image, city, plan, time, timezone, phoneNumber } = req.body;

// //   try {
// //     let user = await users.findOne({ email });

// //     if (!user) {
// //       // New user
// //       user = await users.create({ email, name, image, city, plan, time, timezone, phoneNumber });
// //     }

// //     const theme = calculateTheme(user);
// //     const otpsentvia = await sendOTP(user);

// //     return res.status(user.isNew ? 201 : 200).json({
// //       result: {
// //         _id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         image: user.image,
// //         city: user.city || "unknown",
// //         plan: user.plan || "free",
// //         time: user.time,
// //         theme,
// //         timezone: user.timezone || "unknown",
// //         otpsentvia,
// //         phoneNumber: user.phoneNumber
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Login error:", error);
// //     return res.status(500).json({ message: "Something went wrong", error: error.message });
// //   }
// // };



// // export const login = async (req, res) => {
// //   const { email, name, image, city, state, plan, time, timezone, phoneNumber } = req.body;

// //   try {
// //     let user = await users.findOne({ email });

// //     if (!user) {
// //       // create new user
// //       user = await users.create({ email, name, image, city, state, plan, time, timezone, phoneNumber });
// //     } else {
// //       // update missing fields (e.g. phone number)
// //       let updated = false;
// //       if (phoneNumber && !user.phoneNumber) {
// //         user.phoneNumber = phoneNumber;
// //         updated = true;
// //       }
// //       if (state && !user.state) {
// //         user.state = state;
// //         updated = true;
// //       }
// //       if (updated) await user.save();
// //     }

// //     const theme = calculateTheme(user);
// //     const otpsentvia = await sendOTP(user);

// //     return res.status(user.isNew ? 201 : 200).json({
// //       result: {
// //         _id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         image: user.image,
// //         city: user.city || "unknown",
// //         state: user.state || "unknown",
// //         plan: user.plan || "free",
// //         time: user.time,
// //         theme,
// //         timezone: user.timezone || "unknown",
// //         otpsentvia,
// //         phoneNumber: user.phoneNumber || "not-provided"
// //       }
// //     });

// //   } catch (error) {
// //     console.error("Login error:", error);
// //     return res.status(500).json({ message: "Something went wrong", error: error.message });
// //   }
// // };


// export const login = async (req, res) => {
//   const { email, name, image, city, state, plan, time, timezone, phoneNumber } = req.body;

//   try {
//     let user = await users.findOne({ email });

//     if (!user) {
//       // create new user
//       user = await users.create({ email, name, image, city, state, plan, time, timezone, phoneNumber });
//     } else {
//       // update missing fields (e.g. phone number)
//       let updated = false;
//       if (phoneNumber && !user.phoneNumber) {
//         user.phoneNumber = phoneNumber;
//         updated = true;
//       }
//       if (state && !user.state) {
//         user.state = state;
//         updated = true;
//       }
//       if (updated) await user.save();
//     }

//     // 🧮 Calculate theme
//     const theme = calculateTheme(user);

//     // 🔐 Send OTP
//     const otpsentvia = await sendOTP(user);

//     // 🧩 Handle missing phone number properly
//     if (otpsentvia === "require-phone") {
//       return res.status(400).json({
//         message: "Phone number required for SMS OTP",
//       });
//     }

//     // ✅ Send successful response
//     return res.status(user.isNew ? 201 : 200).json({
//       message:"login successfull",
//       user,
//       // result: {
//       //   _id: user._id,
//       //   name: user.name,
//       //   email: user.email,
//       //   image: user.image,
//       //   city: user.city || "unknown",
//       //   state: user.state || "unknown",
//       //   plan: user.plan || "free",
//       //   time: user.time,
//       //   theme,
//       //   timezone: user.timezone || "unknown",
//       //   otpsentvia,
//       //   phoneNumber: user.phoneNumber || "not-provided",
//       // },
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ message: "Something went wrong", error: error.message });
//   }
// };

// export const verifyOTP = async (req, res) => {
//   try {
//     const { phoneNumber, otp } = req.body;

//     // 1️⃣ Find user by phone
//     const user = await Users.findOne({ phoneNumber });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // 2️⃣ Verify OTP (replace this with your actual OTP logic)
//     if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

//     // 3️⃣ Clear OTP after successful verification
//     user.otp = null;
//     await user.save();

//     // 4️⃣ Return full user object
//     return res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       user, // ✅ this is critical for frontend login
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// // =================== GET USER ===================
// export const getUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await users.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const normalizedcity = (user.city || "").trim().toLowerCase();
//     let theme = "dark";
//     let otp = Math.floor(100000 + Math.random() * 900000);
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 5 * 60 * 1000;
//     await user.save();

//     let hours;
//     if (user.timezone) {
//       hours = parseInt(new Date().toLocaleString("en-US", { timeZone: user.timezone, hour: "numeric", hour12: false }));
//     } else {
//       hours = new Date(user.time).getHours();
//     }

//     const Southstates = ["tamil nadu", "kerala", "karnataka", "andhra", "telangana"];
//     let otpsentvia = "mobile";
//     if (Southstates.includes(normalizedcity)) {
//       otpsentvia = "email";
//       console.log("email otp", otp);
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Your OTP Code",
//         text: `Your OTP is ${user.otp}. It will expire in 5 minutes.`
//       };
//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) console.error(err);
//         else console.log("Email sent:", info.response);
//       });
//     } else {
//       console.log("mobile otp", otp);
//     }
//     if (!user.phoneNumber && !SouthStates.includes(normalizedCity)) {
//       throw new Error("Phone number required for SMS OTP");
//     }


//     if (hours >= 10 && hours <= 12 && Southstates.includes(normalizedcity)) {
//       theme = "white";
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       image: user.image,
//       city: user.city || "unknown",
//       plan: user.plan || "free",
//       time: user.time,
//       theme,
//       otpsentvia,
//       phoneNumber: user.phoneNumber
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// // =================== UPDATE PROFILE ===================
// export const updateprofile = async (req, res) => {
//   const { id: _id } = req.params;
//   const { channelname, description, city, plan, time } = req.body;
//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(500).json({ message: "User unavailable..." });
//   }
//   try {
//     const updatedata = await users.findByIdAndUpdate(
//       _id,
//       { $set: { channelname, description, city, plan, time } },
//       { new: true }
//     );
//     return res.status(201).json(updatedata);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };




import mongoose from "mongoose";
import Users from "../Modals/Auth.js";
import nodemailer from "nodemailer";
import twilio from "twilio";

// ---------------- Nodemailer transporter ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------------- Helper: calculate theme ----------------
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

// ---------------- Helper: generate and send OTP ----------------
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
    // Always email OTP for South India
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    return "email";
  }

  if (!user.phoneNumber) {
    return "require-phone"; // Tell frontend phone is required
  }

  await client.messages.create({
    body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.phoneNumber,
  });

  return "mobile";
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  const { email, name, image, city, state, plan, time, timezone, phoneNumber } = req.body;

  try {
    let user = await Users.findOne({ email });

    if (!user) {
      // ✅ Create a new user with the entered name
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
      // ✅ Update name if old one is missing or "Guest"
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

// ---------------- VERIFY OTP ----------------
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

// ---------------- GET USER ----------------
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

// ---------------- UPDATE PROFILE ----------------
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
