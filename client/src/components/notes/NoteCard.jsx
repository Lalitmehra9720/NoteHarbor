import { useNavigate } from "react-router-dom";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/note/${note._id}`)}
      className="
        p-6 rounded-2xl shadow-md 
        hover:shadow-2xl hover:scale-105 
        transition-all duration-300 
        relative cursor-pointer
      "
      style={{
        background: "var(--card)",
        color: "var(--text)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Stop propagation for buttons */}
      <div
        className="absolute top-3 right-3 flex gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(note)}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(note._id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
        >
          Delete
        </button>
      </div>

      <h2 className="font-semibold text-lg mb-2">
        {note.title}
      </h2>

      <p
        className="line-clamp-3 break-words min-h-[72px]"
        style={{ opacity: 0.7 }}
      >
        {note.content}
      </p>
    </div>
  );
};

export default NoteCard;