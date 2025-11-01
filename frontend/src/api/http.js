// Central axios instance: attaches baseURL and Authorization header automatically.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: false, // no cookies; we use Bearer token
});

// Reads token from localStorage on every request so it stays in sync after login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalizes errors so callers can show useful messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    err.message = err?.response?.data?.message || err.message || "Request failed";
    throw err;
  }
);

export default api;
