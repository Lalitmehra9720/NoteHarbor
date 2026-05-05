import express from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
  verifyResetOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

export default router;
