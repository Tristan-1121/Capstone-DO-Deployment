//routes for practitioner model
import express from "express";
import { protect } from "../middleware/auth.js";
import Appointment from "../models/Practitioner.js";

const router = express.Router();

//get all appointments regardless of patient
router.get("/appointments", protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
});

//get all appointments for a single patient
router.get("/appointments/patient/:patientId", protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.patientId });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments for patient", error });
    }
});

// Get all patients
router.get("/patients", protect, async (req, res) => {
    try {
        const patients = await Appointment.distinct("patientId");
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients", error });
    }
});

// Search for a single patient
router.get("/patients/:patientId", protect, async (req, res) => {
    try {
        const patient = await Appointment.findOne({ patientId: req.params.patientId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient", error });
    }
});

// Search for a single appointment
router.get("/appointments/:appointmentId", protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error });
    }
});

export default router;