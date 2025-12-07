import api from "./http";

export async function getNote(appointmentId) {
  const res = await api.get(`/notes/${appointmentId}`);
  return res.data;
}

export async function saveNote(payload) {
  const res = await api.post(`/notes`, payload);
  return res.data;
}

export async function getNotesForPatient(patientId) {
  const res = await api.get(`/notes/patient/${patientId}`);
  return res.data;
}
