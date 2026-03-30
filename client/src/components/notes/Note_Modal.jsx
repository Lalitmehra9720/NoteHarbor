

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4">

      {/* 🔥 Theme Based Glass */}
      <div
        className="
          w-full max-w-xl
          rounded-2xl
          p-8
          shadow-2xl
          transition
        "
        style={{
          background: "var(--glass)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        {/* Header */}
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Note" : "Create Note"}
        </h2>

        {/* Error */}
        {error && (
          <p className="mb-4 text-red-500 text-sm">{error}</p>
        )}

        {/* Title */}
        <input
          type="text"
          placeholder="Enter note title..."
          value={note.title}
          onChange={(e) => {
            setNote({ ...note, title: e.target.value });
            setError("");
          }}
          className="w-full p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{
            background: "var(--glass-light)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />

        {/* Content */}
        <textarea
          rows={5}
          placeholder="Write your note here..."
          value={note.content}
          onChange={(e) => {
            setNote({ ...note, content: e.target.value });
            setError("");
          }}
          className="w-full p-3 rounded-lg mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{
            background: "var(--glass-light)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="theme" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update Note" : "Save Note"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;