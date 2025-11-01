import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect, createContext, useContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const login = (userdata) => {
    if (!userdata) return;
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));

    const theme = userdata.theme || "dark"; 
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("theme");

    applyTheme("light");

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
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

  const loginWithOTP = async (phoneNumber, otp) => {
    try {
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://yourtube2-0-9t2o.onrender.com";

      const res = await fetch(`${API_URL}/user/verify`, {
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const savedTheme = localStorage.getItem("theme");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      applyTheme(savedTheme || "dark");
    } else {
      applyTheme("light");
    }

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
