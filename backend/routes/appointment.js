// Appointment routes (minimal)

import express from 'express';
import Appointment from '../models/appointments.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST create appointment
router.post('/', protect, async (req, res) => {
  try {
    const { practitionerId, start, end, reason } = req.body;
    if (!practitionerId || !start || !end || !reason)
      return res.status(400).json({ message: 'Missing fields' });

    if (new Date(start) >= new Date(end))
      return res.status(400).json({ message: 'Invalid time range' });

    const appt = await Appointment.create({
      patientId: req.user._id,
      practitionerId,
      start,
      end,
      reason
    });

    res.status(201).json(appt);
  } catch (err) {
    console.error('POST /appointments', err);
    res.status(500).json({ message: 'Create error' });
  }
});

// GET user appointments (?range=past|upcoming)
router.get('/me', protect, async (req, res) => {
  try {
    const { range } = req.query;
    const now = new Date();
    const filter = { patientId: req.user._id };
    filter.start = range === 'past' ? { $lt: now } : { $gte: now };

    const list = await Appointment.find(filter).sort({ start: 1 });
    res.json(list);
  } catch (err) {
    console.error('GET /appointments/me', err);
    res.status(500).json({ message: 'Fetch error' });
  }
});

// GET single appointment
router.get('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Not found' });

    if (appt.patientId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });

    res.json(appt);
  } catch (err) {
    console.error('GET /appointments/:id', err);
    res.status(500).json({ message: 'Fetch error' });
  }
});

// DELETE appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Not found' });

    if (appt.patientId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });

    await appt.deleteOne();
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /appointments/:id', err);
    res.status(500).json({ message: 'Delete error' });
  }
});

export default router;
