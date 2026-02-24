import Button from "../ui/Button";

const NoteModal = ({
  show,
  onClose,
  onSave,
  note,
  setNote,
  isEditing,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {isEditing ? "Edit Note" : "Create Note"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={(e) =>
            setNote({ ...note, title: e.target.value })
          }
          className="w-full p-3 border rounded-lg mb-3"
        />

        <textarea
          placeholder="Content"
          value={note.content}
          onChange={(e) =>
            setNote({ ...note, content: e.target.value })
          }
          className="w-full p-3 border rounded-lg mb-3"
        />

        <div className="flex justify-end gap-3">
          <Button variant="theme" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;