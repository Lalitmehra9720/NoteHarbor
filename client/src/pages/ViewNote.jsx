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
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          {note.title}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {note.content}
        </p>
      </div>
    </div>
  );
};

export default ViewNote;