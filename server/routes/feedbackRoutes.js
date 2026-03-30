import express from "express";
import { createFeedback, getFeedbacks } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFeedback);
router.get("/", getFeedbacks);


export default router;