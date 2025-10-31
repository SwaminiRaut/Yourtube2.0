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
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order.id);

    res.json({ success: true, orderId: order.id, amount });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { userId, plan, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const planExpiry = new Date();
    planExpiry.setDate(planExpiry.getDate() + 30);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { plan, planExpiry },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Payment verified for:", updatedUser.email);

    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (data) => buffers.push(data));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      try {
        await transporter.sendMail({
          from: `"YourTube Premium" <${process.env.SMTP_USER}>`,
          to: updatedUser.email,
          subject: `Invoice for ${plan} Plan`,
          text: `Thank you for upgrading to the ${plan} plan on YourTube!`,
          attachments: [
            {
              filename: "invoice.pdf",
              content: pdfData,
            },
          ],
        });

        console.log("Invoice sent to:", updatedUser.email);
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }
    });

    doc.fontSize(20).text("YourTube Premium Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Customer: ${updatedUser.name || updatedUser.email}`);
    doc.text(`Plan: ${plan}`);
    doc.text(`Amount Paid: ₹${amount / 100}`);
    doc.text(`Payment ID: ${razorpayPaymentId}`);
    doc.text(`Order ID: ${razorpayOrderId}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text("Thank you for your purchase!", { align: "center" });
    doc.end();

    res.status(200).json({
      success: true,
      message: "Payment verified and invoice email sent",
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
