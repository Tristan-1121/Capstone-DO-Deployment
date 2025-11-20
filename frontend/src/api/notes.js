// frontend/src/api/notes.js
import api from "./http";

// GET a note for a specific appointment
export async function getNote(appointmentId) {
  const res = await api.get(`/api/notes/${appointmentId}`);
  return res.data;
}

// CREATE or UPDATE a note
export async function saveNote(payload) {
  const res = await api.post(`/api/notes`, payload);
  return res.data;
}

