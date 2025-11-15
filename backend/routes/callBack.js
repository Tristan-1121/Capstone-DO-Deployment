import express from "express";
import { protect } from "../middleware/auth.js";
import CallBack from "../models/CallBack.js";
import Notes from "../models/Notes.js";
import Patient from "../models/Patient.js";

const router = express.Router();

// POST create a new callback request
router.post("/", protect, async (req, res) => {
  try {
    const { notesId, notes, Phone: bodyPhone, Email: bodyEmail, Reason } = req.body;

    if (!Reason) {
      return res.status(400).json({ message: "Reason is required" });
    }

    // 1) Determine notes document id (prefer explicit notesId, else try to extract from notes text)
    let resolvedNotesId = notesId;
    if (!resolvedNotesId && typeof notes === "string") {
      const m = notes.match(/[0-9a-fA-F]{24}/);
      if (m) resolvedNotesId = m[0];
    }

    // 2) If we have a notes id, load the note and get the patient reference
    let patientId = null;
    if (resolvedNotesId) {
      const note = await Notes.findById(resolvedNotesId).select("patient patientId user").lean();
      if (!note) return res.status(404).json({ message: "Notes not found" });
      // support several possible field names used in notes schema
      patientId = note.patient || note.patientId || note.user || null;
    }

    // 3) fallback to authenticated user's id when patientId not found via notes
    if (!patientId) {
      patientId = req.user?.id || req.user?._id;
    }

    // 4) Prefer explicit Phone/Email from body, otherwise lookup patient contact info
    let Phone = bodyPhone || null;
    let Email = bodyEmail || null;
    if ((!Phone || !Email) && patientId) {
      const patient = await Patient.findById(patientId).select("Phone Email phone email").lean();
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      if (!Phone) Phone = patient.Phone || patient.phone || null;
      if (!Email) Email = patient.Email || patient.email || null;
    }

    if (!Phone && !Email) {
      return res.status(400).json({ message: "Phone or Email is required" });
    }

    // 5) create callback request associated with the patientId found from notes (or fallback)
    const newCallBack = await CallBack.create({
      patientId,
      Phone: Phone || null,
      Email: Email || null,
      Reason,
      notes: resolvedNotesId || notes || "",
    });

    const contactUsed = Phone ? "phone" : "email";
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