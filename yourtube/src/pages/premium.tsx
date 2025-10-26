// import { useEffect } from "react";


// const Premium = () => {
//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         document.body.appendChild(script);
//         return () => {
//             document.body.removeChild(script);
//         }
//     }, []);
//     const handlePayment = async () => {
//         const response = await fetch("/api/create-order", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ amount: 199 })
//         });
//         const order:any = await response.json();
//         const options = {
//             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // test key (frontend safe)
//             amount:199,
//             currency: "INR",
//             order_id: order.orderId, // <-- from backend
//             name: "YourTube Clone",
//             description: "Premium Subscription",
//             handler: function (response: any) {
//                 alert("Payment Successful: " + response.razorpay_payment_id);
//             },
//             prefill: {
//                 name: "Swamini Raut",
//                 email: "test@example.com",
//                 contact: "9999999999",
//             },
//             theme: { color: "#6B46C1" },
//         };
//         const rzp = new (window as any).Razorpay(options);
//         rzp.open();
//     }
//     return (
//         <div className="min-h-screen w-full bg-gradient-to-b from-purple-800 to-indigo-300 flex items-center justify-center">
//             <div className="h-96 w-96 bg-white rounded-2xl shadow-2xl p-6">
//                 <h1 className="text-center text-3xl font-bold">Go Premium</h1>
//                 <p className="text-gray-500">Unlock unlimited downloads & more</p>
//                 <p className="text-gray-500">Unlimited downloads</p>
//                 <p className="text-gray-500">Ad-free experience</p>
//                 <p className="text-gray-500">Priority support</p>
//                 <h1 className="text-indigo-700 text-center m-3 text-2xl font-bold">Rs.199/month</h1>
//                 <button className="h-12 bg-indigo-400 border-none rounded-2xl hover:bg-indigo-600 hover:h-14 w-full mt-4" onClick={handlePayment}>Upgrade Now</button>
//                 <p className="text-gray-400 text-center">Secure payments powered by Razorpay</p>
//             </div>
//         </div>
//     );
// }

// export default Premium;

import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

// const Premium = () => {
//   const router = useRouter();
//   const { redirect } = router.query; // e.g., /video/abc123

//   useEffect(() => {
//   if (typeof window === "undefined") return; // ✅ ensures client-side only

//   const script = document.createElement("script");
//   script.src = "https://checkout.razorpay.com/v1/checkout.js";
//   script.async = true;
//   document.body.appendChild(script);

//   // Cleanup function
//   return () => {
//     document.body.removeChild(script);
//   };
// }, []);


//   const handlePayment = async () => {
//     const response = await fetch("/api/create-order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: 199 }),
//     });
//     const order: any = await response.json();

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: 199,
//       currency: "INR",
//       order_id: order.orderId,
//       name: "YourTube Clone",
//       description: "Premium Subscription",
//       handler: function (paymentResponse: any) {
//         alert("Payment Successful: " + paymentResponse.razorpay_payment_id);

//         // ✅ Redirect user back to the video page
//         if (redirect) {
//           window.location.href = redirect as string;
//         } else {
//           router.push("/watch"); // fallback to home
//         }
//       },
//       prefill: {
//         name: "Swamini Raut",
//         email: "test@example.com",
//         contact: "9999999999",
//       },
//       theme: { color: "#6B46C1" },
//     };

//     const rzp = new (window as any).Razorpay(options);
//     rzp.open();
//   };


const Premium = () => {
  const router = useRouter();
  const { redirect } = router.query; // e.g., /video/abc123

  const handlePayment = async () => {
    const response = await fetch("/api/create-order", {
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

        // Redirect back to original video after payment
        if (redirect) {
          router.push(redirect as string); // client-side redirect
        } else {
          router.push("/watch");
        }
      },
      prefill: { name: "Swamini Raut", email: "test@example.com", contact: "9999999999" },
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
          className="h-12 bg-indigo-400 border-none rounded-2xl hover:bg-indigo-600 hover:h-14 w-full mt-4"
          onClick={handlePayment}
        >
          Upgrade Now
        </button>
        <p className="text-gray-400 text-center">Secure payments powered by Razorpay</p>
      </div>
    </div>
  );
};

export default Premium;
