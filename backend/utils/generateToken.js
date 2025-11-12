// Creates a signed JWT for a user
import jwt from "jsonwebtoken";

export default function generateToken(user) {
  // Payload includes id and role so frontend can use role-based logic
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}
