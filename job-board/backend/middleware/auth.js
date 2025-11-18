// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // No Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in .env");
      return res.status(500).json({ msg: "Server configuration error" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expired" });
      }
      return res.status(401).json({ msg: "Invalid or malformed token" });
    }

    // Check if user still exists
    const user = await User.findById(decoded.id).select("_id role email");
    if (!user) {
      return res.status(401).json({ msg: "User does not exist anymore" });
    }

    // Attach user to req
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
}
