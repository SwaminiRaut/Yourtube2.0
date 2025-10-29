import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://yourtube2-0-9t2o.onrender.com",
  withCredentials: true, // for auth cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

