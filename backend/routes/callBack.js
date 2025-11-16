// backend/routes/callBack.js
import express from "express";
import { protect } from "../middleware/auth.js";
import CallBack from "../models/CallBack.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/appointments.js";
import mongoose from "mongoose";

const router = express.Router();

// Helper: resolve the Practitioner document from the logged-in user
async function getPractitionerForUser(user) {
  if (!user || (user.role !== "practitioner" && user.role !== "admin")) {
    const err = new Error("Not authorized as practitioner");
    err.statusCode = 403;
    throw err;
  }

  // Match by email between User and Practitioner collections
  const practitioner = await Practitioner.findOne({ email: user.email.toLowerCase() });
  if (!practitioner) {
    const err = new Error("Practitioner record not found");
    err.statusCode = 404;
    throw err;
  }

  return practitioner;
}

// All routes require authentication
router.use(protect);

// POST create a new callback request — only appointmentId is required
router.post("/", protect, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) return res.status(400).json({ message: "appointmentId required" });
    if (!mongoose.isValidObjectId(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointmentId" });
    }

    // find appointment -> get referenced user id
    const appt = await Appointment.findById(appointmentId).select("patientId").lean();
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // find Patient record that links to that User (appointment.patientId is a User id)
    const patientDoc = await Patient.findOne({ user: appt.patientId }).select("Phone Email").lean();
    if (!patientDoc) return res.status(404).json({ message: "Patient record not found for appointment" });

    // require a phone number on the patient (prefer phone, fallback email)
    const phone = patientDoc.Phone || patientDoc.phone || null;
    const email = patientDoc.Email || patientDoc.email || null;
    if (!phone && !email) return res.status(400).json({ message: "Patient has no contact info" });

    // create callback using patient's id and phone (prefer phone)
    const newCallBack = await CallBack.create({
      patientId: patientDoc._id,
      Phone: phone,
      Email: email,
      Reason: `Callback requested for appointment ${appointmentId}`,
      appointmentId,
    });

    const contactUsed = phone ? "phone" : "email";
    const payload = newCallBack.toObject ? { ...newCallBack.toObject(), contactUsed } : { ...newCallBack, contactUsed };

    res.status(201).json(payload);
  } catch (err) {
    console.error("❌ POST /api/callbacks error:", err);
    res.status(500).json({ message: "Server error creating callback request" });
  }
});

// GET /api/callbacks
// List callbacks for the logged-in practitioner, optionally filtered by status
router.get("/", async (req, res) => {
  try {
    const practitioner = await getPractitionerForUser(req.user);

    const { status } = req.query;
    const query = { practitioner: practitioner._id };

    if (status) {
      query.status = status;
    }

    const callbacks = await CallBack.find(query)
      .populate("patient")
      .populate("practitioner")
      .sort({ createdAt: -1 });

    res.status(201).json(payload);
  } catch (err) {
    console.error("❌ POST /api/callbacks error:", err);
    res.status(500).json({ message: "Server error creating callback request" });
  }
});

// GET list of callbacks, optional ?status=pending|in_progress|resolved|all
router.get("/", protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    // fetch and populate patient info, return patient as `patient` to match frontend
    const docs = await CallBack.find(filter)
      .sort({ createdAt: -1 })
      .populate("patientId", "fullName Email Phone")
      .lean();

    const results = docs.map((d) => {
      const patient = d.patientId || null;
      return { ...d, patient };
    });

    res.json(results);
  } catch (err) {
    console.error("❌ GET /api/callbacks error:", err);
    res.status(500).json({ message: "Server error fetching callbacks" });
  }
});

// PUT update callback (status / priority / other small fields)
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const updates = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.priority !== undefined) updates.priority = req.body.priority;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updatable fields provided" });
    }

    const updated = await CallBack.findByIdAndUpdate(id, updates, { new: true })
      .populate("patientId", "fullName Email Phone")
      .lean();

    if (!updated) return res.status(404).json({ message: "Callback request not found" });

    const payload = { ...updated, patient: updated.patientId || null };
    res.json(payload);
  } catch (err) {
    console.error("❌ PUT /api/callbacks/:id error:", err);
    res.status(500).json({ message: "Server error updating callback" });
  }
});

// DELETE a callback request by ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const callbackId = req.params.id;
    const deletedCallBack = await CallBack.findByIdAndDelete(callbackId);
    if (!deletedCallBack) {
      return res.status(404).json({ message: "Callback request not found" });
    }
    res.status(200).json({ message: "Callback request deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /api/callbacks/:id error:", err);
    res.status(500).json({ message: "Server error deleting callback request" });
  }
});

export default router;
