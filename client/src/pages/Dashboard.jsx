
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/Note_Modal";
import NotesToolbar from "../components/notes/NotesToolbar";
import useAuth from "../hooks/useAuth";
import { FaUser } from "react-icons/fa";
import FeedbackModal from "../components/Modals/FeedbackModal";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, setUser, logout } = useAuth();

  const [showFeedback, setShowFeedback] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    title: "",
    content: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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
        setNotes((prev) =>
          prev.map((note) => (note._id === data._id ? data : note))
        );
      } else {
        const { data } = await axiosInstance.post("/notes", currentNote);
        setNotes((prev) => [data, ...prev]);
      }

      setShowModal(false);
      setCurrentNote({ title: "", content: "" });
      setIsEditing(false);
      toast.success("Saved");
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handlePin = async (id) => {
  try {
    const { data } = await axiosInstance.patch(`/notes/${id}/pin`);

    setNotes((prev) =>
      prev.map((note) => (note._id === id ? data : note))
    );

    //  Smart toast
    if (data.isPinned) {
      toast.success("Note pinned ");
    } else {
      toast.success("Note unpinned");
    }

  } catch {
    toast.error("Pin failed");
  }
};

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
    <div
      className="min-h-screen py-10 px-4 md:px-8"
      style={{
        background: "var(--gradient)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* 🔥 HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
              {user?.profileImage ? (
                <img src={user.profileImage} className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-3xl m-auto mt-4 opacity-60" />
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {user?.name}
              </h1>
              <p className="opacity-70">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowModal(true)}>
              + Create Note
            </Button>

            <Button onClick={logout}>
              Logout
            </Button>
          </div>
        </motion.div>

        {/* 🔥 STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[ 
  { title: "Total Notes", value: notes.length },
  { title: "Showing Results", value: filteredNotes.length },
  { title: "Status", value: "Active", isStatus: true },
].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl backdrop-blur-lg shadow-lg"
              style={{
                background: "var(--glass)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="opacity-60">{item.title}</p>
              <h2
  className={`text-3xl font-bold mt-2 ${
    item.isStatus ? "text-green-500 animate-pulse" : ""
  }`}
>
  {item.value}
</h2>
            </motion.div>
          ))}
        </div>

        {/* 🔥 SEARCH */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* 🔥 NOTES GRID */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl animate-pulse bg-gray-300" />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-semibold">
              No results for "{search}"
            </h2>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10"
          >
            {filteredNotes.map((note) => (
              <motion.div
                key={note._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <NoteCard
                  note={note}
                  onEdit={(note) => {
                    setCurrentNote(note);
                    setIsEditing(true);
                    setShowModal(true);
                  }}
                  onDelete={handleDelete}
                  onPin={handlePin}
                  search={search}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 🔥 MODAL */}
        <NoteModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          note={currentNote}
          setNote={setCurrentNote}
          isEditing={isEditing}
        />
      </div>

      {/* 🔥 FLOAT BUTTON */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button onClick={() => setShowFeedback(true)}>
          Feedback
        </Button>
      </motion.div>

      <FeedbackModal
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};

export default Dashboard;