// frontend/src/api/appointments.js
import api from "./http";

// GET my appointments (upcoming | past) - patient
export async function getMyAppointments(range = "upcoming") {
  const { data } = await api.get(`/api/appointments/me`, {
    params: { range },
  });
  return data;
}

// GET past appointments - practitioner
export async function getMyPastAppointmentsAsPractitioner() {
  const res = await api.get("/appointments/practitioner/past");
  return res.data;
}


export async function getPractitionerAppointments() {
  const res = await api.get("/api/appointments/practitioner/all");
  return res.data;
}

// POST create appointment - patient
export async function createAppointment(payload) {
  const { data } = await api.post("/api/appointments", payload);
  return data;
}

// GET by id
export async function getAppointmentById(id) {
  const { data } = await api.get(`/api/appointments/${id}`);
  return data;
}

// DELETE by id (patient or practitioner, backend enforces authorization)
export async function deleteAppointment(id) {
  const { data } = await api.delete(`/api/appointments/${id}`);
  return data;
}

// PATCH reschedule (patient or practitioner)
export async function rescheduleAppointment(id, payload) {
  const { data } = await api.patch(
    `/api/appointments/${id}/reschedule`,
    payload
  );
  return data;
}
