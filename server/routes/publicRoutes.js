// routes/publicRoutes.js
import express from "express";
import User from "../models/User.js";
import Note from "../models/Note.js";

const router = express.Router();

/* ── Helper: compute streak for a user's notes ── */
const computeStreak = (notes) => {
  if (!notes.length) return 0;

  /* Get unique dates (YYYY-MM-DD) sorted descending */
  const dates = [
    ...new Set(
      notes.map((n) =>
        new Date(n.createdAt).toISOString().slice(0, 10)
      )
    ),
  ].sort((a, b) => (a > b ? -1 : 1));

  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  /* Streak must start from today or yesterday */
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak  = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev    = new Date(dates[i - 1]);
    const curr    = new Date(dates[i]);
    const diffDays = Math.round((prev - curr) / 86400000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
};

/* ── Helper: compute total words across all notes ── */
const computeWords = (notes) =>
  notes.reduce((sum, n) => {
    const words = n.content?.trim().split(/\s+/).filter(Boolean).length || 0;
    return sum + words;
  }, 0);

/* ────────────────────────────────────────
   GET /api/public/profile/:id
   Public profile of a user
──────────────────────────────────────── */
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name profileImage createdAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const notes = await Note.find({ user: req.params.id }).select(
      "createdAt content title"
    );

    const totalNotes  = notes.length;
    const totalWords  = computeWords(notes);
    const streak      = computeStreak(notes);
    const joinedAt    = user.createdAt;

    /* Recent 3 public note titles (no content for privacy) */
    const recentNotes = notes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map((n) => ({ _id: n._id, title: n.title, createdAt: n.createdAt }));

    res.json({
      _id:          user._id,
      name:         user.name,
      profileImage: user.profileImage,
      joinedAt,
      stats: { totalNotes, totalWords, streak },
      recentNotes,
    });
  } catch (err) {
    console.error("Public profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ────────────────────────────────────────
   GET /api/public/search?q=name
   Search users by name
──────────────────────────────────────── */
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2)
      return res.status(400).json({ message: "Query too short" });

    const users = await User.find({
      name: { $regex: q, $options: "i" },
    })
      .select("_id name profileImage createdAt")
      .limit(10);

    /* Attach note count to each user */
    const results = await Promise.all(
      users.map(async (u) => {
        const count = await Note.countDocuments({ user: u._id });
        return {
          _id:          u._id,
          name:         u.name,
          profileImage: u.profileImage,
          joinedAt:     u.createdAt,
          totalNotes:   count,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ────────────────────────────────────────
   GET /api/public/leaderboard
   Top 10 users by note count
──────────────────────────────────────── */
router.get("/leaderboard", async (req, res) => {
  try {
    /* Aggregate notes per user */
    const topUsers = await Note.aggregate([
      { $group: { _id: "$user", totalNotes: { $sum: 1 } } },
      { $sort:  { totalNotes: -1 } },
      { $limit: 10 },
    ]);

    /* Populate user details */
    const leaderboard = await Promise.all(
      topUsers.map(async (entry, index) => {
        const user = await User.findById(entry._id).select(
          "name profileImage createdAt"
        );
        if (!user) return null;

        const notes      = await Note.find({ user: entry._id }).select("createdAt content");
        const totalWords = computeWords(notes);
        const streak     = computeStreak(notes);

        return {
          rank:         index + 1,
          _id:          user._id,
          name:         user.name,
          profileImage: user.profileImage,
          joinedAt:     user.createdAt,
          stats: {
            totalNotes:  entry.totalNotes,
            totalWords,
            streak,
          },
        };
      })
    );

    res.json(leaderboard.filter(Boolean)); // remove nulls
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;