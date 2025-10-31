import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

const Premium = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isRazorpayLoaded || !(window as any).Razorpay) {
      toast.error("Razorpay SDK not loaded yet. Please wait a moment...");
      return;
    }

    const response = await fetch("https://yourtube2-0-9t2o.onrender.com/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 199 }),
    });

    const order: any = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 199,
      currency: "INR",
      order_id: order.orderId,
      name: "YourTube Clone",
      description: "Premium Subscription",
      handler: function (paymentResponse: any) {
        toast.success("Payment Successful!");

        if (redirect) {
          router.push(redirect as string);
        } else {
          router.push("/watch");
        }
      },
      prefill: {
        name: "Swamini Raut",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#6B46C1" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-800 to-indigo-300 flex items-center justify-center">
      <div className="h-96 w-96 bg-white rounded-2xl shadow-2xl p-6">
        <h1 className="text-center text-3xl font-bold">Go Premium</h1>
        <p className="text-gray-500">Unlock unlimited downloads & more</p>
        <p className="text-gray-500">Unlimited downloads</p>
        <p className="text-gray-500">Ad-free experience</p>
        <p className="text-gray-500">Priority support</p>
        <h1 className="text-indigo-700 text-center m-3 text-2xl font-bold">Rs.199/month</h1>
        <button
          className={`h-12 border-none rounded-2xl w-full mt-4 transition-all ${
            isRazorpayLoaded
              ? "bg-indigo-500 hover:bg-indigo-600 hover:h-14"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isRazorpayLoaded}
          onClick={handlePayment}
        >
          {isRazorpayLoaded ? "Upgrade Now" : "Loading Payment..."}
        </button>
        <p className="text-gray-400 text-center mt-2">Secure payments powered by Razorpay</p>
      </div>
    </div>
  );
};

export default Premium;
