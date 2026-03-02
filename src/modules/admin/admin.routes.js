import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { assignRoleToUser } from "./admin.controller.js";

const router = Router();

// Admin dashboard
router.get(
  "/dashboard",
  requireAuth,
  authorizeRole(["ADMIN"]),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

// Assign role to user
router.post(
  "/assign-role",
  requireAuth,
  authorizeRole(["ADMIN"]),
  assignRoleToUser
);

export default router;
