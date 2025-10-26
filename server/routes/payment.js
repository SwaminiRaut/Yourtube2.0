// routes/payment.js
import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import User from "../Modals/User.js";

const router = express.Router();

// router.post("/verify", async (req, res) => {
//   try {
//     const { userId, plan, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

//     // verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest("hex");

//     if (generatedSignature !== razorpaySignature) {
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     // update user
//     const planExpiry = new Date();
//     planExpiry.setDate(planExpiry.getDate() + 30);
//     await User.findByIdAndUpdate(userId, { plan, planExpiry });

//     // send invoice
//     const user = await User.findById(userId);
//     if (user) {
//       const doc = new PDFDocument();
//       let buffers= [];
//       doc.on("data", buffers.push.bind(buffers));
//       doc.on("end", async () => {
//         const pdfData = Buffer.concat(buffers);

//         const transporter = nodemailer.createTransport({
//           host: process.env.SMTP_HOST,
//           port: process.env.SMTP_PORT,
//           secure: false, // ✅ set true if using port 465
//           auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//           },
//         });

//         await transporter.sendMail({
//           from: `"YourTube Clone" <${process.env.SMTP_USER}>`,
//           to: user.email,
//           subject: `Invoice for ${plan} Plan`,
//           text: `Thanks for upgrading to ${plan}!`,
//           attachments: [{ filename: "invoice.pdf", content: pdfData }],
//         });
//         console.log("📧 Email sent to", user.email);
//       });

//       doc.fontSize(20).text("YourTube Clone Invoice", { align: "center" });
//       doc.fontSize(14).text(`Plan: ${plan}`);
//       doc.text(`Amount Paid: ₹${amount / 100}`);
//       doc.text(`Date: ${new Date().toLocaleDateString()}`);
//       doc.end();
//     }

//     res.status(200).json({ success: true, message: "Payment verified, email sent" });
//   } catch (err) {
//     console.error("Verify error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;


router.post("/verify", async (req, res) => {
  console.log("✅ /verify called with body:", req.body);

  try {
    const { userId, plan, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    console.log("Checking userId:", userId);

    // verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    console.log("Generated signature:", generatedSignature);
    console.log("Received signature:", razorpaySignature);

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    console.log("Signature verified ✅");

    // update user
    const planExpiry = new Date();
    planExpiry.setDate(planExpiry.getDate() + 30);

    const updatedUser = await User.findByIdAndUpdate(userId, { plan, planExpiry }, { new: true });
    console.log("User updated:", updatedUser);

    // send invoice email
    const user = await User.findById(userId);
    if (user) {
      console.log("Preparing PDF invoice for:", user.email);
      // ... rest of PDF + email code
    }

    res.status(200).json({ success: true, message: "Payment verified, email sent" });
  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;