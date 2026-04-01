import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const createNote = async (note) => {
    const { data } = await axiosInstance.post("/notes", note);
    setNotes((prev) => [data, ...prev]);
    toast.success("Note created");
  };

  const updateNote = async (id, note) => {
    const { data } = await axiosInstance.put(`/notes/${id}`, note);
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? data : n))
    );
    toast.success("Note updated");
    return data;
  };

  const deleteNote = async (id) => {
    await axiosInstance.delete(`/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    toast.success("Deleted");
  };

  const togglePin = async (id) => {
    const { data } = await axiosInstance.patch(`/notes/${id}/pin`);
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? data : n))
    );

    toast.success(data.isPinned ? "Pinned " : "Unpinned");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  };
};

export default useNotes;