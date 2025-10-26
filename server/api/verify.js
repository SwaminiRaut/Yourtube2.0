// const express = require("express");
// const app = express();
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const PDFDocument = require("pdfkit");
// const User = require("../Modals/User");

// app.use(express.json());

// app.post("/verify", async (req, res) => {
//   const { userId, plan, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

//   // 1️⃣ Verify Razorpay signature
//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//     .digest("hex");

//   if (generatedSignature !== razorpaySignature) {
//     return res.status(400).json({ success: false, message: "Invalid signature" });
//   }

//   // 2️⃣ Update user plan
//   const planExpiry = new Date();
//   planExpiry.setDate(planExpiry.getDate() + 30);
//   await User.findByIdAndUpdate(userId, { plan, planExpiry });

//   // 3️⃣ Send invoice email
//   const user = await User.findById(userId);
//   if (user) {
//     // generate PDF
//     const doc = new PDFDocument();
//     let buffers = [];
//     doc.on("data", buffers.push.bind(buffers));
//     doc.on("end", async () => {
//       const pdfData = Buffer.concat(buffers);

//       // send email
//       const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//       });

//       await transporter.sendMail({
//         from: `"YourTube Clone" <${process.env.SMTP_USER}>`,
//         to: user.email,
//         subject: `Invoice for ${plan} Plan`,
//         text: `Thanks for upgrading to ${plan}!`,
//         attachments: [{ filename: "invoice.pdf", content: pdfData }],
//       });
//       console.log("📧 Email sent to", user.email);
//     });

//     doc.fontSize(20).text("YourTube Clone Invoice", { align: "center" });
//     doc.fontSize(14).text(`Plan: ${plan}`);
//     doc.text(`Amount Paid: ₹${amount / 100}`);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`);
//     doc.end();
//   }

//   res.status(200).json({ success: true, message: "Payment verified, plan updated, email sent" });
// });

// app.listen(5000, () => console.log("Backend running on port 5000"));


const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const User = require("../Modals/User");

app.use(cors({ origin: "http://localhost:3000" })); // allow Next.js dev server
app.use(express.json());

app.post("/verify", async (req, res) => {
  console.log("✅ /verify called with body:", req.body);

  const { userId, plan, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  // 1️⃣ Verify Razorpay signature
  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      console.warn("❌ Invalid Razorpay signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("❌ Error verifying signature:", err);
    return res.status(500).json({ success: false, message: "Server error during verification" });
  }

  // 2️⃣ Update user plan
  try {
    const planExpiry = new Date();
    planExpiry.setDate(planExpiry.getDate() + 30); // 30 days expiry
    await User.findByIdAndUpdate(userId, { plan, planExpiry });
    console.log(`✅ Updated user ${userId} to plan ${plan}`);
  } catch (err) {
    console.error("❌ Error updating user plan:", err);
    return res.status(500).json({ success: false, message: "Server error updating plan" });
  }

  // 3️⃣ Send invoice email
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn("⚠️ User not found for email");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // generate PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      // setup transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      try {
        await transporter.sendMail({
          from: `"YourTube Clone" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: `Invoice for ${plan} Plan`,
          text: `Thanks for upgrading to ${plan}!`,
          attachments: [{ filename: "invoice.pdf", content: pdfData }],
        });
        console.log(`📧 Email sent to ${user.email}`);
      } catch (err) {
        console.error("❌ Error sending email:", err);
      }
    });

    doc.fontSize(20).text("YourTube Clone Invoice", { align: "center" });
    doc.fontSize(14).text(`Plan: ${plan}`);
    doc.text(`Amount Paid: ₹${amount / 100}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();
    console.log("✅ PDF generation triggered");

  } catch (err) {
    console.error("❌ Error in email/PDF generation:", err);
  }

  res.status(200).json({ success: true, message: "Payment verified, plan updated, email process triggered" });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
