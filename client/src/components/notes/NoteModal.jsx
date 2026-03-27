// import Button from "../ui/Button";

// const NoteModal = ({
//   show,
//   onClose,
//   onSave,
//   note,
//   setNote,
//   isEditing,
// }) => {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4 dark:text-white">
//           {isEditing ? "Edit Note" : "Create Note"}
//         </h2>

//         <input
//           type="text"
//           placeholder="Title"
//           value={note.title}
//           onChange={(e) =>
//             setNote({ ...note, title: e.target.value })
//           }
//           className="w-full p-3 border rounded-lg mb-3"
//         />

//         <textarea
//           placeholder="Content"
//           value={note.content}
//           onChange={(e) =>
//             setNote({ ...note, content: e.target.value })
//           }
//           className="w-full p-3 border rounded-lg mb-3"
//         />

//         <div className="flex justify-end gap-3">
//           <Button variant="theme" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={onSave}>
//             {isEditing ? "Update" : "Save"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteModal;

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      <div className="
        w-full max-w-lg
        bg-white dark:bg-slate-900
        rounded-3xl
        shadow-2xl
        p-8
        transform transition-all duration-300 scale-100
      ">

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {isEditing ? "Edit Note" : "Create Note"}
        </h2>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter note title..."
          value={note.title}
          onChange={(e) =>
            setNote({ ...note, title: e.target.value })
          }
          className="
            w-full p-4 rounded-xl mb-4
            border border-gray-300
            bg-gray-50 text-gray-800
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-all duration-200
            dark:bg-slate-800 dark:border-slate-700 dark:text-white
          "
        />

        {/* Content Textarea */}
        <textarea
          rows={5}
          placeholder="Write your note here..."
          value={note.content}
          onChange={(e) =>
            setNote({ ...note, content: e.target.value })
          }
          className="
            w-full p-4 rounded-xl mb-6
            border border-gray-300
            bg-gray-50 text-gray-800
            placeholder-gray-400
            resize-none
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-all duration-200
            dark:bg-slate-800 dark:border-slate-700 dark:text-white
          "
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="theme" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Update Note" : "Save Note"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default NoteModal;