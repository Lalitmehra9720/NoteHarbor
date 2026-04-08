import { useState, useEffect } from "react";

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const res = await fetch("http://localhost:5000/api/stats"); // Aapka Backend URL
        const res = await fetch("https://note-harbor-2lga.vercel.app/api/stats"); // Aapka Backend URL
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
};