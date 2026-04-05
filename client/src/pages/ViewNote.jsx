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
  FiZap,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const FONTS = [
  { name: "Serif",   cls: "font-serif" },
  { name: "Sans",    cls: "font-sans" },
  { name: "Mono",    cls: "font-mono" },
  { name: "Elegant", cls: "font-serif italic" },
  { name: "Modern",  cls: "font-sans font-light tracking-wide" },
];

const SUMMARY_MODES = [
  {
    label: "Short",
    desc: "2–3 sentences",
    prompt: "Summarize this note in 2-3 crisp sentences. Be direct and concise. Respond only with the summary, no preamble.",
  },
  {
    label: "Detailed",
    desc: "Key bullet points",
    prompt: "Summarize this note as 4-6 clear bullet points covering all key ideas. Respond only with the bullet points, no preamble.",
  },
  {
    label: "ELI5",
    desc: "Simple language",
    prompt: "Explain this note in very simple, easy-to-understand language as if explaining to a beginner. Respond only with the explanation, no preamble.",
  },
];

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote]                   = useState(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [seconds, setSeconds]             = useState(0);
  const [copied, setCopied]               = useState(false);
  const [fontCls, setFontCls]             = useState("font-serif");

  // AI state
  const [aiOpen, setAiOpen]       = useState(false);
  const [aiMode, setAiMode]       = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult]   = useState("");
  const [aiCopied, setAiCopied]   = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => { fetchNote(); }, [id]);

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

  /* ── AI Summarize — Gemini API ── */
  const handleSummarize = async () => {
    if (!note) return;
    setAiLoading(true);
    setAiResult("");

    const mode = SUMMARY_MODES[aiMode];
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      toast.error("Gemini API key missing! Add VITE_GEMINI_API_KEY in .env");
      setAiLoading(false);
      return;
    }

    const prompt = `${mode.prompt}\n\nNote title: "${note.title}"\n\nNote content:\n${note.content}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 512,
            },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err?.error?.message ?? `HTTP ${res.status}`
        );
      }

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) throw new Error("Empty response from Gemini");

      setAiResult(text.trim());
    } catch (err) {
      toast.error(`AI Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAi = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult).then(() => {
      setAiCopied(true);
      toast.success("Summary copied!");
      setTimeout(() => setAiCopied(false), 2000);
    });
  };

  /* ── Font Selector ── */
  const FontSelector = ({ isFocus = false }) => (
    <div className="vn-font-selector">
      {FONTS.map((f) => (
        <button
          key={f.name}
          onClick={() => setFontCls(f.cls)}
          className={`vn-font-opt ${fontCls === f.cls ? "vn-font-opt--active" : ""} ${
            isFocus ? "vn-font-opt--focus" : ""
          }`}
        >
          {f.name}
        </button>
      ))}
    </div>
  );

  /* ── AI Panel ── */
  const AiPanel = () => (
    <div className="vn-ai-panel">
      {/* Header / toggle */}
      <button
        className="vn-ai-panel__header"
        onClick={() => setAiOpen((p) => !p)}
      >
        <span className="vn-ai-panel__icon">
          <FiZap size={14} />
        </span>
        <span className="vn-ai-panel__title">AI Summary</span>
        <span className="vn-ai-panel__badge">Powered by Gemini</span>
        <span className="vn-ai-panel__chevron">
          {aiOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </span>
      </button>

      {/* Collapsible body */}
      {aiOpen && (
        <div className="vn-ai-panel__body">

          {/* Mode tabs */}
          <div className="vn-ai-modes">
            {SUMMARY_MODES.map((m, i) => (
              <button
                key={m.label}
                onClick={() => { setAiMode(i); setAiResult(""); }}
                className={`vn-ai-mode ${aiMode === i ? "vn-ai-mode--active" : ""}`}
              >
                <span className="vn-ai-mode__label">{m.label}</span>
                <span className="vn-ai-mode__desc">{m.desc}</span>
              </button>
            ))}
          </div>

          {/* Summarize button */}
          <button
            onClick={handleSummarize}
            disabled={aiLoading}
            className="vn-ai-run-btn"
          >
            {aiLoading ? (
              <>
                <span className="vn-ai-spinner" />
                Generating…
              </>
            ) : (
              <>
                <FiZap size={13} />
                {aiResult ? "Re-summarize" : "Summarize Note"}
              </>
            )}
          </button>

          {/* Result box */}
          {aiResult && (
            <div className="vn-ai-result">
              <p className="vn-ai-result__text">{aiResult}</p>
              <div className="vn-ai-result__footer">
                <button onClick={handleCopyAi} className="vn-ai-copy-btn">
                  {aiCopied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                  {aiCopied ? "Copied!" : "Copy summary"}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );

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

          <button
            onClick={() => navigate(-1)}
            className="vn-back-btn flex items-center gap-2 mb-10 font-mono text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
          >
            <FiArrowLeft size={12} /> Back
          </button>

          <div className="vn-card relative rounded-[32px] px-8 md:px-12 py-12">

            <div className="flex flex-col gap-6 mb-12 pb-10 border-b vn-card-header">
              <h1 className="vn-title m-0 font-black leading-tight tracking-tight break-words">
                {note.title}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="vn-meta-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
                  {wordCount} words
                </span>
                <span className="vn-meta-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
                  ~{readMins} min read
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <FontSelector />
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

            {/* Note content */}
            <p className={`${fontCls} vn-note-body whitespace-pre-wrap mb-10`}>
              {note.content}
            </p>

            {/* ✨ AI Summary Panel */}
            <AiPanel />

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
      <div className="vn-focus-bar sticky top-0 z-10 flex justify-between items-center px-8 h-[72px] w-full">
        <div className="vn-timer flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
          <FiClock size={12} />
          {formatTime(seconds)}
        </div>
        <div className="hidden md:block">
          <FontSelector isFocus />
        </div>
        <button
          onClick={() => setIsReadingMode(false)}
          className="vn-exit-btn flex items-center gap-2 px-5 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
        >
          <FiX size={13} /> Close
        </button>
      </div>

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

