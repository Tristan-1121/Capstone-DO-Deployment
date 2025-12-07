// frontend/src/api/http.js
import axios from "axios";

// Base URL for ALL API calls.
// In production (DO): VITE_API_BASE_URL should be "/api"
// In dev (local): it falls back to "http://localhost:5000/api"
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

console.log("🔥 API Base URL:", baseURL);

const api = axios.create({
  baseURL, // <- use the variable we just defined
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;



