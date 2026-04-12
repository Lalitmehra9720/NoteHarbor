// components/notes/modal/TranslatePanel.jsx
import { Globe, Loader } from "lucide-react";
import { LANGUAGES } from "../../../utils/geminiTranslate";

const TranslatePanel = ({
  show,
  selectedLang,
  loading,
  onSelectLang,
  onTranslate,
}) => {
  if (!show) return null;

  return (
    <div
      className="mx-6 mt-4 px-5 py-4 rounded-2xl flex flex-col gap-3"
      style={{
        background: "var(--bg-secondary)",
        border:     "1px solid var(--border)",
      }}
    >
      <p
        className="font-mono text-[10px] font-bold tracking-widest uppercase"
        style={{ opacity: 0.5 }}
      >
        Translate content to:
      </p>

      {/* Language grid */}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelectLang(lang)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
            style={
              selectedLang.code === lang.code
                ? {
                    background: "var(--accent)",
                    color:      "#fff",
                    border:     "1px solid transparent",
                  }
                : {
                    background: "transparent",
                    border:     "1px solid var(--border)",
                    color:      "var(--text)",
                    opacity:    0.6,
                  }
            }
          >
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>

      {/* Translate button + warning */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onTranslate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow:  "0 4px 14px rgba(99,102,241,0.35)",
          }}
        >
          {loading ? (
            <><Loader size={12} className="animate-spin" /> Translating…</>
          ) : (
            <><Globe size={12} /> Translate to {selectedLang.flag} {selectedLang.label}</>
          )}
        </button>

        <p
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ opacity: 0.35 }}
        >
          ⚠️ Replaces current content
        </p>
      </div>
    </div>
  );
};

export default TranslatePanel;