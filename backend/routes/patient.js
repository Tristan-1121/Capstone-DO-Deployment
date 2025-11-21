import express from "express";
import { protect } from "../middleware/auth.js";
import Patient from "../models/Patient.js";
import prescriptions from "../models/prescriptions.js";

const router = express.Router();

// 🧭 GET /api/patients/me — get current user's patient record
router.get("/me", protect, async (req, res) => {
  try {
    let patient = await Patient.findOne({ user: req.user._id });

    if (!patient) {
      // auto-create a blank record for new users
      patient = await Patient.create({
        user: req.user._id,
        Email: req.user.email,
        Name: req.user.username || req.user.fullName || "Unnamed Patient",
        Age: 0,
        Weight: 0,
        Height: 0,
        Sex: "",
        Phone: "",
        Address: "",
        City: "",
        State: "",
        Zip: "",
        MedHist: [],
        Prescriptions: [],
        Allergies: [],
      });
      console.log(`🆕 Created patient record for ${req.user.email}`);
    }

    res.status(200).json(patient);
  } catch (err) {
    console.error("❌ GET /api/patients/me error:", err);
    res.status(500).json({ message: "Server error fetching patient data" });
  }
});

// 🧭 PUT /api/patients/me — update patient record for logged-in user
router.put("/me", protect, async (req, res) => {
  try {
    const updates = req.body;

    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );

    res.json(patient);
  } catch (err) {
    console.error("❌ PUT /api/patients/me error:", err);
    res.status(500).json({ message: "Server error updating patient" });
  }
});

// ---------------------
// GET ALL PRESCRIBED MEDICATIONS
// ---------------------
router.get("/me/prescriptions", protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).select(
      "Prescriptions"
    );
    if (!patient) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    res.status(200).json(patient.Prescriptions);
  } catch (err) {
    console.error("❌ GET /api/patients/me/prescriptions error:", err);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
});

export default router;


