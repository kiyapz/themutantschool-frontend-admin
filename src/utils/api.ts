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

// Base URL for API calls - can be overridden with environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://themutantschool-backend.onrender.com";

// Create axios instance for coupon API calls
const couponApi = axios.create({
  baseURL: `${BASE_URL}/api/coupon`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
couponApi.interceptors.request.use(
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

// Add response interceptor to handle errors and log responses
couponApi.interceptors.response.use(
  (response) => {
    console.log("=== COUPON API RESPONSE ===");
    console.log("URL:", response.config.url);
    console.log("Full URL:", response.config.baseURL + response.config.url);
    console.log("Method:", response.config.method?.toUpperCase());
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Response Data:", response.data);
    return response;
  },
  (error) => {
    console.error("=== COUPON API ERROR ===");
    console.error("URL:", error.config?.url);
    console.error("Full URL:", error.config?.baseURL + error.config?.url);
    console.error("Method:", error.config?.method?.toUpperCase());
    console.error("Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
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

// Admin Coupon Endpoints
export const createCoupon = async (couponData: any) => {
  try {
    console.log("=== CREATING COUPON ===");
    console.log("Base URL:", BASE_URL);
    console.log("Full Endpoint:", `${BASE_URL}/api/coupon`);
    console.log("Request Data:", couponData);
    console.log("Token:", localStorage.getItem("login-accessToken") ? "Present" : "Missing");
    
    const response = await couponApi.post("", couponData);
    console.log("=== COUPON CREATED SUCCESSFULLY ===");
    console.log("Coupon API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const updateCoupon = async (id: string, couponData: any) => {
  try {
    console.log(`=== UPDATING COUPON ${id} ===`);
    console.log("Base URL:", BASE_URL);
    console.log("Full Endpoint:", `${BASE_URL}/api/coupon/${id}`);
    console.log("Request Data:", couponData);
    console.log("Token:", localStorage.getItem("login-accessToken") ? "Present" : "Missing");
    
    const response = await couponApi.put(`/${id}`, couponData);
    console.log(`=== COUPON ${id} UPDATED SUCCESSFULLY ===`);
    console.log("Coupon API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating coupon ${id}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    console.log(`=== DELETING COUPON ${id} ===`);
    console.log("Base URL:", BASE_URL);
    console.log("Full Endpoint:", `${BASE_URL}/api/coupon/${id}`);
    console.log("Token:", localStorage.getItem("login-accessToken") ? "Present" : "Missing");
    
    const response = await couponApi.delete(`/${id}`);
    console.log(`=== COUPON ${id} DELETED SUCCESSFULLY ===`);
    console.log("Coupon API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting coupon ${id}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const getCouponByIdOrCode = async (idOrCode: string) => {
  try {
    console.log(`=== FETCHING COUPON ${idOrCode} ===`);
    console.log("Base URL:", BASE_URL);
    console.log("Full Endpoint:", `${BASE_URL}/api/coupon/${idOrCode}`);
    console.log("Token:", localStorage.getItem("login-accessToken") ? "Present" : "Missing");
    
    const response = await couponApi.get(`/${idOrCode}`);
    console.log(`=== COUPON ${idOrCode} FETCHED SUCCESSFULLY ===`);
    console.log("Coupon API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching coupon ${idOrCode}:`, error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const listCoupons = async () => {
  try {
    console.log("=== FETCHING ALL COUPONS ===");
    console.log("Base URL:", BASE_URL);
    console.log("Full Endpoint:", `${BASE_URL}/api/coupon`);
    console.log("Token:", localStorage.getItem("login-accessToken") ? "Present" : "Missing");
    
    const response = await couponApi.get("");
    console.log("=== COUPONS FETCHED SUCCESSFULLY ===");
    console.log("Coupon API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error listing coupons:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// User Coupon Endpoints
export const validateCoupon = async (validationData: any) => {
  try {
    console.log("=== VALIDATING COUPON ===");
    console.log("Base URL:", BASE_URL);
    console.log("Full Endpoint:", `${BASE_URL}/api/coupon/validate`);
    console.log("Request Data:", validationData);
    console.log("Token:", localStorage.getItem("login-accessToken") ? "Present" : "Missing");
    
    const response = await couponApi.post("/validate", validationData);
    console.log("=== COUPON VALIDATION SUCCESSFUL ===");
    console.log("Coupon API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export default adminApi;
