// components/notes/modal/NoteTextArea.jsx
import { Loader, AlertCircle } from "lucide-react";

const NoteTextArea = ({
  note,
  setNote,
  formError,
  isAiWorking,
  grammarLoading,
  translateLoading,
  showUndo,
  onResetUndo,
}) => {
  const placeholder = grammarLoading
    ? "⏳ AI is fixing grammar & spelling…"
    : translateLoading
    ? "⏳ Translating your note…"
    : "Write your note here…";

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">

      {/* Form error */}
      {formError && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: "rgba(239,68,68,0.08)",
            border:     "1px solid rgba(239,68,68,0.3)",
            color:      "#ef4444",
          }}
        >
          <AlertCircle size={14} />
          {formError}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="Note title…"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="w-full text-xl font-bold px-5 py-3.5 rounded-2xl focus:outline-none transition-all"
        style={{
          background: "var(--bg-secondary)",
          border:     "1px solid var(--border)",
          color:      "var(--text)",
          fontFamily: "'Lora', Georgia, serif",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
        onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
      />

      {/* Content */}
      <div className="relative flex-1">
        <textarea
          rows={14}
          placeholder={placeholder}
          value={note.content}
          onChange={(e) => {
            if (!isAiWorking) {
              setNote({ ...note, content: e.target.value });
              if (showUndo) onResetUndo(); // user edited manually — hide undo
            }
          }}
          disabled={isAiWorking}
          className="w-full px-5 py-4 text-base leading-relaxed rounded-2xl resize-none focus:outline-none transition-all min-h-[320px] disabled:opacity-70"
          style={{
            background: "var(--bg-secondary)",
            border:     `1px solid ${isAiWorking ? "#6366f1" : "var(--border)"}`,
            color:      "var(--text)",
            boxShadow:  isAiWorking ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
          }}
          onFocus={(e) => {
            if (!isAiWorking) e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            if (!isAiWorking) e.target.style.borderColor = "var(--border)";
          }}
        />

        {/* AI working overlay */}
        {isAiWorking && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl"
            style={{ background: "rgba(0,0,0,0.04)" }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader size={28} className="animate-spin" style={{ color: "#6366f1" }} />
              <p
                className="font-mono text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "#6366f1" }}
              >
                {grammarLoading ? "Fixing grammar…" : "Translating…"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Word count */}
      <div className="flex justify-end">
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-35">
          {note.content.trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
};

export default NoteTextArea;