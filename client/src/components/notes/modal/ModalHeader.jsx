// components/notes/modal/ModalHeader.jsx
import { Wand2, Globe, RotateCcw, Loader, X } from "lucide-react";

const ModalHeader = ({
  isEditing,
  grammarLoading,
  translateOpen,
  showUndo,
  isAiWorking,
  onFixGrammar,
  onUndo,
  onToggleTranslate,
  onClose,
}) => {
  return (
    <div
      className="flex items-center justify-between px-8 py-5"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Title */}
      <h2
        className="text-2xl font-black tracking-tight"
        style={{ fontFamily: "'Lora', Georgia, serif" }}
      >
        {isEditing ? "Edit Note" : "New Note"}
      </h2>

      <div className="flex items-center gap-2">

        {/* Fix Grammar button */}
        <button
          onClick={onFixGrammar}
          disabled={isAiWorking}
          title="Fix grammar & spelling using AI"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: grammarLoading
              ? "rgba(99,102,241,0.15)"
              : "var(--bg-secondary)",
            border: grammarLoading
              ? "1px solid rgba(99,102,241,0.4)"
              : "1px solid var(--border)",
            color: grammarLoading ? "#6366f1" : "var(--text)",
          }}
        >
          {grammarLoading ? (
            <><Loader size={12} className="animate-spin" /> Fixing…</>
          ) : (
            <><Wand2 size={12} /> Fix Grammar</>
          )}
        </button>

        {/* Undo button */}
        {showUndo && !isAiWorking && (
          <button
            onClick={onUndo}
            title="Undo AI changes"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
            style={{
              background: "rgba(251,191,36,0.1)",
              border:     "1px solid rgba(251,191,36,0.3)",
              color:      "#f59e0b",
            }}
          >
            <RotateCcw size={12} /> Undo
          </button>
        )}

        {/* Translate toggle button */}
        <button
          onClick={onToggleTranslate}
          disabled={isAiWorking}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={
            translateOpen
              ? {
                  background: "var(--accent)",
                  color:      "#fff",
                  boxShadow:  "0 4px 14px rgba(99,102,241,0.35)",
                  border:     "1px solid transparent",
                }
              : {
                  background: "var(--bg-secondary)",
                  border:     "1px solid var(--border)",
                  color:      "var(--text)",
                }
          }
        >
          <Globe size={12} />
          Translate
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all opacity-50 hover:opacity-100"
          style={{
            background: "var(--bg-secondary)",
            border:     "1px solid var(--border)",
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;