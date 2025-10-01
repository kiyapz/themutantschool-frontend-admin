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

// Function to fetch instructors
export const fetchInstructors = async () => {
  try {
    console.log("Fetching instructors from /users/instructors");
    const response = await adminApi.get("/users/instructors");
    console.log("Instructors API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};

// Function to fetch affiliates
export const fetchAffiliates = async () => {
  try {
    console.log("Fetching affiliates from /users/affiliates");
    const response = await adminApi.get("/users/affiliates");
    console.log("Affiliates API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    throw error;
  }
};

// Function to fetch students
export const fetchStudents = async () => {
  try {
    console.log("Fetching students from /users/students");
    const response = await adminApi.get("/users/students");
    console.log("Students API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Function to fetch platform earnings
export const fetchPlatformEarnings = async () => {
  try {
    console.log("Fetching platform earnings from /earnings/platform");
    const response = await adminApi.get("/earnings/platform");
    console.log("Platform Earnings API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching platform earnings:", error);
    throw error;
  }
};

// Function to fetch top performing missions
export const fetchTopMissions = async () => {
  try {
    console.log(
      "Fetching top performing missions from /missions/top-performing"
    );
    const response = await adminApi.get("/missions/top-performing");
    console.log("Top Missions API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching top performing missions:", error);
    throw error;
  }
};

// Function to fetch top performing affiliates
export const fetchTopAffiliates = async () => {
  try {
    console.log("Fetching top performing affiliates from /users/affiliates");
    const response = await adminApi.get("/users/affiliates");
    console.log("Top Affiliates API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching top performing affiliates:", error);
    throw error;
  }
};

export default adminApi;
