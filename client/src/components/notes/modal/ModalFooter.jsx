// components/notes/modal/ModalFooter.jsx

const ModalFooter = ({ isEditing, isAiWorking, onClose, onSave }) => {
  return (
    <div
      className="flex justify-end gap-3 px-8 py-5"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {/* Discard */}
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
        style={{
          background: "var(--bg-secondary)",
          border:     "1px solid var(--border)",
          color:      "var(--text)",
        }}
      >
        Discard
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isAiWorking}
        className="px-8 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          boxShadow:  "0 6px 20px rgba(99,102,241,0.35)",
        }}
      >
        {isEditing ? "Update Note" : "Save Note"}
      </button>
    </div>
  );
};

export default ModalFooter;