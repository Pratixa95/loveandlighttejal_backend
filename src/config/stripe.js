import Stripe from "stripe";
import { env } from "./env.js";

if (!env.stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY is missing");
}

export const stripe = new Stripe(env.stripeSecretKey);