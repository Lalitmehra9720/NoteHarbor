import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiZap,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const SUMMARY_MODES = [
  {
    label: "Short",
    desc: "2–3 sentences",
    prompt:
      "Summarize this note in 2-3 crisp sentences. Be direct and concise. Respond only with the summary, no preamble.",
  },
  {
    label: "Detailed",
    desc: "Key bullet points",
    prompt:
      "Summarize this note as 4-6 clear bullet points covering all key ideas. Respond only with the bullet points, no preamble.",
  },
  {
    label: "ELI5",
    desc: "Simple language",
    prompt:
      "Explain this note in very simple, easy-to-understand language as if explaining to a beginner. Respond only with the explanation, no preamble.",
  },
];

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

/* ─────────────────────────────────────────
   AiPanel Component
   Props:
     note  — { title: string, content: string }
───────────────────────────────────────── */
const AiPanel = ({ note }) => {
  const [isOpen, setIsOpen]     = useState(false);
  const [mode, setMode]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState("");
  const [copied, setCopied]     = useState(false);

  /* ── Gemini API call ── */
  const handleSummarize = async () => {
    if (!note) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error("Gemini API key missing! Add VITE_GEMINI_API_KEY in .env");
      return;
    }

    setLoading(true);
    setResult("");

    const selectedMode = SUMMARY_MODES[mode];
    const prompt = `${selectedMode.prompt}\n\nNote title: "${note.title}"\n\nNote content:\n${note.content}`;

    try {
      const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) throw new Error("Empty response from Gemini");
      setResult(text.trim());
    } catch (err) {
      toast.error(`AI Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ── Copy summary ── */
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      toast.success("Summary copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Mode change — reset result ── */
  const handleModeChange = (index) => {
    setMode(index);
    setResult("");
  };

  return (
    <div className="vn-ai-panel">

      {/* ── Header / Toggle ── */}
      <button
        className="vn-ai-panel__header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="vn-ai-panel__icon">
          <FiZap size={14} />
        </span>
        <span className="vn-ai-panel__title">AI Summary</span>
        <span className="vn-ai-panel__badge">Powered by Gemini</span>
        <span className="vn-ai-panel__chevron">
          {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </span>
      </button>

      {/* ── Collapsible Body ── */}
      {isOpen && (
        <div className="vn-ai-panel__body">

          {/* Mode Tabs */}
          <div className="vn-ai-modes">
            {SUMMARY_MODES.map((m, i) => (
              <button
                key={m.label}
                onClick={() => handleModeChange(i)}
                className={`vn-ai-mode ${mode === i ? "vn-ai-mode--active" : ""}`}
              >
                <span className="vn-ai-mode__label">{m.label}</span>
                <span className="vn-ai-mode__desc">{m.desc}</span>
              </button>
            ))}
          </div>

          {/* Summarize Button */}
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="vn-ai-run-btn"
          >
            {loading ? (
              <>
                <span className="vn-ai-spinner" />
                Generating…
              </>
            ) : (
              <>
                <FiZap size={13} />
                {result ? "Re-summarize" : "Summarize Note"}
              </>
            )}
          </button>

          {/* Result Box */}
          {result && (
            <div className="vn-ai-result">
              <p className="vn-ai-result__text">{result}</p>
              <div className="vn-ai-result__footer">
                <button onClick={handleCopy} className="vn-ai-copy-btn">
                  {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                  {copied ? "Copied!" : "Copy summary"}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AiPanel;