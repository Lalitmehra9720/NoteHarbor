const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-xl transition relative group">
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onEdit(note)}
          className="text-blue-500 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className="text-red-500 text-sm"
        >
          Delete
        </button>
      </div>

      <h2 className="font-semibold text-lg dark:text-white">
        {note.title}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
        {note.content}
      </p>
    </div>
  );
};

export default NoteCard;