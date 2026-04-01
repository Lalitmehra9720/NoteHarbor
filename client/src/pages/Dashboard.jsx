

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import useNotes from "../hooks/useNotes";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/Note_Modal";
import NotesToolbar from "../components/notes/NotesToolbar";
import FeedbackModal from "../components/Modals/FeedbackModal";

import { FaUser } from "react-icons/fa";

const Dashboard = () => {
  const { user, setUser, logout } = useAuth();

  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  } = useNotes();

  const [showFeedback, setShowFeedback] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [currentNote, setCurrentNote] = useState({
    title: "",
    content: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // ✅ FIXED debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ SAVE NOTE
  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateNote(currentNote._id, currentNote);
        toast.success("Note updated");
      } else {
        await createNote(currentNote);
        toast.success("Note created");
      }

      setShowModal(false);
      setCurrentNote({ title: "", content: "" });
      setIsEditing(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  // ✅ PROFILE IMAGE UPLOAD (FIXED)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Max 5MB allowed");
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 300;
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.6);

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

          setUser((prev) => ({
            ...prev,
            profileImage: data.profileImage,
          }));

          toast.success("Profile updated 🚀");
        } catch (err) {
          console.error(err);
          toast.error("Upload failed");
        }
      };
    };

    reader.readAsDataURL(file);
  };

  // ✅ FILTER + SORT
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
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

          {/* Profile */}
          <div className="flex items-center gap-4">
            <label className="relative group cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="w-20 h-20 rounded-full overflow-hidden border">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="m-auto mt-6 text-xl opacity-60" />
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition rounded-full">
                Edit
              </div>
            </label>

            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="opacity-70">{user?.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              + Create Note
            </Button>

            <Button onClick={logout}>Logout</Button>
          </div>
        </div>

        {/* 🔍 TOOLBAR */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* 📒 NOTES */}
        {filteredNotes.length === 0 ? (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-semibold">
              No results for "{search}"
            </h2>
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
                onDelete={deleteNote}
                onPin={togglePin}
                search={search}
              />
            ))}
          </div>
        )}

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

      {/* 💬 FEEDBACK */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setShowFeedback(true)}>Feedback</Button>
      </div>

      <FeedbackModal
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};

export default Dashboard;