// pages/PublicProfilePage.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser, FiFileText, FiType, FiZap,
  FiCalendar, FiBookOpen, FiLoader,
} from "react-icons/fi";
import usePublic from "../hooks/usePublic";
import BackButton from "../components/ui/BackButton";

/* ── Format numbers ── */
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);

/* ── Stat card ── */
const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-2 p-6 rounded-2xl text-center"
    style={{
      background:  "var(--glass)",
      border:      "1px solid var(--border)",
      backdropFilter: "blur(10px)",
    }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mb-1"
      style={{ background: `${color}15`, color }}
    >
      {icon}
    </div>
    <p
      className="text-3xl font-black tracking-tight"
      style={{ fontFamily: "'Lora', Georgia, serif", color: "var(--text)" }}
    >
      {fmt(value)}
    </p>
    <p className="font-mono text-[9px] font-bold tracking-widest uppercase opacity-45">
      {label}
    </p>
  </motion.div>
);

/* ════════════════════════════════════════
   PublicProfilePage
════════════════════════════════════════ */
const PublicProfilePage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { profile, profileLoading, profileError, fetchProfile } = usePublic();

  useEffect(() => { fetchProfile(id); }, [id]);

  /* ── Loading ── */
  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <FiLoader size={28} className="animate-spin" style={{ color: "#6366f1" }} />
        <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-35">
          Loading profile…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (profileError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.1)" }}
        >
          <FiUser size={28} style={{ color: "#ef4444", opacity: 0.7 }} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black" style={{ fontFamily: "'Lora', serif" }}>
            User not found
          </h2>
          <p className="opacity-50 text-sm mt-1">{profileError}</p>
        </div>
        <button
          onClick={() => navigate("/explore")}
          className="font-mono text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all"
          style={{
            background: "var(--bg-secondary)",
            border:     "1px solid var(--border)",
            color:      "var(--text)",
          }}
        >
          ← Back to Explore
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const { name, profileImage, joinedAt, stats, recentNotes } = profile;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <BackButton />

        {/* ── Profile header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-8 rounded-[28px]"
          style={{
            background:  "var(--glass)",
            border:      "1px solid var(--border)",
            backdropFilter: "blur(14px)",
          }}
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
            style={{ background: "var(--bg-secondary)", border: "2px solid var(--border)" }}
          >
            {profileImage ? (
              <img src={profileImage} alt={name} className="w-full h-full object-cover" />
            ) : (
              <FiUser size={36} style={{ opacity: 0.3 }} />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ fontFamily: "'Lora', Georgia, serif", color: "var(--text)" }}
            >
              {name}
            </h1>

            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <FiCalendar size={11} style={{ opacity: 0.4 }} />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-40">
                Joined{" "}
                {new Date(joinedAt).toLocaleDateString("en-IN", {
                  month: "long",
                  year:  "numeric",
                })}
              </span>
            </div>

            {/* Streak badge */}
            {stats.streak > 0 && (
              <div className="flex justify-center sm:justify-start mt-1">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-black tracking-widest uppercase"
                  style={{
                    background: "rgba(251,191,36,0.12)",
                    border:     "1px solid rgba(251,191,36,0.35)",
                    color:      "#f59e0b",
                  }}
                >
                  <FiZap size={11} />
                  {stats.streak} day streak 🔥
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<FiFileText size={20} />}
            label="Notes"
            value={stats.totalNotes}
            color="#6366f1"
            delay={0.1}
          />
          <StatCard
            icon={<FiType size={20} />}
            label="Words"
            value={stats.totalWords}
            color="#8b5cf6"
            delay={0.2}
          />
          <StatCard
            icon={<FiZap size={20} />}
            label="Day Streak"
            value={stats.streak}
            color="#f59e0b"
            delay={0.3}
          />
        </div>

        {/* ── Recent notes ── */}
        {recentNotes?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FiBookOpen size={14} style={{ opacity: 0.5 }} />
              <p className="font-mono text-[10px] font-black tracking-widest uppercase opacity-50">
                Recent Notes
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {recentNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                  className="flex items-center justify-between px-5 py-4 rounded-2xl"
                  style={{
                    background: "var(--glass)",
                    border:     "1px solid var(--border)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: "#6366f1", opacity: 0.6 }}
                    />
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: "var(--text)" }}
                    >
                      {note.title}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] font-bold tracking-widest uppercase opacity-35 shrink-0 ml-3">
                    {new Date(note.createdAt).toLocaleDateString("en-IN", {
                      day:   "numeric",
                      month: "short",
                    })}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default PublicProfilePage;