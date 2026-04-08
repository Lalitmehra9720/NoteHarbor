// import { motion } from "framer-motion";

// const StatsSection = () => {
//   const stats = [
//     { label: "Active Users", value: "10K+" },
//     { label: "Notes Created", value: "500K+" },
//     { label: "AI Summaries", value: "50K+" },
//     { label: "Uptime", value: "99.9%" },
//   ];

//   return (
//     <div className="py-12 border-y border-[var(--border)] bg-[var(--glass-light)] backdrop-blur-md">
//       <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//         {stats.map((stat, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <h3 className="text-3xl font-black text-indigo-500">{stat.value}</h3>
//             <p className="text-sm font-medium opacity-60 uppercase tracking-widest">{stat.label}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default StatsSection;


// import { motion } from "framer-motion";
// import { useStats } from "../../hooks/useStats"; // Hook import kiya

// const StatsSection = () => {
//   const { statsData, loading } = useStats(); // Data hook se liya

//   // Dynamic Array mapping
//   const statsDisplay = [
//     { label: "Active Users", value: statsData ? `${statsData.userCount}+` : "100+" },
//     { label: "Notes Created", value: statsData ? `${statsData.noteCount}+` : "500+" },
//     { label: "AI Summaries", value: statsData ? `${statsData.aiCount}+` : "50+" },
//     { label: "Success Rate", value: "99.9%" },
//   ];

//   return (
//     <div className="py-12 border-y border-[var(--border)] bg-[var(--glass-light)] backdrop-blur-md">
//       <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//         {statsDisplay.map((stat, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <h3 className="text-3xl font-black text-indigo-500">
//               {loading ? "..." : stat.value}
//             </h3>
//             <p className="text-sm font-medium opacity-60 uppercase tracking-widest text-[var(--text)]">
//               {stat.label}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StatsSection;

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { FiUsers, FiFileText, FiMessageSquare, FiStar } from "react-icons/fi";

/* ── Animated counter ── */
const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, start]);

  return count;
};

/* ── Stat card ── */
const StatCard = ({ icon, label, value, suffix = "+", color, delay, animate }) => {
  const count = useCounter(value, 1800, animate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>
      <h3
        className="text-3xl md:text-4xl font-black tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {count.toLocaleString()}
        <span style={{ color }}>{suffix}</span>
      </h3>
      <p className="text-[10px] font-bold tracking-widest uppercase opacity-50">
        {label}
      </p>
    </motion.div>
  );
};

/* ════════════════════════════
   StatsSection
════════════════════════════ */
const StatsSection = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const sectionRef            = useRef(null);

  /* ── Fetch real stats ── */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/stats"); // hits /api/stats
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
        // Graceful fallback — zeros dikhenge, crash nahi hoga
        setStats({ userCount: 0, noteCount: 0, feedbackCount: 0, averageRating: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  /* ── Start counter when section is visible ── */
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const STATS = stats
    ? [
        {
          icon: <FiUsers size={22} />,
          label: "Active Users",
          value: stats.userCount,
          suffix: "+",
          color: "#6366f1",
          delay: 0,
        },
        {
          icon: <FiFileText size={22} />,
          label: "Notes Created",
          value: stats.noteCount,
          suffix: "+",
          color: "#8b5cf6",
          delay: 0.1,
        },
        {
          icon: <FiMessageSquare size={22} />,
          label: "User Feedbacks",
          value: stats.feedbackCount,
          suffix: "+",
          color: "#06b6d4",
          delay: 0.2,
        },
        {
          icon: <FiStar size={22} />,
          label: "Average Rating",
          value: stats.averageRating,
          suffix: " / 5",
          color: "#f59e0b",
          delay: 0.3,
        },
      ]
    : [];

  return (
    <div
      ref={sectionRef}
      className="py-14 border-y backdrop-blur-md"
      style={{
        borderColor: "var(--border)",
        background: "var(--glass-light)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Loading */}
        {loading &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-current opacity-10" />
              <div className="h-8 w-20 rounded-lg bg-current opacity-10" />
              <div className="h-3 w-24 rounded-full bg-current opacity-10" />
            </div>
          ))}

        {/* Real stats */}
        {!loading &&
          STATS.map((s) => (
            <StatCard key={s.label} {...s} animate={animate} />
          ))}
      </div>
    </div>
  );
};

export default StatsSection;