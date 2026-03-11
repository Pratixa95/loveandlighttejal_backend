import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  assignRoleToUser,
  createProgram,
} from "./admin.controller.js";

const router = Router();

/* =========================
   ADMIN DASHBOARD
========================= */
router.get(
  "/dashboard",
  requireAuth,
  authorizeRole(["ADMIN"]), // keep uppercase
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

/* =========================
   ASSIGN ROLE
========================= */
router.post(
  "/assign-role",
  requireAuth,
  authorizeRole(["ADMIN"]),
  assignRoleToUser
);

/* =========================
   CREATE PROGRAM
========================= */
router.post(
  "/programs",
  requireAuth,
  authorizeRole(["ADMIN"]),
  createProgram
);

export default router;