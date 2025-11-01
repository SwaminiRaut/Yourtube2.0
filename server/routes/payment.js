import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import User from "../Modals/User.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.plan = "premium";
    user.isPremium = true;
    user.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
    await user.save();

    const pdfBuffer = await generateInvoicePDF(user, razorpay_payment_id, amount);

    await sendPaymentEmail(user.email, pdfBuffer);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      user,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

async function generateInvoicePDF(user, paymentId, amount) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(18).text("YourTube Premium Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${user.username}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Payment ID: ${paymentId}`);
      doc.text(`Amount: ₹${amount}`);
      doc.text(`Plan: Premium (30 days)`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function sendPaymentEmail(to, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"YourTube Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Premium Plan is Active",
    text: "Thank you for upgrading to YourTube Premium! Enjoy unlimited downloads.",
    attachments: [
      {
        filename: "YourTube_Invoice.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}

export default router;
