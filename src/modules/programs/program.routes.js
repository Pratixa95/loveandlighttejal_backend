import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../../modules/programs/program.controller.js";

const router = Router();

/* ===============================
   PUBLIC ROUTES
================================*/
router.get("/", getAllPrograms);
router.get("/:id", getProgramById);

/* ===============================
   ADMIN ROUTES
================================*/
router.put("/:id", requireAuth, authorizeRole(["ADMIN"]), updateProgram);
router.delete("/:id", requireAuth, authorizeRole(["ADMIN"]), deleteProgram);

export default router;