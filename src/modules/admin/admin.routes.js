import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

import { assignRoleToUser } from "./admin.controller.js";
import { createProgram } from "./admin.controller.js"; // ✅ keep if inside same file

const router = Router();

/* =========================
   ADMIN DASHBOARD
========================= */
router.get(
  "/dashboard",
  requireAuth,
  authorizeRole(["ADMIN"]), // ✅ exact match
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
  authorizeRole(["ADMIN"]), // ✅ exact match
  assignRoleToUser
);

/* =========================
   CREATE PROGRAM
========================= */
router.post(
  "/programs",
  requireAuth,
  authorizeRole(["ADMIN"]), // ✅ exact match
  createProgram
);

export default router;