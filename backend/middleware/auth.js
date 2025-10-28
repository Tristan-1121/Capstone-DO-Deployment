import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (only allow logged-in users)
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check if Authorization header starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      
      // Extract the token after "Bearer "
      token = req.headers.authorization.split(" ")[1];

      // Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to req (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // move to next middleware or route
    }

    // If no token present
    return res.status(401).json({ message: "Not authorized, no token" });

  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
