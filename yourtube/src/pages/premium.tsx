"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/AuthContext";

const Premium = ({ videoId }: { videoId: string }) => {
  const router = useRouter();
  const { user } = useUser();

  const handlePayment = async () => {
    if (!user) {
      alert("Please log in to continue.");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://yourtube2-0-9t2o.onrender.com/create-order",
        { amount: 499 }
      );

      if (!data?.order?.id) {
        throw new Error("Order creation failed");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "YourTube Premium",
        description: "Video Download Access",
        order_id: data.order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post(
              "https://yourtube2-0-9t2o.onrender.com/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                videoId,
                userId: user._id,
              }
            );

            if (verifyRes.data.success) {
              alert("Payment Successful");
              router.push(`/watch/${videoId}`);
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Something went wrong after payment.");
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email,
        },
        theme: {
          color: "#F87171",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        Unlock Premium Access 
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Pay ₹499 to download this video in full HD and enjoy premium access.
      </p>
      <Button onClick={handlePayment} className="bg-red-600 hover:bg-red-700">
        Pay ₹499 & Download
      </Button>
    </div>
  );
};

export default Premium;
