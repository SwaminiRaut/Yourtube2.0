import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amount } = req.body; 

    const options = {
      amount: amount*100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ success: true, orderId: order.id });
  } catch (err: any) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
