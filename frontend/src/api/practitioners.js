// frontend/src/api/practitioners.js
import api from "./http";

// Fetch all practitioners (public route or protected depending on backend)
export async function getPractitioners() {
  const { data } = await api.get("/api/practitioners/list");
  return data;
}
