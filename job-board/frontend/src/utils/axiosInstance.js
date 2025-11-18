// frontend/src/utils/axiosinstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://job-board-u675.onrender.com",
  withCredentials: true,
  timeout: 30000 // 30 seconds
});

/* ============================
   REQUEST INTERCEPTOR
============================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Set JSON header ONLY for non-FormData requests
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg =
      error.response?.data?.msg ||
      error.response?.data?.error ||
      error.message;

    // Handle expired / invalid token
    if (
      status === 401 ||
      msg === "Invalid or malformed token" ||
      msg === "Invalid token" ||
      msg === "Token expired"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
