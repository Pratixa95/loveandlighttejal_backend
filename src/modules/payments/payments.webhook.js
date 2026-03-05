import { stripe } from "../../config/stripe.js";
import { env } from "../../config/env.js";
import { db } from "../../config/db.js";
import { payments } from "../../db/schema/index.js";
import { enrollments } from "../../db/schema/enrollments.js";
import { eq } from "drizzle-orm";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { userId, programId } = session.metadata;

      console.log("✅ Payment successful:", session.id);

      // 1️⃣ Insert payment record
      await db.insert(payments).values({
        userId,
        programId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        status: "SUCCESS",
      });

      // 2️⃣ Create enrollment
      await db.insert(enrollments).values({
        userId,
        programId,
        status: "ACTIVE",
      });

      console.log("🎉 Enrollment created");
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Database error");
  }
};
