import api from "./http";

const BASE = "/callbacks";

export async function getMyCallbacks(status = "pending") {
  const query = status !== "all" ? `?status=${status}` : "";
  const res = await api.get(`${BASE}/mine${query}`);
  return res.data;
}

export async function updateCallbackStatus(id, newStatus) {
  const res = await api.patch(`${BASE}/${id}/status`, {
    status: newStatus,
  });
  return res.data;
}

export async function deleteCallback(id) {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
}



