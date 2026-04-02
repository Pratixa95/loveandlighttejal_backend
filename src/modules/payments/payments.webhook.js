import { stripe } from "../../config/stripe.js";
import { env } from "../../config/env.js";
import { db } from "../../config/db.js";
import { payments } from "../../db/schema/payments.js";
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
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { userId, cohortId } = session.metadata;

      console.log("✅ Payment success:", session.id);

      /* 🔹 UPDATE PAYMENT */
      await db
        .update(payments)
        .set({
          status: "success",
          stripePaymentIntentId: session.payment_intent,
        })
        .where(eq(payments.stripeSessionId, session.id));

      /* 🔹 ACTIVATE ENROLLMENT */
      await db
        .update(enrollments)
        .set({
          status: "active",
        })
        .where(eq(enrollments.userId, userId));

      console.log("🎉 Enrollment activated");
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Webhook DB error:", error);
    res.status(500).send("Webhook error");
  }
};