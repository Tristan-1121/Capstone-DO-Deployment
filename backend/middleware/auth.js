import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes: only allow requests with a valid JWT
export const protect = async (req, res, next) => {
  let token;

  try {
    // Expect "Authorization: Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Decode token (payload should include at least { id, role })
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load the latest user data from DB (includes role)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // Attach user document (with role) to request
      req.user = user;

      return next();
    }

    // No Authorization header or no Bearer token
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
