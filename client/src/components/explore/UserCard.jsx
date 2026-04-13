// components/explore/UserCard.jsx
import { useNavigate } from "react-router-dom";
import { FiUser, FiFileText, FiType, FiZap } from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa";

/* ── Format large numbers: 1200 → 1.2k ── */
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);

/* ── Rank medal colors ── */
const RANK_STYLE = {
  1: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)", color: "#f59e0b" },
  2: { bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.4)", color: "#94a3b8" },
  3: { bg: "rgba(180,120,60,0.15)", border: "rgba(180,120,60,0.4)", color: "#b4783c" },
};

const UserCard = ({ user, rank }) => {
  const navigate = useNavigate();
  const rankStyle = RANK_STYLE[rank] || null;

  return (
    <div
      onClick={() => navigate(`/profile/${user._id}`)}
      className="relative flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all group"
      style={{
        background:  "var(--glass)",
        border:      `1px solid ${rankStyle ? rankStyle.border : "var(--border)"}`,
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.transform   = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = rankStyle ? rankStyle.border : "var(--border)";
        e.currentTarget.style.transform   = "translateY(0)";
      }}
    >
      {/* Rank badge */}
      {rank && (
        <div
          className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black"
          style={
            rankStyle
              ? { background: rankStyle.bg, border: `1px solid ${rankStyle.border}`, color: rankStyle.color }
              : { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)", opacity: 0.6 }
          }
        >
          {rank}
        </div>
      )}

      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <FiUser size={20} style={{ opacity: 0.4 }} />
        )}
      </div>

      {/* Name + join date */}
      <div className="flex-1 min-w-0">
        <p
          className="font-black text-base truncate"
          style={{ fontFamily: "'Lora', Georgia, serif", color: "var(--text)" }}
        >
          {user.name}
        </p>
        <p className="font-mono text-[9px] font-bold tracking-widest uppercase opacity-40 mt-0.5">
          Joined {new Date(user.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
        </p>
      </div>

      {/* Stats pills */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notes */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold tracking-widest uppercase"
          style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
        >
          <FiFileText size={10} />
          {fmt(user.stats?.totalNotes ?? user.totalNotes ?? 0)}
        </div>

        {/* Words */}
        {user.stats?.totalWords !== undefined && (
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold tracking-widest uppercase"
            style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}
          >
            <FiType size={10} />
            {fmt(user.stats.totalWords)}
          </div>
        )}

        {/* Streak */}
        {user.stats?.streak > 0 && (
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold tracking-widest uppercase"
            style={{ background: "rgba(251,191,36,0.1)", color: "#f59e0b" }}
          >
            <FiZap size={10} />
            {user.stats.streak}d
          </div>
        )}
      </div>

      {/* Arrow */}
      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px]"
        style={{ color: "#6366f1" }}
      >
        →
      </div>
    </div>
  );
};

export default UserCard;