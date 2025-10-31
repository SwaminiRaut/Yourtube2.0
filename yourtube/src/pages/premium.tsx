"use client";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// @ts-ignore
declare global {
  interface Window {
    Razorpay: any;
  }
}


export default function PremiumPage() {
  const router = useRouter();
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  const handlePayment = async () => {
    if (!user?._id) return alert("Please log in first");

    const { data: order } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/create-order`, {
      amount: 199,
    });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: "INR",
      name: "YourTube Premium",
      description: "Upgrade to premium",
      order_id: order.orderId,
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/verify`, {
            userId: user._id,
            plan: "Premium",
            amount: order.amount * 100,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (res.data.success) {
            alert("Payment successful! You are now premium.");
            localStorage.setItem("user", JSON.stringify({ ...user, plan: "Premium" }));
            router.push("/");
          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          alert("Payment verification failed");
        }
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: "#6C63FF" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-600 to-blue-400">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-3">Go Premium</h1>
        <p className="text-gray-600 mb-2">Unlock unlimited downloads & more</p>
        <p className="font-semibold text-xl mb-6">₹199/month</p>
        <button
          onClick={handlePayment}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
