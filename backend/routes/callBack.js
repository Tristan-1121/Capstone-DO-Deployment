import express from "express";
import { protect } from "../middleware/auth.js";
import CallBack from "../models/CallBack.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/appointments.js";
import mongoose from "mongoose";

const router = express.Router();

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

    // require a phone number on the patient
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

// DELETE a callback request by Patient ID
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