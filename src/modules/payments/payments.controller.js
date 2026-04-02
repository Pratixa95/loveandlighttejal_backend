import { stripe } from "../../config/stripe.js";
import { db } from "../../config/db.js";
import { payments } from "../../db/schema/payments.js";
import { cohorts } from "../../db/schema/cohorts.js";
import { eq } from "drizzle-orm";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cohortId } = req.body;

    if (!cohortId) {
      return res.status(400).json({
        message: "cohortId is required",
      });
    }

    /* 🔹 GET COHORT */
    const [cohort] = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, cohortId));

    if (!cohort) {
      return res.status(404).json({
        message: "Cohort not found",
      });
    }

    const price = 50000; // ₹500 in paise

    /* 🔹 CREATE STRIPE SESSION */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: cohort.name,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        cohortId,
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    /* 🔹 SAVE PAYMENT (IMPORTANT) */
    await db.insert(payments).values({
      userId,
      cohortId,
      stripeSessionId: session.id,
      amount: price,
      currency: "inr",
      status: "pending",
    });

    return res.json({ url: session.url });

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};