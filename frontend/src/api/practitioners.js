// frontend/src/api/practitioners.js
import api from "./http";

// Used by dropdowns (patient appointment form)
export async function getPractitioners() {
  const { data } = await api.get("/api/practitioners/list");
  return data;
}

// Used by practitioner portal to get THEIR appointments
export async function getMyAppointmentsAsPractitioner(range = "upcoming") {
  const { data } = await api.get("/api/practitioners/me/appointments", {
    params: { range },
  });
  return data;
}
