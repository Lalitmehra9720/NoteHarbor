

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const ViewNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    try {
      const { data } = await axiosInstance.get(`/notes/${id}`);
      setNote(data);
    } catch {
      toast.error("Failed to load note");
    }
  };

  if (!note) {
    return (
      <div
        className="text-center py-20"
        style={{ color: "var(--text)" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto py-16 px-6"
      style={{ color: "var(--text)" }}
    >
      <div
        className="p-10 rounded-3xl shadow-lg"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h1 className="text-3xl font-bold mb-6">
          {note.title}
        </h1>

        <p
          className="whitespace-pre-wrap leading-relaxed"
          style={{ opacity: 0.8 }}
        >
          {note.content}
        </p>
      </div>
    </div>
  );
};

export default ViewNote;