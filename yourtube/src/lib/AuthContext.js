// import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
// import { useState, useEffect, createContext, useContext } from "react";
// import { provider, auth } from "./firebase";
// import axiosInstance from "./axiosInstance";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = (userdata) => {
//     setUser(userdata);
//     // ✅ Only save valid user data
//     if (userdata) {
//       localStorage.setItem("user", JSON.stringify(userdata));
//     }
//   };

//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error during sign out:", error);
//     }
//   };

//   const handlegooglesignin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const firebaseuser = result.user;
//       console.log("🔥 Firebase user:", firebaseuser);

//       const payload = {
//         email: firebaseuser.email,
//         name: firebaseuser.displayName,
//         image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//         city: "unknown",
//       };

//       const response = await axiosInstance.post("/user/login", payload);
//       console.log("✅ Server Response:", response.data);

//       login(response.data.result);
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//     }
//   };
//   const calculateTheme = (user) => {
//     const SouthStates = ["tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"];
//     const normalizedCity = (user.city || "").trim().toLowerCase();

//     let hours;
//     if (user.timezone) {
//       hours = parseInt(
//         new Date().toLocaleString("en-US", { timeZone: user.timezone, hour: "numeric", hour12: false })
//       );
//     } else {
//       // fallback to India time
//       const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
//       hours = new Date(indiaTime).getHours();
//     }

//     // Light theme only if 10:00 <= hours < 12:00 and South India
//     if (hours >= 10 && hours < 12 && SouthStates.includes(normalizedCity)) return "light";
//     return "dark";
//   };

//   // ----------------- APPLY THEME -----------------
//   useEffect(() => {
//     if (!user) return;
//     const theme = calculateTheme(user);

//     if (theme === "light") {
//     document.body.style.backgroundColor = "white";
//     document.body.style.color = "black";
//   } else {
//     document.body.style.backgroundColor = "black";
//     document.body.style.color = "white";
//   }
//   }, [user]);

//   useEffect(() => {
//     console.log("🧠 AuthContext mounted");
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       console.log("📦 Found stored user:", storedUser);
//     } else {
//       console.log("🚫 No stored user found");
//     }


//     // ✅ Listen for Firebase auth state changes
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) => {
//       if (firebaseuser) {
//         try {
//           const payload = {
//             email: firebaseuser.email,
//             name: firebaseuser.displayName,
//             image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//           };
//           const response = await axiosInstance.post("/user/login", payload);
//           login(response.data.result);
//         } catch (error) {
//           console.error("Auth sync error:", error);
//           logout();
//         }
//       } else {
//         logout();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, login, logout, handlegooglesignin }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);


// import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
// import { useState, useEffect, createContext, useContext } from "react";
// import { provider, auth } from "./firebase";
// import axiosInstance from "./axiosInstance";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Save user in context + localStorage
//   const login = (userdata) => {
//     if (!userdata) return;
//     setUser(userdata);
//     localStorage.setItem("user", JSON.stringify(userdata));
//     if (userdata.theme === "dark") {
//     document.documentElement.classList.add("dark");
//   } else {
//     document.documentElement.classList.remove("dark");
//   }
//   };

//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Sign out error:", error);
//     }
//   };

//   // Google sign-in
//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const firebaseUser = result.user;

//       const payload = {
//         email: firebaseUser.email,
//         name: firebaseUser.displayName || "Unknown",
//         image: firebaseUser.photoURL || "https://github.com/shadcn.png",
//         city: "unknown",
//       };

//       const response = await axiosInstance.post("/user/login", payload);
//       login(response.data.user || response.data.result);
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//       alert("Google login failed, try again.");
//     }
//   };

//   // OTP login
//   const loginWithOTP = async (phoneNumber, otp) => {
//     try {
//       const formattedPhone = phoneNumber.startsWith("+")
//         ? phoneNumber
//         : `+91${phoneNumber}`;

//       const res = await fetch("http://localhost:5000/user/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phoneNumber: formattedPhone, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.user) {
//         console.error("OTP login failed:", data);
//         alert(data.message || "OTP verification failed");
//         return;
//       }

//       login(data.user);
//     } catch (error) {
//       console.error("OTP login error:", error);
//       alert("OTP verification failed. Check console for details.");
//     }
//   };

//   useEffect(() => {
//     // Restore user from localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       login(userData); // This will also apply theme automatically
//     }

//     // Firebase auth listener
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         try {
//           const payload = {
//             email: firebaseUser.email,
//             name: firebaseUser.displayName || "Unknown",
//             image: firebaseUser.photoURL || "https://github.com/shadcn.png",
//           };

//           const response = await axiosInstance.post("/user/login", payload);
//           login(response.data.user || response.data.result);
//         } catch (error) {
//           console.error("Firebase auth sync error:", error);
//           logout();
//         }
//       } else {
//         logout();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{ user, login, logout, handleGoogleSignIn, loginWithOTP }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
// export const useUser = () => useContext(UserContext);



import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect, createContext, useContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ---------- Helper: Apply theme ----------
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ---------- Login helper ----------
  const login = (userdata) => {
    if (!userdata) return;
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));

    const theme = userdata.theme || "dark"; // backend decides theme
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  };

  // ---------- Logout ----------
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("theme");

    // 🔆 When logged out → light mode
    applyTheme("light");

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // ---------- Google Sign-In ----------
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const payload = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || "Unknown",
        image: firebaseUser.photoURL || "https://github.com/shadcn.png",
        city: "unknown",
      };

      const response = await axiosInstance.post("/user/login", payload);
      const data = response.data;

      login({
        ...data.user,
        theme: data.theme || "dark",
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Google login failed, try again.");
    }
  };

  // ---------- OTP Login ----------
  const loginWithOTP = async (phoneNumber, otp) => {
    try {
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      const res = await fetch("http://localhost:5000/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formattedPhone, otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        console.error("OTP login failed:", data);
        alert(data.message || "OTP verification failed");
        return;
      }

      login({
        ...data.user,
        theme: data.theme || "dark",
      });
    } catch (error) {
      console.error("OTP login error:", error);
      alert("OTP verification failed. Check console for details.");
    }
  };

  // ---------- Restore user on reload ----------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const savedTheme = localStorage.getItem("theme");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      applyTheme(savedTheme || "dark");
    } else {
      // 🔆 No user logged in → use white mode
      applyTheme("light");
    }

    // Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const payload = {
            email: firebaseUser.email,
            name: firebaseUser.displayName || "Unknown",
            image: firebaseUser.photoURL || "https://github.com/shadcn.png",
          };

          const response = await axiosInstance.post("/user/login", payload);
          const data = response.data;

          login({
            ...data.user,
            theme: data.theme || "dark",
          });
        } catch (error) {
          console.error("Firebase auth sync error:", error);
          logout();
        }
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, login, logout, handleGoogleSignIn, loginWithOTP }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
