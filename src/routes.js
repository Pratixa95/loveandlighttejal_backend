import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/auth/auth.profile.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import paymentsRoutes from "./modules/payments/payments.routes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/auth", profileRoutes);
router.use("/admin", adminRoutes);
router.use("/payments", paymentsRoutes);


export default router;
