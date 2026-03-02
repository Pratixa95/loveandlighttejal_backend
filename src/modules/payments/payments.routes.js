import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { createCheckoutSession } from "./payments.controller.js";
import { handleStripeWebhook } from "./payments.webhook.js";

const router = Router();

// Webhook route (NO auth)
router.post("/webhook", handleStripeWebhook);

// Protected checkout route
router.post(
  "/create-checkout-session",
  requireAuth,
  createCheckoutSession
);

export default router;
