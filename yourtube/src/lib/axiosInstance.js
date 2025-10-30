import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://yourtube2-0-9t2o.onrender.com");

console.log("Environment:", process.env.NODE_ENV, baseURL);

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
