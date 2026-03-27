
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/noteModal";
import NotesToolbar from "../components/notes/NotesToolbar";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    title: "",
    content: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await axiosInstance.get("/notes");
      setNotes(data);
    } catch {
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        const { data } = await axiosInstance.put(
          `/notes/${currentNote._id}`,
          currentNote
        );
        setNotes(
          notes.map((note) =>
            note._id === data._id ? data : note
          )
        );
        toast.success("Note updated");
      } else {
        const { data } = await axiosInstance.post(
          "/notes",
          currentNote
        );
        setNotes([data, ...notes]);
        toast.success("Note created");
      }

      setShowModal(false);
      setCurrentNote({ title: "", content: "" });
      setIsEditing(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredNotes = notes
    .filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "az") return a.title.localeCompare(b.title);
      return 0;
    });

  //  Create initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (
      words[0][0].toUpperCase() +
      words[words.length - 1][0].toUpperCase()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

          {/* Left Side */}
          
          <div className="flex items-center gap-3"
          >
            <div className="w-17 h-17 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-semibold shadow-md">
              {getInitials(user?.name)}
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
              {user?.name} Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {user?.email}
            </p>
            </div>
            
          </div>

          {/* Right Side Profile */}
          <div className="flex items-center gap-4">

            <Button
              onClick={() => {
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              + Create Note
            </Button>

            

          </div>
        </div>

        {/* 🔥 Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Notes
            </p>
            <h2 className="text-3xl font-bold mt-2 dark:text-white">
              {notes.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing Results
            </p>
            <h2 className="text-3xl font-bold mt-2 dark:text-white">
              {filteredNotes.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status
            </p>
            <h2 className="text-lg font-semibold mt-2 text-green-500">
              Active 
            </h2>
          </div>
        </div>

        {/* 🔍 Toolbar */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* 🔥 Notes Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-slate-800 h-40 rounded-2xl"
              />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center shadow-sm border border-gray-100 dark:border-slate-700 mt-10">
            <h2 className="text-2xl font-semibold dark:text-white">
              No Notes Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Start by creating your first note.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={(note) => {
                  setCurrentNote(note);
                  setIsEditing(true);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* 🔥 Modal */}
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

export default Dashboard;