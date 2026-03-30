


import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await axiosInstance.get("/feedback");
      setFeedbacks(data);
    } catch (err) {
      console.error("Feedback fetch error:", err);
      setError("Could not load feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Users Say 💬
      </h2>

      {loading && (
        <p className="text-center opacity-60">Loading feedbacks...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && feedbacks.length === 0 && (
        <p className="text-center opacity-60">No feedbacks yet. Be the first! 🌟</p>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            className="p-6 rounded-2xl shadow"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="text-yellow-400 mb-2">
              {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
            </div>

            <p style={{ opacity: 0.8 }}>{fb.message}</p>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {fb.user?.profileImage ? (
                  <img
                    src={fb.user.profileImage}
                    alt={fb.user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-sm font-bold">
                    {fb.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <p className="text-sm opacity-70">{fb.user?.name || "Anonymous"}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeedbackSection;

