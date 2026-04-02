import { Router } from "express";
import express from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { createCheckoutSession } from "./payments.controller.js";
import { handleStripeWebhook } from "./payments.webhook.js";

const router = Router();

/* 🔥 WEBHOOK (NO AUTH + RAW BODY) */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

/* 🔹 CREATE PAYMENT */
router.post(
  "/create-checkout-session",
  requireAuth,
  createCheckoutSession
);

export default router;