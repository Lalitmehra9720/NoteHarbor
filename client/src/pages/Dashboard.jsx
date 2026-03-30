
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/noteModal";
import NotesToolbar from "../components/notes/NotesToolbar";
import useAuth from "../hooks/useAuth";
import { FaUser } from "react-icons/fa";
 // ✅ get setUser from context

const Dashboard = () => {
  const { user, setUser} = useAuth();

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

  

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ❌ block huge files
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Please select image less than 5MB");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 300; // 🔥 resize
      const scale = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🔥 compress
      const compressed = canvas.toDataURL("image/jpeg", 0.6);

      // convert base64 → blob
      const res = await fetch(compressed);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, "profile.jpg");

      try {
        const { data } = await axiosInstance.put(
          "/users/profile-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // user.profileImage = data.profileImage;
        setUser((prev) => ({
  ...prev,
  profileImage: data.profileImage,
}));
        toast.success("Profile updated 🚀");
      } catch {
        toast.error("Upload failed");
      }
    };
  };

  reader.readAsDataURL(file);
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
    <div
      className="min-h-screen py-10 px-4 md:px-8"
      style={{
        background: "var(--gradient)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

          {/* <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-semibold shadow-md">
              {getInitials(user?.name)}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {user?.name} Dashboard
              </h1>

              <p style={{ opacity: 0.7 }}>
                {user?.email}
              </p>
            </div>
          </div> */}
          <div className="flex items-center gap-3">
  <div className="relative group">
    <label className="cursor-pointer">
      <input
        type="file"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div
        className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md"
        style={{
          background: "var(--card)",
          border: "2px solid var(--border)",
        }}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUser className="text-2xl opacity-60" />
        )}
      </div>

      {/* Hover */}
      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition">
        Edit
      </div>
    </label>
  </div>

  <div>
    <h1 className="text-3xl md:text-4xl font-bold">
      {user?.name} Dashboard
    </h1>

    <p style={{ opacity: 0.7 }}>
      {user?.email}
    </p>
  </div>
</div>

          <Button
            onClick={() => {
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            + Create Note
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[ 
            { title: "Total Notes", value: notes.length },
            { title: "Showing Results", value: filteredNotes.length },
            { title: "Status", value: "Active" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-sm"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p style={{ opacity: 0.6 }}>{item.title}</p>
              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* Notes */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl animate-pulse"
                style={{ background: "var(--card)" }}
              />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div
            className="p-12 rounded-2xl text-center mt-10"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-2xl font-semibold">
              No Notes Found
            </h2>
            <p style={{ opacity: 0.7 }}>
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

        {/* Modal */}
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