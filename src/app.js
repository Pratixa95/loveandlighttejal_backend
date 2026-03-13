import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

/* ROUTES */
import routes from "./routes.js";
import programRoutes from "./modules/programs/program.routes.js";
import cohortRoutes from "./modules/cohorts/cohort.routes.js";
import enrollmentRoutes from "./modules/enrollments/enrollment.routes.js";

const app = express();

/* =========================
   CORS CONFIG
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",              // local frontend
      "https://www.loveandlighttejal.com",  // production frontend
    ],
    credentials: true,
  })
);

/* =========================
   STRIPE WEBHOOK (IMPORTANT)
   MUST BE BEFORE express.json()
========================= */
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Love & Light Tejal Backend Running 🚀",
  });
});

/* =========================
   API ROUTES
========================= */

/* base routes (auth etc) */
app.use("/api", routes);

/* feature routes */
app.use("/api/programs", programRoutes);
app.use("/api/cohorts", cohortRoutes);
app.use("/api/enrollments", enrollmentRoutes);   // ✅ YOU MISSED THIS

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;