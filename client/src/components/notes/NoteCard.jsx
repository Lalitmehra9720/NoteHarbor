import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbtack, FaEdit, FaTrash } from "react-icons/fa";
import { FiShare2, FiEye, FiAlertTriangle, FiX, FiCheck } from "react-icons/fi";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

/* ── Highlight matching search text ── */
const highlightText = (text, query) => {
  if (!query || !text) return text;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        style={{
          background: "rgba(99,102,241,0.28)",
          color: "inherit",
          borderRadius: "3px",
          padding: "0 2px",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

/* ── Delete Confirm Overlay ── */
const DeleteConfirm = ({ onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.92 }}
    transition={{ duration: 0.18 }}
    className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 rounded-2xl"
    style={{
      background: "rgba(10,10,20,0.88)",
      backdropFilter: "blur(8px)",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
      style={{
        background: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
      }}
    >
      <FiAlertTriangle size={18} style={{ color: "#ef4444" }} />
    </div>
    <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-white opacity-70">
      Delete this note?
    </p>
    <div className="flex gap-2 mt-1">
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
        }}
      >
        <FiX size={11} /> Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
        style={{
          background: "rgba(239,68,68,0.25)",
          border: "1px solid rgba(239,68,68,0.4)",
          color: "#ef4444",
        }}
      >
        <FiCheck size={11} /> Delete
      </button>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════
   NoteCard
══════════════════════════════════════════ */
const NoteCard = ({ note, onEdit, onDelete, onPin, search }) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ── Format date ── */
  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  /* ── Word count ── */
  const wordCount = note.content
    ? note.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  /* ── Delete with confirm ── */
  const handleDeleteConfirm = async (e) => {
    e?.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(note._id);
      toast.success("Note deleted");
    } catch {
      toast.error("Could not delete note");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  /* ── Share — PDF on desktop, Web Share API on mobile ── */
  const handleShare = async (e) => {
    e.stopPropagation();

    try {
      const doc = new jsPDF();

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(note.title, 14, 22);

      // Divider line
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(14, 26, 196, 26);

      // Content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(note.content, 180);
      doc.text(lines, 14, 34);

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Shared via NoteHarbor • ${formattedDate}`, 14, 285);

      const pdfBlob = doc.output("blob");
      const file = new File([pdfBlob], `${note.title}.pdf`, {
        type: "application/pdf",
      });

      /* Mobile: Web Share API with file */
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: note.title,
          text: `Check out this note: ${note.title}`,
        });
        // toast.success("Note shared!");
        return;
      }

      /* Mobile fallback: share text only */
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: `${note.title}\n\n${note.content}\n\n— Shared via NoteHarbor`,
        });
        toast.success("Note shared!");
        return;
      }

      /* Desktop fallback: download PDF */
      doc.save(`${note.title}.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Could not share note");
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col rounded-[22px] overflow-hidden cursor-pointer group"
      style={{
        background: "var(--glass)",
        backdropFilter: "blur(14px)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minHeight: "240px",
      }}
      onClick={() => !confirmDelete && navigate(`/note/${note._id}`)}
    >
      {/* ── Indigo accent top bar ── */}
      <div
        className="h-[3px] w-full"
        style={{
          background: note.isPinned
            ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
            : "linear-gradient(90deg, #6366f1, #818cf8)",
          opacity: note.isPinned ? 1 : 0.6,
          transition: "opacity 0.2s",
        }}
      />

      {/* ── Glow on hover ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Action buttons ── */}
      <div
        className="absolute top-4 right-4 flex gap-1.5 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pin */}
        <button
          title={note.isPinned ? "Unpin" : "Pin"}
          onClick={() => onPin(note._id)}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
          style={{
            background: note.isPinned
              ? "rgba(251,191,36,0.18)"
              : "var(--bg-secondary)",
            border: note.isPinned
              ? "1px solid rgba(251,191,36,0.4)"
              : "1px solid var(--border)",
            color: note.isPinned ? "#f59e0b" : "var(--text)",
            opacity: note.isPinned ? 1 : 0.5,
          }}
        >
          <FaThumbtack size={11} />
        </button>

        {/* Edit */}
        <button
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all opacity-50 hover:opacity-100"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "#6366f1",
          }}
        >
          <FaEdit size={11} />
        </button>

        {/* Share */}
        <button
          title="Share"
          onClick={handleShare}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all opacity-50 hover:opacity-100"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <FiShare2 size={12} />
        </button>

        {/* Delete */}
        <button
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmDelete(true);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all opacity-50 hover:opacity-100"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "#ef4444",
          }}
        >
          <FaTrash size={11} />
        </button>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-2 z-10">
        {/* Pin badge */}
        {note.isPinned && (
          <span
            className="self-start font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-1"
            style={{
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.35)",
              color: "#f59e0b",
            }}
          >
            Pinned
          </span>
        )}

        {/* Title */}
        <h2
          className="font-black text-lg leading-snug line-clamp-1 pr-28"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            color: "var(--text)",
          }}
        >
          {highlightText(note.title, search)}
        </h2>

        {/* Content preview */}
        <p
          className="line-clamp-3 text-sm leading-relaxed flex-1 break-words"
          style={{ color: "var(--text)", opacity: 0.62 }}
        >
          {highlightText(note.content, search)}
        </p>

        {/* ── Footer meta ── */}
        <div
          className="flex items-center justify-between pt-3 mt-auto"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase opacity-40">
            {formattedDate}
          </span>
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase opacity-40">
            {wordCount} words
          </span>
        </div>
      </div>

      {/* ── Read More hover overlay ── */}
      <div
        className="absolute inset-0 z-20 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 60%)",
        }}
      >
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl text-white pointer-events-auto"
          style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/note/${note._id}`);
          }}
        >
          <FiEye size={11} /> Read Note
        </span>
      </div>

      {/* ── Delete confirm overlay ── */}
      <AnimatePresence>
        {confirmDelete && (
          <DeleteConfirm
            onConfirm={handleDeleteConfirm}
            onCancel={(e) => {
              e?.stopPropagation();
              setConfirmDelete(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NoteCard;
