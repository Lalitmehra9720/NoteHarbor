import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMaximize2,
  FiX,
  FiClock,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import AiPanel from "../components/AI/AiPanel";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const FONTS = [
  { name: "Serif",   cls: "font-serif" },
  { name: "Sans",    cls: "font-sans" },
  { name: "Mono",    cls: "font-mono" },
  { name: "Elegant", cls: "font-serif italic" },
  { name: "Modern",  cls: "font-sans font-light tracking-wide" },
];

/* ─────────────────────────────────────────
   FontSelector — small enough to stay here
   (no state dependencies, purely presentational)
───────────────────────────────────────── */
const FontSelector = ({ fontCls, onChange, isFocus = false }) => (
  <div className="vn-font-selector">
    {FONTS.map((f) => (
      <button
        key={f.name}
        onClick={() => onChange(f.cls)}
        className={`vn-font-opt ${fontCls === f.cls ? "vn-font-opt--active" : ""} ${
          isFocus ? "vn-font-opt--focus" : ""
        }`}
      >
        {f.name}
      </button>
    ))}
  </div>
);

/* ─────────────────────────────────────────
   ViewNote Page
───────────────────────────────────────── */
const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote]                   = useState(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [seconds, setSeconds]             = useState(0);
  const [copied, setCopied]               = useState(false);
  const [fontCls, setFontCls]             = useState("font-serif");

  const intervalRef = useRef(null);

  /* ── Fetch note ── */
  useEffect(() => { fetchNote(); }, [id]);

  /* ── Reading mode timer ── */
  useEffect(() => {
    if (isReadingMode) {
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((p) => p + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isReadingMode]);

  const fetchNote = async () => {
    try {
      const { data } = await axiosInstance.get(`/notes/${id}`);
      setNote(data);
    } catch {
      toast.error("Failed to load note");
    }
  };

  const handleCopyNote = () => {
    if (!note) return;
    const text = `${note.title.toUpperCase()}\n${"=".repeat(note.title.length)}\n\n${note.content}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Note copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const wordCount = note?.content
    ? note.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readMins = Math.max(1, Math.round(wordCount / 230));

  /* ── Loading state ── */
  if (!note)
    return (
      <div className="flex items-center justify-center min-h-screen font-mono text-[10px] tracking-widest opacity-30 uppercase">
        Loading...
      </div>
    );

  /* ─────────────────────────────────────────
     STANDARD VIEW
  ───────────────────────────────────────── */
  if (!isReadingMode) {
    return (
      <div className="min-h-screen transition-colors duration-500">
        <div className="max-w-[900px] mx-auto px-6 py-16 pb-32">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="vn-back-btn flex items-center gap-2 mb-10 font-mono text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
          >
            <FiArrowLeft size={12} /> Back
          </button>

          {/* Card */}
          <div className="vn-card relative rounded-[32px] px-8 md:px-12 py-12">

            {/* Header */}
            <div className="flex flex-col gap-6 mb-12 pb-10 border-b vn-card-header">
              <h1 className="vn-title m-0 font-black leading-tight tracking-tight break-words">
                {note.title}
              </h1>

              {/* Meta badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="vn-meta-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
                  {wordCount} words
                </span>
                <span className="vn-meta-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
                  ~{readMins} min read
                </span>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <FontSelector fontCls={fontCls} onChange={setFontCls} />
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={handleCopyNote}
                    className={`vn-btn-copy flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all ${
                      copied ? "vn-btn-copy--done" : ""
                    }`}
                  >
                    {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setIsReadingMode(true)}
                    className="vn-focus-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white"
                  >
                    <FiMaximize2 size={13} />
                    Focus Mode
                  </button>
                </div>
              </div>
            </div>
            {/* ✨ AI Summary Panel — separate component */}
            <AiPanel note={note} />

            {/* Note content */}
            <p className={`${fontCls} vn-note-body whitespace-pre-wrap mb-10 mt-10`}>
              {note.content}
            </p>

            

          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     FOCUS MODE
  ───────────────────────────────────────── */
  return (
    <div className="vn-focus-overlay fixed inset-0 z-50 overflow-y-auto flex flex-col">

      {/* Top bar */}
      <div className="vn-focus-bar sticky top-0 z-10 flex justify-between items-center px-8 h-[72px] w-full">
        <div className="vn-timer flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
          <FiClock size={12} />
          {formatTime(seconds)}
        </div>
        <div className="hidden md:block">
          <FontSelector fontCls={fontCls} onChange={setFontCls} isFocus />
        </div>
        <button
          onClick={() => setIsReadingMode(false)}
          className="vn-exit-btn flex items-center gap-2 px-5 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
        >
          <FiX size={13} /> Close
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[850px] mx-auto px-6 md:px-16 pt-16 pb-40">
        <h1 className="vn-focus-title font-black tracking-tighter leading-[1.1] mb-8 break-words">
          {note.title}
        </h1>
        <div className="vn-divider w-14 h-[4px] rounded-full mb-14" />
        <p className={`${fontCls} vn-focus-text whitespace-pre-wrap font-light`}>
          {note.content}
        </p>
      </div>

    </div>
  );
};

export default ViewNote;