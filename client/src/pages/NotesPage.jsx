

// import { useState, useEffect } from "react";
// import useNotes from "../hooks/useNotes";
// import NoteCard from "../components/notes/NoteCard";
// import NotesToolbar from "../components/notes/NotesToolbar";

// const NotesPage = () => {
//   const { notes, deleteNote, togglePin } = useNotes();

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [sort, setSort] = useState("newest");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [search]);

//   const filteredNotes = notes
//     .filter((note) => {
//       const term = debouncedSearch.toLowerCase();
//       return (
//         note.title.toLowerCase().includes(term) ||
//         note.content.toLowerCase().includes(term)
//       );
//     })
//     .sort((a, b) => {
//       if (sort === "newest")
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       if (sort === "oldest")
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       if (sort === "az") return a.title.localeCompare(b.title);
//       return 0;
//     });

//   return (
//     <div className="min-h-screen px-4 py-10">
//       <div className="max-w-7xl mx-auto">

//         <NotesToolbar
//           search={search}
//           setSearch={setSearch}
//           sort={sort}
//           setSort={setSort}
//         />

//         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
//           {filteredNotes.map((note) => (
//             <NoteCard
//               key={note._id}
//               note={note}
//               onDelete={deleteNote}
//               onPin={togglePin}
//               onEdit={() => {}}
//               search={search}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default NotesPage;



import { useState, useEffect } from "react";
import useNotes from "../hooks/useNotes";
import NoteCard from "../components/notes/NoteCard";
import NotesToolbar from "../components/notes/NotesToolbar";
import NoteModal from "../components/notes/Note_Modal";

const NotesPage = () => {
  const { notes, updateNote, deleteNote, togglePin } = useNotes();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // ✅ modal states
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    title: "",
    content: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ HANDLE SAVE
  const handleSave = async () => {
    await updateNote(currentNote._id, currentNote);

    setShowModal(false);
    setIsEditing(false);
    setCurrentNote({ title: "", content: "" });
  };

  // 🔥 filter + sort
  const filteredNotes = notes
    .filter((note) => {
      const term = debouncedSearch.toLowerCase();
      return (
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "az") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">

        {/* 🔍 Toolbar */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* 📒 Notes */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={deleteNote}
              onPin={togglePin}
              search={search}

              // 🔥 FIXED EDIT
              onEdit={(note) => {
                setCurrentNote(note);
                setIsEditing(true);
                setShowModal(true);
              }}
            />
          ))}
        </div>

        {/* 🧾 MODAL */}
        <NoteModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          note={currentNote}
          setNote={setCurrentNote}
          isEditing={isEditing}
        />

      </div>
    </div>
  );
};

export default NotesPage;