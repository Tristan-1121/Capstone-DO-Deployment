// backend/routes/patient.js
// Patient profile routes

import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET user profile
router.get('/me', protect, async (req, res) => {
  try {
    const { password, ...safeUser } = req.user.toObject();
    res.json(safeUser);
  } catch (err) {
    console.error('GET /patients/me', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE user profile
router.put('/me', protect, async (req, res) => {
  try {
    const ALLOWED = ['fullName', 'age', 'weight', 'healthHistory'];
    const update = {};

    ALLOWED.forEach(key => {
      if (key in req.body) update[key] = req.body[key];
    });

    const updated = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json(updated);
  } catch (err) {
    console.error('PUT /patients/me', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
