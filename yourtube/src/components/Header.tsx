// // import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
// // import React, { useState } from "react";
// // import { Button } from "./ui/button";
// // import Link from "next/link";
// // import { Input } from "./ui/input";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "./ui/dropdown-menu";
// // import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// // import ChannelDialogue from "./ChannelDialogue";
// // import { useRouter } from "next/router";
// // import { useUser } from "@/lib/AuthContext";

// // const Header = () => {
// //   const { user, logout, handlegooglesignin } = useUser();
// //   // const user: any = {
// //   //   id: "1",
// //   //   name: "John Doe",
// //   //   email: "john@example.com",
// //   //   image: "https://github.com/shadcn.png?height=32&width=32",
// //   // };
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [isdialogeopen, setisdialogeopen] = useState(false);
// //   const router = useRouter();
// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (searchQuery.trim()) {
// //       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
// //     }
// //   };
// //   const handleKeypress = (e: React.KeyboardEvent) => {
// //     if (e.key === "Enter") {
// //       handleSearch(e as any);
// //     }
// //   };
// //   return (
// //     <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
// //       <div className="flex items-center gap-4">
// //         <Button variant="ghost" size="icon">
// //           <Menu className="w-6 h-6" />
// //         </Button>
// //         <Link href="/" className="flex items-center gap-1">
// //           <div className="bg-red-600 p-1 rounded">
// //             <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
// //               <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
// //             </svg>
// //           </div>
// //           <span className="text-xl font-medium">YourTube</span>
// //           <span className="text-xs text-gray-400 ml-1">IN</span>
// //         </Link>
// //       </div>
// //       <form
// //         onSubmit={handleSearch}
// //         className="flex items-center gap-2 flex-1 max-w-2xl mx-4"
// //       >
// //         <div className="flex flex-1">
// //           <Input
// //             type="search"
// //             placeholder="Search"
// //             value={searchQuery}
// //             onKeyPress={handleKeypress}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="rounded-l-full border-r-0 focus-visible:ring-0"
// //           />
// //           <Button
// //             type="submit"
// //             className="rounded-r-full px-6 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-l-0"
// //           >
// //             <Search className="w-5 h-5" />
// //           </Button>
// //         </div>
// //         <Button variant="ghost" size="icon" className="rounded-full">
// //           <Mic className="w-5 h-5" />
// //         </Button>
// //       </form>
// //       <div className="flex items-center gap-2">
// //         {user ? (
// //           <>
// //             <Button variant="ghost" size="icon">
// //               <VideoIcon className="w-6 h-6" />
// //             </Button>
// //             <Button variant="ghost" size="icon">
// //               <Bell className="w-6 h-6" />
// //             </Button>
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button
// //                   variant="ghost"
// //                   className="relative h-8 w-8 rounded-full"
// //                 >
// //                   <Avatar className="h-8 w-8">
// //                     <AvatarImage src={user.image} />
// //                     <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
// //                   </Avatar>
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent className="w-56" align="end" forceMount>
// //                 {user?.channelname ? (
// //                   <DropdownMenuItem asChild>
// //                     <Link href={`/channel/${user?._id}`}>Your channel</Link>
// //                   </DropdownMenuItem>
// //                 ) : (
// //                   <div className="px-2 py-1.5">
// //                     <Button
// //                       variant="secondary"
// //                       size="sm"
// //                       className="w-full"
// //                       onClick={() => setisdialogeopen(true)}
// //                     >
// //                       Create Channel
// //                     </Button>
// //                   </div>
// //                 )}
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/history">History</Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/liked">Liked videos</Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem asChild>
// //                   <Link href="/watch-later">Watch later</Link>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuSeparator />
// //                 <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </>
// //         ) : (
// //           <>
// //             <Button
// //               className="flex items-center gap-2"
// //               onClick={handlegooglesignin}
// //             >
// //               <User className="w-4 h-4" />
// //               Sign in
// //             </Button>
// //           </>
// //         )}{" "}
// //       </div>
// //       <ChannelDialogue
// //         isopen={isdialogeopen}
// //         onclose={() => setisdialogeopen(false)}
// //         mode="create"
// //       />
// //     </header>
// //   );
// // };

// // export default Header;


// import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import Link from "next/link";
// import { Input } from "./ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import ChannelDialogue from "./ChannelDialogue";
// import { useRouter } from "next/router";
// import { useUser } from "@/lib/AuthContext";

// const Header = () => {
//   const { user, logout, handlegooglesignin } = useUser();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState(""); // 👈 New state for phone
//   const [isdialogeopen, setisdialogeopen] = useState(false);
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   const handleKeypress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSearch(e as any);
//     }
//   };

//   const handleLogin = async () => {
//     if (!user) {
//       alert("User info missing!");
//       return;
//     }

//     // Optional: validate phone number for non-South users
//     const Southstates = ["tamil nadu", "kerala", "karnataka", "andhra", "telangana"];
//     if (!Southstates.includes(user.city?.toLowerCase()) && !phoneNumber) {
//       alert("Please enter your phone number to receive OTP");
//       return;
//     }

//     // try {
//     //   const res = await fetch("http://localhost:5000/user/login", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({
//     //       email: user?.email,
//     //       name: user?.name,
//     //       image: user?.image,
//     //       city: user?.city,
//     //       timezone: user?.timezone,
//     //       phoneNumber, // 👈 Include phone number
//     //     }),
//     //   });

//     //   const data = await res.json();
//     //   console.log("Login response:", data);
//     //   alert(`OTP sent via ${data.result?.otpsentvia || "unknown"}`);
//     // } catch (error) {
//     //   console.error(error);
//     //   alert("Login failed");
//     // }

//     try {
//       const res = await fetch("http://localhost:5000/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: user?.email,
//           name: user?.name,
//           image: user?.image,
//           city: user?.city,
//           timezone: user?.timezone,
//           phoneNumber,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Login failed");
//         return;
//       }

//       console.log("Login response:", data);
//       alert(`OTP sent via ${data.result?.otpsentvia || "unknown"}`);
//     } catch (error) {
//       console.error(error);
//       alert("Login failed");
//     }

//   };

//   return (
//     <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon">
//           <Menu className="w-6 h-6" />
//         </Button>
//         <Link href="/" className="flex items-center gap-1">
//           <div className="bg-red-600 p-1 rounded">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
//               <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//             </svg>
//           </div>
//           <span className="text-xl font-medium">YourTube</span>
//           <span className="text-xs text-gray-400 ml-1">IN</span>
//         </Link>
//       </div>

//       <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-2xl mx-4">
//         <div className="flex flex-1">
//           <Input
//             type="search"
//             placeholder="Search"
//             value={searchQuery}
//             onKeyPress={handleKeypress}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="rounded-l-full border-r-0 focus-visible:ring-0"
//           />
//           <Button type="submit" className="rounded-r-full px-6 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-l-0">
//             <Search className="w-5 h-5" />
//           </Button>
//         </div>
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <Mic className="w-5 h-5" />
//         </Button>
//       </form>

//       <div className="flex items-center gap-2">
//         {user ? (
//           <>
//             <Input
//               type="text"
//               placeholder="Phone (for OTP)"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className="w-40"
//             />
//             <Button onClick={handleLogin}>Send OTP</Button>

//             <Button variant="ghost" size="icon">
//               <VideoIcon className="w-6 h-6" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Bell className="w-6 h-6" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user.image} />
//                     <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 {user?.channelname ? (
//                   <DropdownMenuItem asChild>
//                     <Link href={`/channel/${user?._id}`}>Your channel</Link>
//                   </DropdownMenuItem>
//                 ) : (
//                   <div className="px-2 py-1.5">
//                     <Button variant="secondary" size="sm" className="w-full" onClick={() => setisdialogeopen(true)}>
//                       Create Channel
//                     </Button>
//                   </div>
//                 )}
//                 <DropdownMenuItem asChild>
//                   <Link href="/history">History</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/liked">Liked videos</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/watch-later">Watch later</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </>
//         ) : (
//           <Button className="flex items-center gap-2" onClick={handlegooglesignin}>
//             <User className="w-4 h-4" />
//             Sign in
//           </Button>
//         )}
//       </div>

//       <ChannelDialogue isopen={isdialogeopen} onclose={() => setisdialogeopen(false)} mode="create" />
//     </header>
//   );
// };

// export default Header;




import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "@/lib/AuthContext";
import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import ChannelDialogue from "./ChannelDialogue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  const { user, login, logout, handlegooglesignin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp | done
  const [isdialogeopen, setisdialogeopen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // const handleSendOTP = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/user/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phoneNumber,
  //         email: user?.email || `${phoneNumber}@yourtube.local`,
  //         name: user?.name || "Guest",
  //         city: user?.city || "",
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       alert(data.message || "Failed to send OTP");
  //       return;
  //     }

  //     alert(`✅ OTP sent to ${phoneNumber}`);
  //     setStep("otp");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error sending OTP");
  //   }
  // };


  // const handleSendOTP = async () => {
  //   try {
  //     const formattedPhone = phoneNumber.startsWith("+91")
  //       ? phoneNumber
  //       : `+91${phoneNumber}`;

  //     const res = await fetch("http://localhost:5000/user/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phoneNumber: formattedPhone,
  //         email: user?.email || `${formattedPhone}@yourtube.local`,
  //         name: user?.name || "Guest",
  //         city: user?.city || "",
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Failed to send OTP");
  //       return;
  //     }

  //     alert(`✅ OTP sent to ${formattedPhone}`);
  //     setStep("otp");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error sending OTP");
  //   }
  // };



  const handleSendOTP = async () => {
    try {
      const formattedPhone = phoneNumber.startsWith("+91")
        ? phoneNumber
        : `+91${phoneNumber}`;

      const res = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          email: `${formattedPhone}@yourtube.local`,
          name: name || "Guest", // ✅ use the name input, not user?.name
          city: "Pune", // you can change this later
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        return;
      }

      alert(`✅ OTP sent to ${formattedPhone}`);
      setStep("otp");
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };


  // const handleVerifyOTP = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/user/verify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phoneNumber, otp }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       alert(data.message || "Invalid OTP");
  //       return;
  //     }

  //     alert("✅ Logged in successfully!");
  //     setStep("done");
  //     if (data.user) {
  //       localStorage.setItem("user", JSON.stringify(data.user));
  //       login(data.user);
  //     }

  //   } catch (err) {
  //     console.error(err);
  //     alert("OTP verification failed");
  //   }
  //   console.log("User in Header:", user);
  //   // const storedUser = localStorage.getItem("user");
  //   // if (storedUser) {
  //   //   setUser(JSON.parse(storedUser));
  //   // }
  //   // login(data.user);

  // };


  //   const handleVerifyOTP = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/user/verify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phoneNumber, otp }),
  //     });
  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Invalid OTP");
  //       return;
  //     }

  //     const userFromServer = data.user;

  //     // Make sure all required fields exist
  //     const fullUser = {
  //       _id: userFromServer._id || phoneNumber,
  //       name: userFromServer.name || "Guest",
  //       email: userFromServer.email || `${phoneNumber}@yourtube.local`,
  //       image: userFromServer.image || "https://github.com/shadcn.png",
  //       phoneNumber: userFromServer.phoneNumber,
  //       city: userFromServer.city || "",
  //     };

  //     login(fullUser); // ✅ context + localStorage
  //     setStep("done");
  //   } catch (err) {
  //     console.error(err);
  //     alert("OTP verification failed");
  //   }
  // };


  // const handleVerifyOTP = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/user/verify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phoneNumber, otp }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Invalid OTP");
  //       return;
  //     }

  //     if (!data.user) {
  //       alert("Error: No user returned from server");
  //       return;
  //     }

  //     // ✅ Save user in context + localStorage + apply theme
  //     login(data.user);
  //     alert("✅ Logged in successfully!");
  //     setStep("done");
  //   } catch (err) {
  //     console.error(err);
  //     alert("OTP verification failed");
  //   }
  // };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid OTP");
        return;
      }

      if (!data.user) {
        alert("Error: No user returned from server");
        return;
      }

      login(data.user);
      alert(`✅ Welcome, ${data.user.name || "User"}!`);
      setStep("done");
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
  };




  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
        <Link href="/" className="flex items-center gap-1">
          <div className="bg-red-600 p-1 rounded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <span className="text-xl font-medium">YourTube</span>
        </Link>
      </div>

      {/* Center Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-2xl mx-4">
        <div className="flex flex-1">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-l-full border-r-0 focus-visible:ring-0"
          />
          <Button type="submit" className="rounded-r-full px-6 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-l-0">
            <Search className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Mic className="w-5 h-5" />
        </Button>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {!user ? (
          <>
            {step === "phone" && (
              <>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-40"
                />
                <Button onClick={handleSendOTP}>Send OTP</Button>
              </>
            )}
            {step === "otp" && (
              <>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-32"
                />
                <Button onClick={handleVerifyOTP}>Verify OTP</Button>
              </>
            )}
            {step === "done" && (
              <>
                <Button variant="ghost" size="icon">
                  <VideoIcon className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="w-6 h-6" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
                        <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/history">History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/liked">Liked videos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/call">Video Call</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon">
              <VideoIcon className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-6 h-6" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/history">History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/liked">Liked videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                      <Link href="/call">Video Call</Link>
                    </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <ChannelDialogue isopen={isdialogeopen} onclose={() => setisdialogeopen(false)} mode="create" />
    </header>
  );
};

export default Header;
