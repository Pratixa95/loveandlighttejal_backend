import { stripe } from "./config/stripe.js";

const testStripe = async () => {
  try {
    const products = await stripe.products.list();
    console.log("✅ Stripe connected successfully");
    console.log(products.data);
  } catch (error) {
    console.error("❌ Stripe connection failed");
    console.error(error.message);
  }
};

testStripe();
