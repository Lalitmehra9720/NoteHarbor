import { useState } from "react";
import Button from "../ui/Button";
import { submitFeedback } from "../../services/feedbackService";
import toast from "react-hot-toast";

const FeedbackModal = ({ show, onClose }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  if (!show) return null;

  const handleSubmit = async () => {
    if (!rating || !message.trim()) {
      return toast.error("All fields required");
    }

    try {
      await submitFeedback({ rating, message });
      toast.success("Feedback submitted 🎉");
      onClose();
    } catch {
      toast.error("Failed to submit");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">

      <div
        className="p-8 rounded-2xl w-full max-w-md"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Give Feedback</h2>

        {/* ⭐ Rating */}
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Message */}
        <textarea
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-lg mb-4"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        />

        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;