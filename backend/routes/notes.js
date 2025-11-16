import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Appointment from '../models/appointments.js';
import Patient from '../models/Patient.js';
import Note from '../models/notes.js';

const router = express.Router();

// all routes require auth
router.use(protect);

// helper: ensure current user is the practitioner assigned to appointment
async function ensureAssignedPractitioner(req, appointmentId) {
  if (!mongoose.isValidObjectId(appointmentId)) {
    const err = new Error('Invalid appointmentId');
    err.status = 400;
    throw err;
  }
  const appt = await Appointment.findById(appointmentId).select('practitionerId patientId').lean();
  if (!appt) {
    const err = new Error('Appointment not found');
    err.status = 404;
    throw err;
  }
  // practitioner must match logged-in user
  if (!appt.practitionerId || appt.practitionerId.toString() !== req.user._id.toString()) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return appt;
}

// POST /api/notes
// create or upsert a note for an appointment (only assigned practitioner)
router.post('/', async (req, res) => {
  try {
    const { appointmentId, summary = '', plan = '', followUps = [] } = req.body;
    if (!appointmentId) return res.status(400).json({ message: 'appointmentId required' });

    const appt = await ensureAssignedPractitioner(req, appointmentId);

    // upsert note (one note per appointment)
    const note = await Note.findOneAndUpdate(
      { appointmentId },
      {
        appointmentId,
        practitionerId: req.user._id,
        patientId: appt.patientId,
        summary,
        plan,
        followUps,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(201).json(note);
  } catch (err) {
    console.error('POST /api/notes error', err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Server error' });
  }
});

// GET /api/notes/:appointmentId
// fetch the note for an appointment (only assigned practitioner)
router.get('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await ensureAssignedPractitioner(req, appointmentId);

    const note = await Note.findOne({ appointmentId }).lean();
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
  } catch (err) {
    console.error('GET /api/notes/:appointmentId error', err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Server error' });
  }
});

// PUT /api/notes/:id
// update an existing note (only practitioner who owns the note)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const existing = await Note.findById(id);
    if (!existing) return res.status(404).json({ message: 'Note not found' });

    if (existing.practitionerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = {};
    if (req.body.summary !== undefined) updates.summary = req.body.summary;
    if (req.body.plan !== undefined) updates.plan = req.body.plan;
    if (req.body.followUps !== undefined) updates.followUps = req.body.followUps;

    const updated = await Note.findByIdAndUpdate(id, updates, { new: true }).lean();
    return res.json(updated);
  } catch (err) {
    console.error('PUT /api/notes/:id error', err);
    return res.status(500).json({ message: 'Server error updating note' });
  }
});

export default router;
