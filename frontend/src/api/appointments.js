import api from "./http";

// =============================
// PATIENT ENDPOINTS
// =============================

export async function getMyAppointments(range = "upcoming") {
  const { data } = await api.get(`/appointments/me`, {
    params: { range },
  });
  return data;
}

export async function createAppointment(payload) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function getAppointmentById(id) {
  const { data } = await api.get(`/appointments/${id}`);
  return data;
}

export async function deleteAppointment(id) {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
}

export async function rescheduleAppointment(id, payload) {
  const { data } = await api.patch(
    `/appointments/${id}/reschedule`,
    payload
  );
  return data;
}

// =============================
// PRACTITIONER ENDPOINTS
// =============================

export async function getMyPastAppointmentsAsPractitioner() {
  const res = await api.get("/appointments/practitioner/past");
  return res.data;
}

export async function getPractitionerAppointments() {
  const res = await api.get("/appointments/practitioner/all");
  return res.data;
}

export default {
  getMyAppointments,
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  rescheduleAppointment,
  getMyPastAppointmentsAsPractitioner,
  getPractitionerAppointments,
};

