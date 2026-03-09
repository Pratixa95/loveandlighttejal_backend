import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { createUser, authenticateUser } from "./auth.service.js";

// ✅ create JWT token
const createToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: "7d" }
  );


// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    await createUser({ firstName, lastName, email, password });

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ LOGIN (FIXED VERSION)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser({ email, password });

    const token = createToken(user);

    // ✅ store in cookie (for browser)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // ⚠️ change to true in production with HTTPS frontend
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ ALSO SEND TOKEN IN RESPONSE (IMPORTANT)
    res.json({
      message: "Login successful",
      token, // 🔥 THIS WAS MISSING
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


// ✅ LOGOUT
export const logout = (_req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};