import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { createEnrollment } from "./enrollment.controller.js";

const router = Router();

router.post("/", requireAuth, createEnrollment);

export default router;