import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

const Premium = () => {
  const router = useRouter();
  const { videoId } = router.query;
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

  const handlePayment = async (id?: string) => {
    if (!isRazorpayLoaded || !(window as any).Razorpay) {
      toast.error("Razorpay SDK not loaded yet. Please wait a moment...");
      return;
    }

    try {
      const response = await fetch(
        "https://yourtube2-0-9t2o.onrender.com/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 199 }),
        }
      );

      const order = await response.json();

      if (!order?.orderId) {
        toast.error("Error creating Razorpay order");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 199 * 100,
        currency: "INR",
        order_id: order.orderId,
        name: "YourTube Premium",
        description: "Unlock premium access and downloads",
        handler: async function (response: any) {
          try {
            await fetch("https://yourtube2-0-9t2o.onrender.com/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            toast.success("Payment successful!");
            const redirectId = id || (videoId as string);
            if (redirectId)
              window.location.href = `https://yourtube2-0-five.vercel.app/watch/${redirectId}`;
            else window.location.href = "https://yourtube2-0-five.vercel.app/";
          } catch (error) {
            toast.error("Payment verification failed!");
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

      rzp.on("payment.failed", function () {
        toast.error("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-800 to-indigo-300 flex items-center justify-center">
      <div className="h-96 w-96 bg-white rounded-2xl shadow-2xl p-6">
        <h1 className="text-center text-3xl font-bold">Go Premium</h1>
        <p className="text-gray-500 text-center mb-2">
          Unlock unlimited downloads & more
        </p>
        <ul className="text-gray-600 list-disc list-inside mb-3">
          <li>Unlimited downloads</li>
          <li>Ad-free experience</li>
          <li>Priority support</li>
        </ul>
        <h1 className="text-indigo-700 text-center m-3 text-2xl font-bold">
          ₹199/month
        </h1>

        <button
          onClick={() => handlePayment("670d5b1c9f12a1fcd34f8b90")} 
          disabled={!isRazorpayLoaded}
          className={`h-12 border-none rounded-2xl w-full mt-4 transition-all ${
            isRazorpayLoaded
              ? "bg-indigo-500 hover:bg-indigo-600 hover:h-14"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isRazorpayLoaded ? "Upgrade Now" : "Loading Payment..."}
        </button>

        <p className="text-gray-400 text-center mt-2">
          Secure payments powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default Premium;
