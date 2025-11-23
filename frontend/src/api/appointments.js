// frontend/src/api/appointments.js
// Centralized API for patient + practitioner appointment operations.
// Updated so endpoints match the corrected backend and populate works immediately.

import api from "./http";

// =============================
// PATIENT ENDPOINTS
// =============================

// Get patient appointments (upcoming or past)
export async function getMyAppointments(range = "upcoming") {
  const { data } = await api.get(`/api/appointments/me`, {
    params: { range },
  });
  return data;
}

// Create new appointment as patient
export async function createAppointment(payload) {
  const { data } = await api.post("/api/appointments", payload);
  return data;
}

// Get specific appointment (patient)
export async function getAppointmentById(id) {
  const { data } = await api.get(`/api/appointments/${id}`);
  return data;
}

// Delete appointment (patient or practitioner)
export async function deleteAppointment(id) {
  const { data } = await api.delete(`/api/appointments/${id}`);
  return data;
}

// Reschedule appointment (patient or practitioner)
export async function rescheduleAppointment(id, payload) {
  const { data } = await api.patch(
    `/api/appointments/${id}/reschedule`,
    payload
  );
  return data;
}

// =============================
// PRACTITIONER ENDPOINTS
// =============================

// FIXED: this was missing `/api` before
export async function getMyPastAppointmentsAsPractitioner() {
  const res = await api.get("/api/appointments/practitioner/past");
  return res.data;
}

// Get all upcoming practitioner appointments
export async function getPractitionerAppointments() {
  const res = await api.get("/api/appointments/practitioner/all");
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
