import api from "./http";

// GET current patient's profile
export async function getMyProfile() {
  const { data } = await api.get("/patients/me");
  return data;
}

// PUT update current patient's profile
export async function updateMyProfile(payload) {
  const { data } = await api.put("/patients/me", payload);
  return data;
}
