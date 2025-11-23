// backend/routes/appointment.js
// Handles appointment CRUD + filtering for both patients & practitioners

import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";
import Appointment from "../models/appointments.js";
import Practitioner from "../models/Practitioner.js";

const router = express.Router();

// Helper: determine if current user can modify appointment
async function canModifyAppointment(req, appt) {
  // Patients can modify their own appointment
  if (String(appt.patientId) === String(req.user._id)) return true;

  // Practitioners can modify appointments assigned to them
  if (req.user.role === "practitioner" || req.user.role === "admin") {

    // --- Updated: use direct practitionerId relationship (no email lookup) ---
    if (req.user.practitionerId && 
        String(appt.practitionerId) === String(req.user.practitionerId)) {
      return true;
    }
    // --- End updated section ---
  }

  return false;
}

/**
 * GET /api/appointments/me?range=upcoming|past
 * Patient: fetches THEIR appointments
 */
router.get("/me", protect, async (req, res) => {
  try {
    const range = (req.query.range || "upcoming").toLowerCase();
    const now = new Date();

    let query = { patientId: req.user._id };

    if (range === "past") {
      query.$or = [
        { status: { $in: ["completed", "canceled"] } },
        { endAt: { $lt: now } },
      ];
    } else {
      query.status = "scheduled";
      query.startAt = { $gte: now };
    }

    const sort = range === "past" ? { startAt: -1 } : { startAt: 1 };

    const items = await Appointment.find(query)
      .populate("practitionerId", "firstName lastName email") // ensures practitioner name shows instantly
      .select("-__v")
      .sort(sort);

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message || "Server error" });
  }
});

/**
 * GET /api/appointments/:id
 * Patient: return one appointment
 */
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appt = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id,
    }).populate("practitionerId", "firstName lastName email");

    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });

    res.json(appt);
  } catch (e) {
    res.status(500).json({ message: e.message || "Server error" });
  }
});

/**
 * POST /api/appointments
 * Patient creates an appointment
 */
router.post("/", protect, async (req, res) => {
  try {
    const { date, timeStart, timeEnd, type, reason, practitionerId } = req.body;

    if (!date || !timeStart || !timeEnd || !type || !reason || !practitionerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.isValidObjectId(practitionerId)) {
      return res.status(400).json({ message: "Invalid practitionerId" });
    }

    const startAt = new Date(`${date}T${timeStart}:00`);
    const endAt = new Date(`${date}T${timeEnd}:00`);

    if (!(startAt < endAt)) {
      return res.status(400).json({
        message: "timeEnd must be after timeStart",
      });
    }

    const appt = await Appointment.create({
      patientId: req.user._id,
      practitionerId,
      date,
      timeStart,
      timeEnd,
      type,
      reason,
    });

    // --- Updated: populate so practitioner name shows immediately after creation ---
    const populated = await Appointment.findById(appt._id)
      .populate("practitionerId", "firstName lastName email")
      .populate("patientId", "firstName lastName email");
    // --- End updated section ---

    res.status(201).json(populated);
  } catch (e) {
    res.status(400).json({ message: e.message || "Could not create appointment" });
  }
});

/**
 * PATCH /api/appointments/:id/reschedule
 * Patient OR assigned practitioner can modify
 */
router.patch("/:id/reschedule", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { date, timeStart, timeEnd } = req.body;
    if (!date || !timeStart || !timeEnd) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    if (!(await canModifyAppointment(req, appt))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const startAt = new Date(`${date}T${timeStart}:00`);
    const endAt = new Date(`${date}T${timeEnd}:00`);

    if (!(startAt < endAt)) {
      return res.status(400).json({ message: "timeEnd must be after timeStart" });
    }

    appt.date = date;
    appt.timeStart = timeStart;
    appt.timeEnd = timeEnd;
    appt.startAt = startAt;
    appt.endAt = endAt;

    await appt.save();

    const populated = await Appointment.findById(appt._id)
      .populate("patientId", "firstName lastName email")
      .populate("practitionerId", "firstName lastName email");

    res.json(populated);
  } catch (e) {
    res.status(400).json({ message: e.message || "Could not reschedule appointment" });
  }
});

/**
 * DELETE /api/appointments/:id
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    if (!(await canModifyAppointment(req, appt))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await appt.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message || "Could not delete appointment" });
  }
});

/**
 * GET /api/appointments/practitioner/all
 * Practitioner: Active (upcoming) appointments
 *
 * --- Updated: use practitionerId, not email ---
 */
router.get("/practitioner/all", protect, async (req, res) => {
  try {
    const practitionerId = req.user.practitionerId;
    if (!practitionerId) {
      return res.status(400).json({ message: "Practitioner account not linked" });
    }

    const items = await Appointment.find({
      practitionerId,
      status: "scheduled",
      startAt: { $gte: new Date() },
    })
      .populate("patientId", "firstName lastName fullName email")
      .populate("practitionerId", "firstName lastName email")
      .sort({ startAt: 1 });

    res.json(items);
  } catch (err) {
    console.error("Practitioner appointment fetch error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

/**
 * GET /api/appointments/practitioner/past
 *
 * --- Updated: use practitionerId, not email ---
 */
router.get("/practitioner/past", protect, async (req, res) => {
  try {
    const practitionerId = req.user.practitionerId;
    if (!practitionerId) {
      return res.status(400).json({ message: "Practitioner account not linked" });
    }

    const now = new Date();

    const items = await Appointment.find({
      practitionerId,
      $or: [
        { status: { $in: ["completed", "canceled"] } },
        { endAt: { $lt: now } },
      ],
    })
      .populate("patientId", "firstName lastName fullName email")
      .populate("practitionerId", "firstName lastName email")
      .sort({ startAt: -1 });

    res.json(items);
  } catch (err) {
    console.error("Practitioner past appt error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
