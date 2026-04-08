
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { FiFileText, FiSearch, FiLoader, FiArrowRight, FiPlusCircle } from "react-icons/fi";

const Dashboard = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const { notes, loading, createNote, updateNote, deleteNote, togglePin } = useNotes();

  const [showFeedback, setShowFeedback]   = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [currentNote, setCurrentNote]     = useState({ title: "", content: "" });
  const [isEditing, setIsEditing]         = useState(false);
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort]                   = useState("newest");

  /* ── Debounce ── */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Save note ── */
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

  /* ── Profile image upload ── */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB allowed");

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx    = canvas.getContext("2d");
        const MAX_WIDTH = 300;
        const scale  = MAX_WIDTH / img.width;
        canvas.width  = MAX_WIDTH;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.6);
        const res  = await fetch(compressed);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append("image", blob, "profile.jpg");
        try {
          const { data } = await axiosInstance.put("/users/profile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setUser((prev) => ({ ...prev, profileImage: data.profileImage }));
          toast.success("Profile updated");
        } catch (err) {
          console.error(err);
          toast.error("Upload failed");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  /* ── Filter + sort ── */
  const filteredNotes = notes
    .filter((note) => {
      const term = debouncedSearch.toLowerCase();
      return (
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "az")     return a.title.localeCompare(b.title);
      return 0;
    });

  /* ── Only first 6 notes on dashboard ── */
  const recentNotes  = filteredNotes.slice(0, 6);
  const hasMore      = filteredNotes.length > 6;
  const totalNotes   = notes.length;
  const searchCount  = filteredNotes.length;
  const isSearching  = debouncedSearch.trim().length > 0;

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

          {/* Profile */}
          <div className="flex items-center gap-4">
            <label className="relative group cursor-pointer">
              <input type="file" className="hidden" onChange={handleImageUpload} />
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
                style={{ border: "2px solid var(--border)", background: "var(--bg-secondary)" }}
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <FaUser className="text-2xl opacity-40" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition rounded-full">
                Edit
              </div>
            </label>

            <div>
              <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                {user?.name}
              </h1>
              <p className="text-sm opacity-60 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => {
                setIsEditing(false);
                setCurrentNote({ title: "", content: "" });
                setShowModal(true);
              }}
            >
              + Create Note
            </Button>
            <Button onClick={logout} >Logout</Button>
          </div>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Total notes */}
          <div
            className="flex items-center gap-4 px-6 py-5 rounded-2xl"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1" }}
            >
              <FiFileText size={20} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-50">
                Total Notes
              </p>
              <p className="text-3xl font-black mt-0.5">{totalNotes}</p>
            </div>
          </div>

          {/* Search results */}
          <div
            className="flex items-center gap-4 px-6 py-5 rounded-2xl"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isSearching ? "rgba(99,102,241,0.12)" : "var(--bg-secondary)",
                color: isSearching ? "#6366f1" : "var(--text)",
              }}
            >
              <FiSearch size={20} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-50">
                {isSearching ? "Search Results" : "Showing"}
              </p>
              <p className="text-3xl font-black mt-0.5">
                {isSearching ? searchCount : Math.min(totalNotes, 6)}
                {!isSearching && totalNotes > 0 && (
                  <span className="text-base font-normal opacity-40 ml-1">/ {totalNotes}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* ── NOTES SECTION ── */}
        {loading ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FiLoader
              size={32}
              className="animate-spin"
              style={{ color: "#6366f1" }}
            />
            <p
              className="font-mono text-[11px] font-bold tracking-widest uppercase opacity-40"
            >
              Loading your notes…
            </p>
          </div>

        ) : recentNotes.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-24 gap-6 rounded-3xl mt-10"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              <FiFileText size={36} style={{ color: "#6366f1", opacity: 0.6 }} />
            </div>

            {isSearching ? (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-black" style={{ fontFamily: "'Lora', serif" }}>
                    No results found
                  </h2>
                  <p className="opacity-50 text-sm mt-2">
                    No notes match "<span className="font-semibold">{debouncedSearch}</span>"
                  </p>
                </div>
                <button
                  onClick={() => setSearch("")}
                  className="font-mono text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-black" style={{ fontFamily: "'Lora', serif" }}>
                    Your harbour is empty
                  </h2>
                  <p className="opacity-50 text-sm mt-2">
                    Create your first note and start organising your thoughts
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentNote({ title: "", content: "" });
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase px-6 py-3 rounded-xl text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                  }}
                >
                  <FiPlusCircle size={14} />
                  Create First Note
                </button>
              </>
            )}
          </div>

        ) : (
          /* Notes grid */
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
              {recentNotes.map((note) => (
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

            {/* ── See All Notes button ── */}
            {(hasMore || totalNotes > 0) && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => navigate("/notes")}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all"
                  style={{
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.color = "#6366f1";
                    e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.background = "var(--glass)";
                  }}
                >
                  <span>
                    {isSearching
                      ? `See all ${searchCount} matching notes`
                      : `See all ${totalNotes} notes`}
                  </span>
                  <FiArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── MODAL ── */}
        <NoteModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          note={currentNote}
          setNote={setCurrentNote}
          isEditing={isEditing}
        />
      </div>

      {/* ── FEEDBACK ── */}
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