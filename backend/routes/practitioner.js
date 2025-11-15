// backend/routes/practitioner.js
import express from "express";
import { protect } from "../middleware/auth.js";
import Practitioner from "../models/Practitioner.js";

const router = express.Router();

// GET /api/practitioners/list
// Returns a simple list of practitioners for dropdowns
router.get("/list", protect, async (req, res) => {
  try {
    const practitioners = await Practitioner.find({})
      .select("_id firstName lastName email fullName role");

    res.status(200).json(practitioners);
  } catch (error) {
    console.error("Error fetching practitioners:", error);
    res.status(500).json({ message: "Error fetching practitioners" });
  }
});

export default router;
