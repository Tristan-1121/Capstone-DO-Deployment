const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiGet = (path) =>
  fetch(`${API_BASE}${path}`, { credentials: "include" });

export const apiPost = (path, body) =>
  fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
