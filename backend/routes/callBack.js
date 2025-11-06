import express from "express";
import { protect } from "../middleware/auth.js";
import CallBack from "../models/CallBack.js";

const router = express.Router();

// POST create a new callback request
router.post("/", protect, async (req, res) => {
  try {
    const { Phone, Reason } = req.body;
    if (!Phone || !Reason) {
      return res.status(400).json({ message: "Phone and Reason are required" });
    }

    const patientId = req.user.id;
    const newCallBack = await CallBack.create({ patientId, Phone, Reason });

    res.status(201).json(newCallBack);
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