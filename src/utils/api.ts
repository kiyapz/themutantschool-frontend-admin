import axios from "axios";

// Create axios instance for admin API calls
const adminApi = axios.create({
  baseURL: "/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("login-accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("USER");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default adminApi;

