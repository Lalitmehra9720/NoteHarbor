import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiMaximize2,
  FiX,
  FiClock,
  FiBookOpen,
} from "react-icons/fi";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchNote();
  }, [id]);

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

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const wordCount = note?.content
    ? note.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readMins = Math.max(1, Math.round(wordCount / 230));

  /* ── LOADING ── */
  if (!note)
    return (
      <div className="flex items-center justify-center min-h-screen font-mono text-xs tracking-[0.25em] uppercase opacity-40">
        Loading Note…
      </div>
    );

  /* ── STANDARD VIEW ── */
  if (!isReadingMode) {
    return (
      <div className="min-h-screen transition-all duration-500">
        <div className="max-w-[860px] mx-auto px-8 py-20 pb-[120px]">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="vn-back-btn flex items-center gap-2 mb-12 font-mono text-[11px] tracking-[0.18em] uppercase opacity-[0.45] hover:opacity-100 transition-opacity duration-200 bg-transparent border-none cursor-pointer"
          >
            <FiArrowLeft size={13} />
            Back to Dashboard
          </button>

          {/* Card */}
          <div className="vn-card relative rounded-[28px] px-[60px] py-14 backdrop-blur-xl overflow-hidden">
            {/* Ambient Glow */}
            <div className="vn-card-glow absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none" />

            {/* Header */}
            <div className=" vn-card-header flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-9">
              <h1 className="vn-title m-0 font-extrabold leading-[1.15] tracking-[-0.03em]">
                {note.title}
              </h1>

              <button
                onClick={() => setIsReadingMode(true)}
                className="vn-focus-btn flex items-center gap-2.5 px-[22px] py-3 rounded-full text-white font-mono text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap shrink-0 border-none cursor-pointer transition-all duration-[250ms] hover:-translate-y-0.5 active:scale-95"
              >
                <FiMaximize2 size={13} />
                Focus Mode
              </button>
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-center mb-9">
              <span className="vn-meta-badge flex items-center gap-1.5 px-[14px] py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] opacity-[0.70]">
                <FiBookOpen size={11} />
                {wordCount.toLocaleString()} words
              </span>
              <span className="vn-meta-badge flex items-center gap-1.5 px-[14px] py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] opacity-[0.70]">
                <FiClock size={11} />~{readMins} min read
              </span>
            </div>
            {/* Content */}
            <p className="font-['Lora',Georgia,serif] text-[1.15rem] leading-[1.9] whitespace-pre-wrap opacity-[0.88] tracking-[0.01em]">
              {note.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── FOCUS MODE ── */
  return (
    <div className="vn-focus-overlay fixed inset-0 z-50 overflow-y-auto flex flex-col">
      {/* Top Bar */}
      <div className="vn-focus-bar sticky top-0 z-10 backdrop-blur-xl flex justify-between items-center px-8 h-[68px] w-full">
        {/* Timer Pill */}
        <div className="vn-timer flex items-center gap-2.5 px-[18px] py-2 rounded-full font-mono text-xs font-bold tracking-[0.12em] uppercase text-green-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#4ade80]" />
          </span>
          <FiClock size={12} />
          Session — {formatTime(seconds)}
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setIsReadingMode(false)}
          className="vn-exit-btn relative z-30 flex items-center gap-2 px-5 py-2 rounded-full font-mono text-[11px] font-bold tracking-[0.12em] uppercase cursor-pointer border border-white/20 transition-all duration-300 hover:!bg-red-600 hover:!text-white hover:!border-red-600"
        >
          <FiX size={14} />
          Exit Focus
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mt-9 items-center justify-center">
        <span className="vn-meta-badge flex items-center gap-1.5 px-[14px] py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] opacity-[0.70]">
          <FiBookOpen size={11} />
          {wordCount.toLocaleString()} words
        </span>
        <span className="vn-meta-badge flex items-center gap-1.5 px-[14px] py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] opacity-[0.70]">
          <FiClock size={11} />~{readMins} min read
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 w-full max-w-[920px] mx-auto px-5 md:px-16 pt-[42px] pb-30">
        <h1 className="vn-focus-title font-black tracking-[-0.04em] leading-[1.08] mb-5">
          {note.title}
        </h1>

        {/* Divider */}
        <div className="vn-divider w-12 h-[3px] rounded-full mb-12 opacity-70" />

        {/* Content */}
        <p className="vn-focus-text font-['Lora',Georgia,serif] leading-[1.85] whitespace-pre-wrap opacity-[0.82] tracking-[0.015em] font-light">
          {note.content}
        </p>
      </div>

      {/* Footer */}
      <div className="py-8 text-center font-mono text-[9px] tracking-[0.7em] uppercase opacity-20">
        NoteHarbor · Immersive Reading
      </div>
    </div>
  );
};

export default ViewNote;
