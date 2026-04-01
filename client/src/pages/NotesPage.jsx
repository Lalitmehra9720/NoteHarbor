import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import NoteCard from "../components/notes/NoteCard";
import NotesToolbar from "../components/notes/NotesToolbar";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
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
    const { data } = await axiosInstance.get("/notes");
    setNotes(data);
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
    <div style={{ background: "var(--gradient)", color: "var(--text)" }}>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* 🔍 Search */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {/* 📒 Notes */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} search={search} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default NotesPage;