import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes (JWT authentication)
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized, no token" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    console.log("JWT decoded payload:", decoded)

    // ✅ DEFINE FIRST
    const userId = decoded.id

    console.log("Fetching profile for user IDs:", userId)

    req.user = await User.findById(userId).select("-password")

    if (!req.user) {
      return res.status(404).json({ error: "User not found" })
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ error: "Not authorized, token failed" })
  }
}








// Role-based authorization (admin, etc.)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Not authorized to access this route",
      });
    }
    next();
  };
};
