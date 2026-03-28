
import express from "express";
import mongoose from "mongoose";
import Note from "../models/Note.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔥 Seed notes for logged-in user
router.get("/seed", protect, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 DELETE note
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();

    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 UPDATE note
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ VALIDATION
    if (
      (title !== undefined && !title.trim()) ||
      (content !== undefined && !content.trim())
    ) {
      return res.status(400).json({
        message: "Title and content cannot be empty",
      });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;

    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 GET single note
router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 GET all notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 CREATE note
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    // ✅ VALIDATION
    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;