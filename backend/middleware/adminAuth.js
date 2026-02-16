import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const adminOnly = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id

    const user = await User.findById(req.userId)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" })
    }

    next()
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" })
  }
}
