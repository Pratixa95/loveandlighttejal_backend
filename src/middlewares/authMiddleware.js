import jwt from "jsonwebtoken";
import { findUserById } from "../modules/auth/auth.service.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userData = await findUserById(decoded.id);

    // handle array/object safely
    const user = Array.isArray(userData) ? userData[0] : userData;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    console.log("AUTH USER:", req.user); // debug (remove later)

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};