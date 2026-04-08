import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import Note from "./models/Note.js";
import Feedback from "./models/Feedback.js";

const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
console.log("Notes route loaded");
app.use("/api/notes", noteRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api", (req, res) => {
  res.send("API Running...");
});


app.get("/api/stats", async (req, res) => {
  try {
    const [userCount, noteCount, feedbacks] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments(),
      Feedback.find({}, "rating"),
    ]);

    const totalFeedbacks = feedbacks.length;
    const averageRating =
      totalFeedbacks > 0
        ? feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / totalFeedbacks
        : 0;

    res.json({
      userCount,
      noteCount,
      feedbackCount: totalFeedbacks,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));