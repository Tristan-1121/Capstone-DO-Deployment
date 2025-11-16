import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// POST /api/users/register
// Creates a new user account (patient by default)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "First name, last name, email, and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists with that email" });
    }

    // Role defaults to "patient" if not provided
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      role: role || "patient",
    });

    const token = generateToken(user);

    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/users/login
// Authenticates user by email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/users/me
// Returns the currently logged-in user's profile
router.get("/me", protect, async (req, res) => {
  try {
    // protect middleware already attached req.user with password removed
    const user = req.user;

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
});

export default router;
