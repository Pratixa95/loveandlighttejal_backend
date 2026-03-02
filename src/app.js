import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// 🔥 Stripe webhook MUST be before express.json()
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

export default app;
