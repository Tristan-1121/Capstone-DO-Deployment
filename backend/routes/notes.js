import express from "express";
import { protect } from "../middleware/auth.js";
import Notes from "../models/Notes.js";

const router = express.Router();

// Create a new note (practitioner only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "practitioner") return res.status(403).json({ message: "Forbidden" });

    const { patientId, content, dosage, frequency, additionalNotes, callBack } = req.body;
    if (!patientId || !content) return res.status(400).json({ message: "patientId and content are required" });

    const note = await Notes.create({
      patientId,
      practitionerId: req.user.id,
      content,
      dosage,
      frequency,
      additionalNotes,
      callBack,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("POST /api/notes error:", err);
    res.status(500).json({ message: "Server error creating note" });
  }
});

// List notes for a patient (practitioner or the patient themself)
router.get("/patient/:id", protect, async (req, res) => {
  try {
    const patientId = req.params.id;
    const allowed = req.user.role === "practitioner" || req.user.id === patientId;
    if (!allowed) return res.status(403).json({ message: "Forbidden" });

    const notes = await Notes.find({ patientId }).sort({ date: -1 }).select("-__v");
    res.json(notes);
  } catch (err) {
    console.error("GET /api/notes/patient/:id error:", err);
    res.status(500).json({ message: "Server error retrieving notes" });
  }
});

// Delete a note (practitioner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "practitioner") return res.status(403).json({ message: "Forbidden" });

    const deleted = await Notes.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("DELETE /api/notes/:id error:", err);
    res.status(500).json({ message: "Server error deleting note" });
  }
});

export default router;
