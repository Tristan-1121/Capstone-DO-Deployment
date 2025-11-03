import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";
import Appointment from "../models/appointments.js";

const router = express.Router();

// GET /api/appointments/me?range=upcoming|past
router.get("/me", protect, async (req, res) => {
  try {
    const range = (req.query.range || "upcoming").toLowerCase();
    const now = new Date();

    const query =
      range === "past"
        ? { patientId: req.user._id, endAt: { $lt: now } }
        : { patientId: req.user._id, startAt: { $gte: now } };

    const sort = range === "past" ? { startAt: -1 } : { startAt: 1 };

    const items = await Appointment.find(query)
      .select("-__v")
      .sort(sort);

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message || "Server error" });
  }
});

// GET /api/appointments/:id
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const appt = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id,
    });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (e) {
    res.status(500).json({ message: e.message || "Server error" });
  }
});

// POST /api/appointments
router.post("/", protect, async (req, res) => {
  try {
    const { date, timeStart, timeEnd, type, reason } = req.body;
    if (!date || !timeStart || !timeEnd || !type || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startAt = new Date(`${date}T${timeStart}:00`);
    const endAt = new Date(`${date}T${timeEnd}:00`);
    if (!(startAt < endAt)) {
      return res.status(400).json({ message: "timeEnd must be after timeStart" });
    }

    const appt = await Appointment.create({
      patientId: req.user._id,
      date,
      timeStart,
      timeEnd,
      type,
      reason,
    });

    res.status(201).json(appt);
  } catch (e) {
    res.status(400).json({ message: e.message || "Could not create appointment" });
  }
});

// DELETE /api/appointments/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const appt = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id,
    });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    await appt.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message || "Could not delete appointment" });
  }
});

export default router;
