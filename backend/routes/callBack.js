// backend/routes/callbacks.js
import express from "express";
import { protect } from "../middleware/auth.js";
import CallBack from "../models/CallBack.js";
import Practitioner from "../models/Practitioner.js";

const router = express.Router();

/**
 * GET /api/callbacks/me
 * Gets all callbacks assigned to the logged-in practitioner
 */
router.get("/me", protect, async (req, res) => {
  try {
    // find practitioner matching logged-in user's email
    const email = String(req.user.email || "").toLowerCase().trim();
    const practitioner = await Practitioner.findOne({ email });

    if (!practitioner) {
      return res.status(404).json({ message: "Practitioner profile not found" });
    }

    const callbacks = await CallBack.find({
      practitioner: practitioner._id,
    })
      .populate("patient", "firstName lastName fullName email")
      .sort({ createdAt: -1 });

    res.json(callbacks);
  } catch (err) {
    console.error("❌ Error loading callbacks:", err);
    res.status(500).json({ message: "Failed to load callbacks" });
  }
});

export default router;
