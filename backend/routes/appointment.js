import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";
import Appointment from "../models/appointments.js";
import Practitioner from "../models/Practitioner.js";

const router = express.Router();

// helper: check if current user can modify this appointment
async function canModifyAppointment(req, appt) {
  // patient who owns the appointment
  if (String(appt.patientId) === String(req.user._id)) return true;

  // practitioner (or admin) assigned to this appointment
  if (req.user.role === "practitioner" || req.user.role === "admin") {
    const email = String(req.user.email || "").toLowerCase().trim();
    const practitioner = await Practitioner.findOne({ email });
    if (!practitioner) return false;
    if (String(appt.practitionerId) === String(practitioner._id)) return true;
  }

  return false;
}

// GET /api/appointments/me?range=upcoming|past  (patient)
router.get("/me", protect, async (req, res) => {
  try {
    const range = (req.query.range || "upcoming").toLowerCase();
    const now = new Date();

    const query =
      range === "past"
        ? { patientId: req.user._id, endAt: { $lt: now } }
        : { patientId: req.user._id, startAt: { $gte: now } };

    const sort = range === "past" ? { startAt: -1 } : { startAt: 1 };

    const items = await Appointment.find(query).select("-__v").sort(sort);

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message || "Server error" });
  }
});

// GET /api/appointments/:id (patient can see their appointment)
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const appt = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id,
    });
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (e) {
    res.status(500).json({ message: e.message || "Server error" });
  }
});

// POST /api/appointments  (patient creates)
router.post("/", protect, async (req, res) => {
  try {
    const { date, timeStart, timeEnd, type, reason, practitionerId } = req.body;
    if (
      !date ||
      !timeStart ||
      !timeEnd ||
      !type ||
      !reason ||
      !practitionerId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    if (!mongoose.isValidObjectId(practitionerId)) {
      return res.status(400).json({ message: "Invalid practitionerId" });
    }

    const startAt = new Date(`${date}T${timeStart}:00`);
    const endAt = new Date(`${date}T${timeEnd}:00`);
    if (!(startAt < endAt)) {
      return res
        .status(400)
        .json({ message: "timeEnd must be after timeStart" });
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

    res.status(201).json(appt);
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || "Could not create appointment" });
  }
});

// PATCH /api/appointments/:id/reschedule  (patient or assigned practitioner)
router.patch("/:id/reschedule", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { date, timeStart, timeEnd } = req.body;
    if (!date || !timeStart || !timeEnd) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!(await canModifyAppointment(req, appt))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const startAt = new Date(`${date}T${timeStart}:00`);
    const endAt = new Date(`${date}T${timeEnd}:00`);
    if (!(startAt < endAt)) {
      return res
        .status(400)
        .json({ message: "timeEnd must be after timeStart" });
    }

    appt.date = date;
    appt.timeStart = timeStart;
    appt.timeEnd = timeEnd;
    appt.startAt = startAt;
    appt.endAt = endAt;

    await appt.save();

    res.json(appt);
  } catch (e) {
    res
      .status(400)
      .json({ message: e.message || "Could not reschedule appointment" });
  }
});

// DELETE /api/appointments/:id  (patient or assigned practitioner)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!(await canModifyAppointment(req, appt))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await appt.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res
      .status(500)
      .json({ message: e.message || "Could not delete appointment" });
  }
});

export default router;
