import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { FiMessageSquare, FiStar } from "react-icons/fi";

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await axiosInstance.get("/feedback");
        setFeedbacks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="px-6 py-24 bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex justify-center mb-4"
          >
            <span className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
              <FiMessageSquare size={24} />
            </span>
          </motion.div>
          <h2 className="text-4xl font-black mb-4">What Users Say</h2>
          <p className="opacity-50 font-medium">
            Join thousands of people who trust NoteHarbor
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {feedbacks.map((fb) => (
                <motion.div
                  key={fb._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-[2rem] border border-[var(--border)] transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
                  style={{
                    background: "var(--card)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        fill={i < fb.rating ? "#f59e0b" : "none"}
                        className={
                          i < fb.rating ? "text-yellow-500" : "text-gray-600"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-lg leading-relaxed italic opacity-80 mb-8">
                    "{fb.message}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-[var(--border)] pt-6 mt-auto">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-indigo-500/20 shadow-inner">
                      {fb.user?.profileImage ? (
                        <img
                          src={fb.user.profileImage}
                          alt={fb.user?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                          {fb.user?.name ? fb.user.name.toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {fb.user?.name || "Anonymous"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;
