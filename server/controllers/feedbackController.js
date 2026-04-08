


import Feedback from "../models/Feedback.js";

// 📥 Get last 5 feedbacks
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("GET_FEEDBACK_ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    if (!rating || !message) {
      return res.status(400).json({ message: "All fields required" });
    }
    const feedback = await Feedback.create({
      user: req.user._id,
      rating,
      message,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};