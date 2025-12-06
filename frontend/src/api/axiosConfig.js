import axios from "axios";

// Create a centralized Axios instance
// This ensures all API calls use the same base URL and configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Request Interceptor
// This runs before every request is sent.
// We use it to automatically attach the JWT token to the Authorization header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attach token: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
