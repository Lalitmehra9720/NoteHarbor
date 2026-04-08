import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useNotes from "../hooks/useNotes";
import NoteCard from "../components/notes/NoteCard";
import NotesToolbar from "../components/notes/NotesToolbar";
import NoteModal from "../components/notes/Note_Modal";
import BackButton from "../components/ui/BackButton";
import { FiChevronDown, FiFileText, FiLoader } from "react-icons/fi";

const PAGE_SIZE = 9;

const NotesPage = () => {
  const { notes, loading, updateNote, deleteNote, togglePin } = useNotes();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* modal states */
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);

  /* debounce */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* reset pagination on search/sort change */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, sort]);

  const handleSave = async () => {
    await updateNote(currentNote._id, currentNote);
    setShowModal(false);
    setIsEditing(false);
    setCurrentNote({ title: "", content: "" });
  };

  /* filter + sort */
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

  const visibleNotes = filteredNotes.slice(0, visibleCount);
  const hasMore = filteredNotes.length > visibleCount;
  const remaining = filteredNotes.length - visibleCount;
  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <BackButton />

        {/* Toolbar */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* ── Count badge ── */}
        {!loading && filteredNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-6"
          >
            <span
              className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#6366f1",
              }}
            >
              {isSearching
                ? `${filteredNotes.length} result${filteredNotes.length !== 1 ? "s" : ""} for "${debouncedSearch}"`
                : `${filteredNotes.length} note${filteredNotes.length !== 1 ? "s" : ""}`}
            </span>
            {visibleCount < filteredNotes.length && (
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-35">
                — showing {visibleCount}
              </span>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════
            LOADING SPINNER
        ══════════════════════════════ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            >
              <FiLoader size={32} style={{ color: "#6366f1" }} />
            </motion.div>
            <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-35">
              Loading your notes…
            </p>
          </div>
        )}

        {/* ══════════════════════════════
            EMPTY STATE
        ══════════════════════════════ */}
        {!loading && filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-5 rounded-3xl mt-10"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.1)" }}
            >
              <FiFileText
                size={28}
                style={{ color: "#6366f1", opacity: 0.7 }}
              />
            </div>
            <div className="text-center">
              <h2
                className="text-xl font-black"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                {isSearching ? "No results found" : "No notes here"}
              </h2>
              <p className="opacity-50 text-sm mt-1.5">
                {isSearching
                  ? `Nothing matches "${debouncedSearch}"`
                  : "Head to Dashboard to create your first note"}
              </p>
            </div>
            {isSearching && (
              <button
                onClick={() => setSearch("")}
                className="font-mono text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════
            NOTES GRID
        ══════════════════════════════ */}
        {!loading && visibleNotes.length > 0 && (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <AnimatePresence mode="popLayout">
              {visibleNotes.map((note) => (
                <motion.div
                  key={note._id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.97 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  layout
                >
                  <NoteCard
                    note={note}
                    onDelete={deleteNote}
                    onPin={togglePin}
                    search={search}
                    onEdit={(note) => {
                      setCurrentNote(note);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── See More button ── */}
        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-300"
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
                Show {Math.min(PAGE_SIZE, remaining)} more
                <span className="opacity-40 ml-1.5">
                  ({remaining} remaining)
                </span>
              </span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
              >
                <FiChevronDown size={15} />
              </motion.div>
            </button>
          </motion.div>
        )}

        {/* ── All loaded message ── */}
        {!loading && !hasMore && filteredNotes.length > PAGE_SIZE && (
          <p className="text-center mt-10 font-mono text-[10px] font-bold tracking-widest uppercase opacity-25">
            All {filteredNotes.length} notes loaded ✓
          </p>
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

export default NotesPage;
