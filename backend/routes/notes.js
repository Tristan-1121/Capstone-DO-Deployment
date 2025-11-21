// backend/routes/notes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import Note from "../models/Note.js";
import Appointment from "../models/appointments.js";
import CallBack from "../models/CallBack.js";

const router = express.Router();

/**
 * GET /api/notes/:appointmentId
 * Load existing note for the appointment
 */
router.get("/:appointmentId", protect, async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const note = await Note.findOne({ appointmentId });

    if (!note) return res.json(null);

    res.json(note);
  } catch (err) {
    console.error("❌ Error loading note:", err);
    res.status(500).json({ message: "Failed to load note" });
  }
});

/**
 * POST /api/notes
 * Save (create or update) the SOAP note + optional callback
 */
router.post("/", protect, async (req, res) => {
  try {
    const {
      appointmentId,
      practitionerId,
      patientId,
      subjective,
      objective,
      assessment,
      plan,
      callback,
    } = req.body;

    if (!appointmentId || !practitionerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get appointment for patient reference if not passed
    let finalPatientId = patientId;
    if (!finalPatientId) {
      const appt = await Appointment.findById(appointmentId);
      if (!appt) {
        return res.status(400).json({ message: "Invalid appointmentId" });
      }
      finalPatientId = appt.patientId;
    }

    // -----------------------------
    // ⭐ SAVE SOAP NOTE
    // -----------------------------
    const noteData = {
      appointmentId,
      practitionerId,
      patientId: finalPatientId,
      subjective,
      objective,
      assessment,
      plan,
    };

    const note = await Note.findOneAndUpdate(
      { appointmentId },
      noteData,
      { upsert: true, new: true }
    );

    // -----------------------------
    // ⭐ SAVE CALLBACK (if provided)
    // -----------------------------
    if (callback && callback.reason) {
      const callbackData = {
        patient: finalPatientId,
        practitioner: practitionerId,
        reason: callback.reason,
        priority: callback.priority || "medium",
        dueDate: callback.dueDate || null,
        status: "pending",
      };

      await CallBack.create(callbackData);
    }

    // -----------------------------
    // ⭐ GET PRACTITONER DASHBOARD (used by navigate in front end)
    // -----------------------------
    router.get("/api/practitioners", protect, async (req, res) => {
      try {
        const practitioners = await Practitioner.find({ _id: practitionerId }); // Fetch specific practitioner
        res.redirect("/api/practitioners");
        res.json(practitioners);
      } catch (err) {
        console.error("❌ Error loading practitioners dashboard:", err);
        res.status(500).json({ message: "Failed to load practitioners dashboard" });
      }
    });
    

    res.json({ message: "Saved successfully", note });
  } catch (err) {
    console.error("❌ Error saving note:", err);
    res.status(500).json({ message: "Failed to save note" });
  }
});

// -----------------------------
// ADD PRESCRIPTION TO A PATIENT
// -----------------------------

router.post("/prescriptions", protect, async (req, res) => {
  try {
    const { patientId, medicationName, dosage, frequency } = req.body;
    if (!patientId || !medicationName || !dosage || !frequency) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const newPrescription = {
      medicationName,
      dosage,
      frequency,
    };
    patient.Prescriptions.push(newPrescription);
    await patient.save();
    res.status(201).json({ message: "Prescription added", prescription: newPrescription });
  } catch (err) {
    console.error("❌ Error adding prescription:", err);
    res.status(500).json({ message: "Failed to add prescription" });
  }
});

export default router;
