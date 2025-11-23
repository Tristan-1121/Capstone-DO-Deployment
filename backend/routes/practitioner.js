// backend/routes/practitioner.js
// Routes for practitioner-specific actions:
// - listing practitioners
// - fetching their appointments
// - fetching their patients

import express from "express";
import { protect } from "../middleware/auth.js";
import Practitioner from "../models/Practitioner.js";
import Appointment from "../models/appointments.js";
import User from "../models/User.js"; // Needed for verifying patient info

const router = express.Router();

/**
 * GET /api/practitioners/list
 * Returns basic practitioner info for dropdowns (patient appointment form)
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
 * Returns appointments for the logged-in practitioner.
 *
 * Updated: uses req.user.practitionerId for accurate lookup.
 */
router.get("/me/appointments", protect, async (req, res) => {
  try {
    if (req.user.role !== "practitioner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const practitionerId = req.user.practitionerId;
    if (!practitionerId) {
      return res.status(400).json({
        message: "Practitioner ID missing. Run seed.js to sync accounts.",
      });
    }

    const range = (req.query.range || "upcoming").toLowerCase();
    const now = new Date();

    const query =
      range === "past"
        ? { practitionerId, endAt: { $lt: now } }
        : { practitionerId, startAt: { $gte: now }, status: "scheduled" };

    const sort = range === "past" ? { startAt: -1 } : { startAt: 1 };

    const appointments = await Appointment.find(query)
      .populate("patientId", "firstName lastName fullName email")
      .populate("practitionerId", "firstName lastName email")
      .select("-__v")
      .sort(sort);

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching practitioner appointments:", error);
    res.status(500).json({ message: "Error fetching practitioner appointments" });
  }
});

/**
 * GET /api/practitioners/me/patients
 * Returns all patients who have had an appointment with the practitioner.
 *
 * Updated: Uses practitionerId from req.user and returns unique patients.
 */
router.get("/me/patients", protect, async (req, res) => {
  try {
    if (req.user.role !== "practitioner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const practitionerId = req.user.practitionerId;
    if (!practitionerId) {
      return res.status(400).json({
        message: "Practitioner ID missing. Ensure seed.js was run.",
      });
    }

    // Retrieve all appointments for this practitioner
    const appts = await Appointment.find({ practitionerId })
      .populate("patientId", "firstName lastName fullName email");

    // Unique patient list
    const unique = new Map();
    appts.forEach((appt) => {
      if (appt.patientId) {
        unique.set(appt.patientId._id.toString(), appt.patientId);
      }
    });

    res.json([...unique.values()]);
  } catch (err) {
    console.error("Error fetching practitioner patients:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/practitioners/me/summary
 * Dashboard numbers
 *
 * NEW ENDPOINT – Fixes incorrect Total Patients count.
 * Uses MongoDB distinct() to count unique patient IDs.
 */
router.get("/me/summary", protect, async (req, res) => {
  try {
    if (req.user.role !== "practitioner" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const practitionerId = req.user.practitionerId;
    if (!practitionerId) {
      return res.status(400).json({ message: "Practitioner ID missing." });
    }

    // Count unique patients (same logic as /me/patients)
    const uniquePatients = await Appointment.distinct("patientId", {
      practitionerId,
    });

    const now = new Date();

    const upcomingAppointments = await Appointment.countDocuments({
      practitionerId,
      startAt: { $gte: now },
      status: "scheduled",
    });

    res.json({
      totalPatients: uniquePatients.length,
      upcomingAppointments,
      callbackNeeded: 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
