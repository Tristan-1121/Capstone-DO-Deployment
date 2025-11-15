// backend/routes/callBack.js
import express from "express";
import { protect } from "../middleware/auth.js";
import CallBack from "../models/CallBack.js";
import Patient from "../models/Patient.js";
import Practitioner from "../models/Practitioner.js";

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

    res.json(callbacks);
  } catch (error) {
    console.error("Error fetching callbacks:", error);
    const code = error.statusCode || 500;
    res.status(code).json({ message: error.message || "Error fetching callbacks" });
  }
});

// POST /api/callbacks
// Create a new callback for a patient
router.post("/", async (req, res) => {
  try {
    const practitioner = await getPractitionerForUser(req.user);

    const { patientId, reason, priority } = req.body;

    if (!patientId || !reason) {
      return res.status(400).json({ message: "patientId and reason are required" });
    }

    // Ensure patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const callback = await CallBack.create({
      patient: patient._id,
      practitioner: practitioner._id,
      reason,
      priority, // if missing, schema default "medium" is used
    });

    const populated = await callback
      .populate("patient")
      .populate("practitioner");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating callback:", error);
    const code = error.statusCode || 500;
    res.status(code).json({ message: error.message || "Error creating callback" });
  }
});

// PUT /api/callbacks/:id
// Update status and/or priority for an existing callback
router.put("/:id", async (req, res) => {
  try {
    const practitioner = await getPractitionerForUser(req.user);
    const { id } = req.params;
    const { status, priority, reason } = req.body;

    const callback = await CallBack.findById(id);
    if (!callback) {
      return res.status(404).json({ message: "Callback not found" });
    }

    // Ensure this callback belongs to the logged-in practitioner (unless admin)
    if (
      req.user.role !== "admin" &&
      callback.practitioner.toString() !== practitioner._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to modify this callback" });
    }

    if (status) callback.status = status;
    if (priority) callback.priority = priority;
    if (typeof reason === "string") callback.reason = reason;

    await callback.save();

    const populated = await callback
      .populate("patient")
      .populate("practitioner");

    res.json(populated);
  } catch (error) {
    console.error("Error updating callback:", error);
    const code = error.statusCode || 500;
    res.status(code).json({ message: error.message || "Error updating callback" });
  }
});

export default router;
