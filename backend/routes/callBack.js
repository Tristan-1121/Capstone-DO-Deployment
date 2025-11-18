// backend/routes/callback.js
import express from "express";
import { protect } from "../middleware/auth.js";        // <-- FIXED
import CallBack from "../models/CallBack.js";

const router = express.Router();

/**
 * GET /api/callbacks/mine
 * Returns all callbacks for the logged-in practitioner.
 * Optional query param: ?status=pending | in_progress | resolved | all
 */
router.get("/mine", protect, async (req, res) => {
  try {
    const practitionerId = req.user._id;

    const query = { practitioner: practitionerId };
    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }

    const callbacks = await CallBack.find(query)
      .populate("patient", "fullName email")
      .sort({ createdAt: -1 });

    return res.json(callbacks);
  } catch (err) {
    console.error("Callback fetch error:", err);
    return res.status(500).json({ message: "Error fetching callbacks" });
  }
});

/**
 * PATCH /api/callbacks/:id/status
 * Update the status of a callback
 */
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "in_progress", "resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await CallBack.findOneAndUpdate(
      { _id: req.params.id, practitioner: req.user._id },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Callback not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Callback status update error:", err);
    return res.status(500).json({ message: "Failed to update callback" });
  }
});

/**
 * DELETE /api/callbacks/:id
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await CallBack.findOneAndDelete({
      _id: req.params.id,
      practitioner: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Callback not found" });
    }

    return res.json({ message: "Callback deleted" });
  } catch (err) {
    console.error("Callback delete error:", err);
    return res.status(500).json({ message: "Failed to delete callback" });
  }
});

export default router;
