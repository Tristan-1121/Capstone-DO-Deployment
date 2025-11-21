// backend/routes/practitioner.js
import express from "express";
import { protect } from "../middleware/auth.js";
import Practitioner from "../models/Practitioner.js";
import Appointment from "../models/appointments.js"; // same file used by appointment routes
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /api/practitioners/list
 * Returns practitioners for dropdowns etc.
 */
router.get("/list", protect, async (req, res) => {
  try {
    const practitioners = await Practitioner.find({})
      .select("_id firstName lastName email role");

    res.status(200).json(practitioners);
  } catch (error) {
    console.error("Error fetching practitioners:", error);
    res.status(500).json({ message: "Error fetching practitioners" });
  }
});

/**
 * GET /api/practitioners/me/appointments?range=upcoming|past
 * Returns appointments assigned to the logged-in practitioner.
 */
router.get("/me/appointments", protect, async (req, res) => {
  try {
    // Only practitioners should hit this, but if you want to be strict:
    if (req.user.role !== "practitioner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const range = (req.query.range || "upcoming").toLowerCase();
    const now = new Date();

    // Find Practitioner doc that corresponds to this user by email
    const email = String(req.user.email || "").toLowerCase().trim();
    const practitioner = await Practitioner.findOne({ email });

    if (!practitioner) {
      return res.status(404).json({ message: "Practitioner profile not found" });
    }

    const baseQuery = { practitionerId: practitioner._id };

    const query =
      range === "past"
        ? { ...baseQuery, endAt: { $lt: now } }
        : { ...baseQuery, startAt: { $gte: now } };

    const sort = range === "past" ? { startAt: -1 } : { startAt: 1 };

    const appts = await Appointment.find(query)
      .populate("patientId", "firstName lastName fullName email") // from User
      .select("-__v")
      .sort(sort);

    res.json(appts);
  } catch (error) {
    console.error("Error fetching practitioner appointments:", error);
    res.status(500).json({ message: "Error fetching practitioner appointments" });
  }
});

router.get("/me/patients", protect, async (req, res) => {
  try {
    if (req.user.role !== "practitioner")
      return res.status(403).json({ message: "Not authorized" });

    // get the practitioner entry
    const practitioner = await Practitioner.findOne({ email: req.user.email });
    if (!practitioner)
      return res.status(404).json({ message: "Practitioner not found" });

    // find appointments linked to this practitioner
    const appts = await Appointment.find({
      practitionerId: practitioner._id,
    }).populate("patientId", "firstName lastName email");

    // build a unique set of patients
    const patientMap = new Map();
    appts.forEach((a) => {
      if (a.patientId) {
        patientMap.set(a.patientId._id.toString(), a.patientId);
      }
    });

    res.json([...patientMap.values()]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
