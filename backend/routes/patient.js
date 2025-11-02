import express from "express";
import { protect } from "../middleware/auth.js";
import Patient from "../models/Patient.js";

const router = express.Router();

// GET the logged-in patient's data
router.get("/me", protect, async (req, res) => {
  try {
    const email = req.user.email;
    let patient = await Patient.findOne({ Email: email });

    // Create an empty record if it doesn't exist
    if (!patient) {
      patient = await Patient.create({
        Email: email,
        Name: req.user.username,
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
    }

    res.json(patient);
  } catch (err) {
    console.error("❌ GET /api/patients/me error:", err);
    res.status(500).json({ message: "Server error fetching patient data" });
  }
});

// PUT update patient info
router.put("/me", protect, async (req, res) => {
  try {
    const email = req.user.email;
    const updates = req.body;

    const patient = await Patient.findOneAndUpdate(
      { Email: email },
      updates,
      { new: true, upsert: true, runValidators: false }
    );

    res.json(patient);
  } catch (err) {
    console.error("❌ PUT /api/patients/me error:", err);
    res.status(500).json({ message: "Server error updating patient" });
  }
});

export default router;



