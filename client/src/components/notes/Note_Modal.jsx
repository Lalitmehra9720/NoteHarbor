
import { useState } from "react";
import Button from "../ui/Button";

const NoteModal = ({
  show,
  onClose,
  onSave,
  note,
  setNote,
  isEditing,
}) => {
  const [error, setError] = useState("");

  if (!show) return null;

  const handleSave = () => {
    if (!note.title.trim() || !note.content.trim()) {
      setError("Both title and content are required!");
      return;
    }
    setError("");
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4 py-8">
      
      {/* 🔥 Expanded Paper-Like Glass Container */}
      <div
        className="
          w-full max-w-4xl 
          max-h-[90vh] 
          flex flex-col
          rounded-3xl
          p-6 md:p-10
          shadow-2xl
          transition-all
          overflow-hidden
        "
        style={{
          background: "var(--glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Note" : "New Note"}
          </h2>
          {error && (
            <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>
          )}
        </div>

        {/* Scrollable Writing Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Title - Bigger and bolder */}
          <input
            type="text"
            placeholder="Title of your note..."
            value={note.title}
            onChange={(e) => {
              setNote({ ...note, title: e.target.value });
              setError("");
            }}
            className="w-full text-2xl font-semibold p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            style={{
              background: "var(--glass-light)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />

          {/* Content - Massive Textarea with Paper feel */}
          <textarea
            rows={15}
            placeholder="Write your note here..."
            value={note.content}
            onChange={(e) => {
              setNote({ ...note, content: e.target.value });
              setError("");
            }}
            className="w-full p-6 text-lg leading-relaxed rounded-xl mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[400px]"
            style={{
              background: "var(--glass-light)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "'Inter', sans-serif", // Clean professional font
            }}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/10">
          <Button variant="theme" onClick={onClose} className="px-6 py-2">
            Discard
          </Button>
          <Button onClick={handleSave} className="px-8 py-2 shadow-lg shadow-indigo-500/20">
            {isEditing ? "Update Note" : "Save Note"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;