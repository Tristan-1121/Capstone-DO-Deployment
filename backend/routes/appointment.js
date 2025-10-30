const express = require('express');
import appointments from '../models/Appointments.js';
const router = express.Router();
import { protect } from '../middleware/auth.js';

// In-memory array to simulate database for demonstration purposes
const appointments = await appointments.find({});

// Get all appointments
router.get('/', protect, async (req, res) => {
    res.json(appointments);
});

// Get a specific appointment by ID
router.get('/:id', protect, async(req, res) => {
    const appointment = appointments.find(appt => appt.id === parseInt(req.params.id));
    if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
});

// Create a new appointment
router.post('/', protect, async (req, res) => {
    const newAppointment = {
        id: appointments.length + 1,
        ...req.body
    };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

// Delete an appointment by ID
router.delete('/:id', protect, async (req, res) => {
    const index = appointments.findIndex(appt => appt.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }
    appointments.splice(index, 1);
    res.status(204).send();
});

module.exports = router;