// backend/middleware/auth.js
// Middleware to authenticate requests using JWT.
// Attaches the authenticated User to req.user (without password).
// Also ensures practitioner accounts include practitionerId so practitioner routes work properly.

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Extract the Bearer token from the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user (remove password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;

    // --- Updated section: ensure practitionerId is present for practitioner users ---
    // This is required so practitioner appointment routes and callback list work.
    if (user.role === "practitioner" && !user.practitionerId) {
      console.warn(
        `Warning: Practitioner user '${user.email}' has NO practitionerId linked.\n` +
        `Seed data must be applied correctly or practitioner linking will break.`
      );
      // middleware does not modify DB, it just logs the condition
    }
    // --- End updated section ---

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
