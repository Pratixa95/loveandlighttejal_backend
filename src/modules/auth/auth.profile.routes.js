import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";


const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({
    message: "Authenticated user",
    user: req.user,
  });
});

export default router;
