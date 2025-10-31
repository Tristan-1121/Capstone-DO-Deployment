import express from 'express';
import Appointment from '../models/appointments.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all appointments
router.get('/', protect, async (req, res) => {
    try {
        const appts = await Appointment.find({});
        res.json(appts);
    } catch (err) {
        console.error('Failed to fetch appointments:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific appointment by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        console.error('Failed to fetch appointment:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new appointment
router.post('/', protect, async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const saved = await newAppointment.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error('Failed to create appointment:', err.message);
        res.status(400).json({ message: 'Bad request', error: err.message });
    }
});

// Delete an appointment by ID
router.delete('/:id', protect, async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
        res.status(204).send();
    } catch (err) {
        console.error('Failed to delete appointment:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;