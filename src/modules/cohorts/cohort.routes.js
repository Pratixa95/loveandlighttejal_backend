import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

import {
  createCohort,
  getProgramCohorts,
  getAllCohorts,
} from "../../modules/cohorts/cohort.controller.js";

const router = Router();

/* PUBLIC */
router.get("/program/:programId", getProgramCohorts);

/* ADMIN */
router.post("/", requireAuth, authorizeRole(["ADMIN"]), createCohort);
router.get("/all", requireAuth, authorizeRole(["ADMIN"]), getAllCohorts);

export default router;
