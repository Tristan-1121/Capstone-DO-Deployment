import express from "express";
import { protect } from "../middleware/auth.js";
import Patient from "../models/Patient.js";

// ✅ You must create the router *before* using it
const router = express.Router();

// 🧩 GET - Fetch logged-in patient's info
router.get("/me/Patient", protect, async (req, res) => {
  try {
    const patientData = await Patient.findOne({ user: req.user.id });
    if (!patientData) {
      return res.status(404).json({ message: "No record found" });
    }
    res.json(patientData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧩 PUT - Create or update logged-in patient's info
router.put("/me/Patient", protect, async (req, res) => {
  try {
    let patientData = await Patient.findOne({ user: req.user.id });
    if (!patientData) {
      patientData = await Patient.create({ user: req.user.id, ...req.body });
    } else {
      patientData = await Patient.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true }
      );
    }
    res.status(200).json(patientData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Export as default (for ESM import in server.js)
export default router;
