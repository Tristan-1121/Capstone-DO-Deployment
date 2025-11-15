// frontend/src/api/callbacks.js
import api from "./http";

// Get callbacks for logged-in practitioner, optional status filter
export async function getCallbacks(status) {
  const params = {};
  if (status) params.status = status;

  const { data } = await api.get("/api/callbacks", { params });
  return data;
}

// Create a new callback
export async function createCallback(payload) {
  const { data } = await api.post("/api/callbacks", payload);
  return data;
}

// Update an existing callback (status, priority, reason)
export async function updateCallback(id, payload) {
  const { data } = await api.put(`/api/callbacks/${id}`, payload);
  return data;
}
