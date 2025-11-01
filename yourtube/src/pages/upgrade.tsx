import { useEffect } from "react";

const Upgrade = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (plan: "Bronze" | "Silver" | "Gold", rupees: number) => {
  try {
    const orderRes = await fetch("https://yourtube2-0-9t2o.onrender.com/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: rupees * 100 }), 
    });

    if (!orderRes.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    const order = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "YourTube Clone",
      description: `${plan} Plan Subscription`,
      handler: async function (res: any) {
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("User not logged in!");

        const verifyRes = await fetch("https://yourtube2-0-9t2o.onrender.com/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayPaymentId: res.razorpay_payment_id,
            razorpayOrderId: res.razorpay_order_id,
            razorpaySignature: res.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) return alert("Payment verification failed");

        await fetch("https://yourtube2-0-9t2o.onrender.com/user/activate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, planType: plan }),
        });

        alert(`${plan} plan activated!`);
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
  } catch (err) {
    console.error(err);
    alert("Payment failed. Try again.");
  }
};


  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-500 to-purple-700">
      <h1 className="font-bold text-3xl text-white mb-6 ml-14 mt-6">Upgrade Your Plan</h1>
      <div className="flex justify-evenly items-center">

        <div className="h-72 w-64 rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-y-4 transform transition-transform duration-300 hover:scale-110">
          <div className="bg-green-500 text-white rounded-full px-2 py-1 text-xs w-28">Current Plan</div>
          <div className="text-gray-600 text-2xl font-semibold">Free</div>
          <p className="text-md text-gray-700 mt-2">Watch up to 5 minutes per video</p>
          <p className="text-md text-xs text-gray-400">Already Active</p>
        </div>

        <div className="h-72 w-64 rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-y-4 transform transition-transform duration-300 hover:scale-110">
          <div className="text-amber-700 text-2xl font-semibold">Bronze</div>
          <div className="text-amber-700 text-3xl font-extrabold">Rs.10/month</div>
          <p className="text-md text-gray-700 mt-2">Watch up to 7 minutes per video</p>
          <button
            className="w-full h-12 bg-amber-600 hover:bg-amber-700 rounded-2xl text-white font-bold"
            onClick={() => handlePayment("Bronze", 10)}
          >
            Buy Plan
          </button>
        </div>

        <div className="h-72 w-64 rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-y-4 transform transition-transform duration-300 hover:scale-110">
          <div className="text-gray-500 text-2xl font-semibold">Silver</div>
          <div className="text-gray-500 text-3xl font-extrabold">Rs.50/month</div>
          <p className="text-md text-gray-700 mt-2">Watch up to 10 minutes per video</p>
          <button
            className="w-full h-12 bg-amber-600 hover:bg-amber-700 rounded-2xl text-white font-bold"
            onClick={() => handlePayment("Silver", 50)}
          >
            Buy Plan
          </button>
        </div>

        <div className="h-72 w-64 rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-y-4 transform transition-transform duration-300 hover:scale-110">
          <div className="text-yellow-500 text-2xl font-semibold">Gold</div>
          <div className="text-yellow-500 text-3xl font-extrabold">Rs.100/month</div>
          <p className="text-md text-gray-700 mt-2 mb-6">Unlimited watch time</p>
          <button
            className="w-full h-12 bg-amber-600 hover:bg-amber-700 rounded-2xl text-white font-bold"
            onClick={() => handlePayment("Gold", 100)}
          >
            Buy Plan
          </button>
        </div>

      </div>
    </div>
  );
};

export default Upgrade;
