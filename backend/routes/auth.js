import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const STUDENT_EMAIL_RE = /^[a-z]{2}\d{2,4}@students\.uwf\.edu$/i;

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const emailLc = String(email).toLowerCase().trim();
    if (!STUDENT_EMAIL_RE.test(emailLc)) {
      return res.status(400).json({ 
        message: 'Email must be initials + 2–4 digits @students.uwf.edu (e.g., tc12@students.uwf.edu)' 
      });
    }

    // initials must match first letters of first/last
    const initials = (firstName[0] || '').toLowerCase() + (lastName[0] || '').toLowerCase();
    const local = emailLc.split('@')[0];
    if (!local.startsWith(initials)) {
      return res.status(400).json({ message: 'Email initials must match your first and last name' });
    }

    const exists = await User.findOne({ email: emailLc });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: emailLc,
      username: local, 
      password,
      role: 'patient',
    });

    const token = generateToken(user._id);
    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
    });

  } catch (err) {
    //  Handle strong-password validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(err.errors)[0].message
      });
    }

    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Current user
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export default router;
