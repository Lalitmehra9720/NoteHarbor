import express from "express";
import mongoose from "mongoose";
import Note from "../models/Note.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Seed notes for logged-in user (Better way)
router.get("/seed", protect, async (req, res) => {
  const notes = await Note.insertMany([
    {
      title: "Dummy Note 1",
      content: "This is a test note",
      user: req.user._id,
    },
    {
      title: "Dummy Note 2",
      content: "Another test note",
      user: req.user._id,
    },
  ]);

  res.json(notes);
});
// DELETE note
router.delete("/:id", protect, async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await note.deleteOne();

  res.json({ message: "Note deleted" });
});

// UPDATE note
router.put("/:id", protect, async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;

  const updatedNote = await note.save();

  res.json(updatedNote);
});

// GET all notes for logged-in user
router.get("/", protect, async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

// CREATE note
router.post("/", protect, async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.create({
    title,
    content,
    user: req.user._id,
  });

  res.status(201).json(note);
});

export default router;