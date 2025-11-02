import api from "./http";

// GET my appointments (upcoming | past)
export async function getMyAppointments(range = "upcoming") {
  const { data } = await api.get(`/api/appointments/me`, { params: { range } });
  return data;
}

// POST create appointment
export async function createAppointment(payload) {
  const { data } = await api.post("/api/appointments", payload);
  return data;
}

// GET by id
export async function getAppointmentById(id) {
  const { data } = await api.get(`/api/appointments/${id}`);
  return data;
}

// DELETE by id
export async function deleteAppointment(id) {
  const { data } = await api.delete(`/api/appointments/${id}`);
  return data;
}
