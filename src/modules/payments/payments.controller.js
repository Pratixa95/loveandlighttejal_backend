import { stripe } from "../../config/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { price, programId } = req.body;
    const userId = req.user?.id; // from requireAuth middleware

    if (!price || !programId) {
      return res.status(400).json({
        message: "price and programId are required",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Love and Light Tejal Program",
            },
            unit_amount: price, // must be cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        programId,
        userId,
      },
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("CHECKOUT ERROR:", error.message);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};
