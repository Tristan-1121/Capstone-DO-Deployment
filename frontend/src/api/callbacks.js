import api from "./http";

const BASE = "/api/callbacks";

export async function getMyCallbacks(status = "pending") {
  const query = status !== "all" ? `?status=${status}` : "";
  const res = await api.get(`${BASE}/mine${query}`);
  return res.data;
}

/**
 * Update the status of a callback by ID.
 * newStatus: "pending" | "in_progress" | "resolved"
 */
export async function updateCallbackStatus(id, newStatus) {
  const res = await api.patch(`${BASE}/${id}/status`, {
    status: newStatus,
  });
  return res.data;
}

/**
 * Delete a callback by ID.
 */
export async function deleteCallback(id) {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
}



