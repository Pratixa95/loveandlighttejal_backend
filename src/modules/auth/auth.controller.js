import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { createUser, authenticateUser } from "./auth.service.js";

const createToken = (user) =>
  jwt.sign(
    { id: user.id },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser({ email, password });
    const token = createToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
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

export const logout = (_req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
