import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // for auth cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

