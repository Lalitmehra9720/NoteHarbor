

import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiZap,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiCheck,
  FiGlobe,
} from "react-icons/fi";
import { geminiTranslate, LANGUAGES } from "../../utils/geminiTranslate";

/* ─────────────────────────────────────────
   Summary modes
───────────────────────────────────────── */
const SUMMARY_MODES = [
  {
    label: "Short",
    desc:  "2–3 sentences",
    prompt: "Summarize this note in 2-3 crisp sentences. Be direct and concise. Respond only with the summary, no preamble.",
  },
  {
    label: "Detailed",
    desc:  "Key bullet points",
    prompt: "Summarize this note as 4-6 clear bullet points covering all key ideas. Respond only with the bullet points, no preamble.",
  },
  {
    label: "ELI5",
    desc:  "Simple language",
    prompt: "Explain this note in very simple, easy-to-understand language as if explaining to a beginner. Respond only with the explanation, no preamble.",
  },
];

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/* ─────────────────────────────────────────
   AiPanel — Summary + Translate tabs
───────────────────────────────────────── */
const AiPanel = ({ note }) => {
  const [isOpen, setIsOpen]       = useState(false);
  const [activeTab, setActiveTab] = useState("summary"); // "summary" | "translate"

  /* Summary state */
  const [summaryMode, setSummaryMode]   = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult]   = useState("");
  const [summaryCopied, setSummaryCopied]   = useState(false);

  /* Translate state */
  const [selectedLang, setSelectedLang]       = useState(LANGUAGES[0]); // Hindi default
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translateResult, setTranslateResult]   = useState("");
  const [translateCopied, setTranslateCopied]   = useState(false);

  /* ── Summarize ── */
  const handleSummarize = async () => {
    if (!note) return;
    setSummaryLoading(true);
    setSummaryResult("");

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const mode   = SUMMARY_MODES[summaryMode];
    const prompt = `${mode.prompt}\n\nNote title: "${note.title}"\n\nNote content:\n${note.content}`;

    try {
      const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!text) throw new Error("Empty response");
      setSummaryResult(text.trim());
    } catch (err) {
      toast.error(`AI Error: ${err.message}`);
    } finally {
      setSummaryLoading(false);
    }
  };

  /* ── Translate ── */
  const handleTranslate = async () => {
    if (!note) return;
    setTranslateLoading(true);
    setTranslateResult("");

    try {
      const fullText = `Title: ${note.title}\n\n${note.content}`;
      const result   = await geminiTranslate(fullText, selectedLang.label);
      setTranslateResult(result);
    } catch (err) {
      toast.error(`Translate Error: ${err.message}`);
    } finally {
      setTranslateLoading(false);
    }
  };

  /* ── Copy helpers ── */
  const copyText = (text, setCopied) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Spinner ── */
  const Spinner = () => (
    <span
      style={{
        display:      "inline-block",
        width:        13,
        height:       13,
        borderRadius: "50%",
        border:       "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        animation:    "vnSpin 0.7s linear infinite",
        flexShrink:   0,
      }}
    />
  );

  /* ── Result box ── */
  const ResultBox = ({ text, copied, onCopy }) => (
    <div className="vn-ai-result">
      <p className="vn-ai-result__text">{text}</p>
      <div className="vn-ai-result__footer">
        <button onClick={onCopy} className="vn-ai-copy-btn">
          {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="vn-ai-panel">

      {/* ── Panel header / toggle ── */}
      <button
        className="vn-ai-panel__header"
        onClick={() => setIsOpen((p) => !p)}
      >
        <span className="vn-ai-panel__icon">
          <FiZap size={14} />
        </span>
        <span className="vn-ai-panel__title">AI Tools</span>
        <span className="vn-ai-panel__badge">Powered by NoteHarbor</span>
        <span className="vn-ai-panel__chevron">
          {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </span>
      </button>

      {/* ── Collapsible body ── */}
      {isOpen && (
        <div className="vn-ai-panel__body">

          {/* ── Tab switcher ── */}
          <div
            className="flex gap-1 p-1 rounded-xl mt-2"
            style={{
              background: "var(--bg-secondary)",
              border:     "1px solid var(--border)",
              alignSelf:  "flex-start",
            }}
          >
            {[
              { id: "summary",   icon: <FiZap size={11} />,   label: "Summarize" },
              { id: "translate", icon: <FiGlobe size={11} />, label: "Translate" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
                style={
                  activeTab === tab.id
                    ? { background: "var(--accent)", color: "#fff" }
                    : { background: "transparent", color: "var(--text)", opacity: 0.45 }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════
              SUMMARY TAB
          ══════════════════════ */}
          {activeTab === "summary" && (
            <>
              <div className="vn-ai-modes">
                {SUMMARY_MODES.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => { setSummaryMode(i); setSummaryResult(""); }}
                    className={`vn-ai-mode ${summaryMode === i ? "vn-ai-mode--active" : ""}`}
                  >
                    <span className="vn-ai-mode__label">{m.label}</span>
                    <span className="vn-ai-mode__desc">{m.desc}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSummarize}
                disabled={summaryLoading}
                className="vn-ai-run-btn"
              >
                {summaryLoading ? (
                  <><Spinner /> Generating…</>
                ) : (
                  <><FiZap size={13} /> {summaryResult ? "Re-summarize" : "Summarize Note"}</>
                )}
              </button>

              {summaryResult && (
                <ResultBox
                  text={summaryResult}
                  copied={summaryCopied}
                  onCopy={() => copyText(summaryResult, setSummaryCopied)}
                />
              )}
            </>
          )}

          {/* ══════════════════════
              TRANSLATE TAB
          ══════════════════════ */}
          {activeTab === "translate" && (
            <>
              {/* Language picker */}
              <div>
                <p
                  className="font-mono text-[10px] font-bold tracking-widest uppercase mb-3"
                  style={{ opacity: 0.45 }}
                >
                  Select language
                </p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang); setTranslateResult(""); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
                      style={
                        selectedLang.code === lang.code
                          ? {
                              background:  "var(--accent)",
                              color:       "#fff",
                              border:      "1px solid transparent",
                            }
                          : {
                              background:  "transparent",
                              color:       "var(--text)",
                              border:      "1px solid var(--border)",
                              opacity:     0.65,
                            }
                      }
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translate button */}
              <button
                onClick={handleTranslate}
                disabled={translateLoading}
                className="vn-ai-run-btn"
              >
                {translateLoading ? (
                  <><Spinner /> Translating…</>
                ) : (
                  <>
                    <FiGlobe size={13} />
                    {translateResult
                      ? `Re-translate to ${selectedLang.label}`
                      : `Translate to ${selectedLang.flag} ${selectedLang.label}`}
                  </>
                )}
              </button>

              {/* Result */}
              {translateResult && (
                <ResultBox
                  text={translateResult}
                  copied={translateCopied}
                  onCopy={() => copyText(translateResult, setTranslateCopied)}
                />
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default AiPanel;