// pages/ExplorePage.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiLoader, FiAward } from "react-icons/fi";
import usePublic from "../hooks/usePublic";
import UserCard from "../components/explore/UserCard";
import BackButton from "../components/ui/BackButton";

const ExplorePage = () => {
  const [query, setQuery] = useState("");
  const debounceRef       = useRef(null);

  const {
    searchResults, searchLoading, searchError, searchUsers,
    leaderboard, leaderboardLoading, leaderboardError, fetchLeaderboard,
  } = usePublic();

  /* Fetch leaderboard on mount */
  useEffect(() => { fetchLeaderboard(); }, []);

  /* Debounced search */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers(query);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const isSearching   = query.trim().length >= 2;
  const showResults   = isSearching && !searchLoading;
  const showLeaderboard = !isSearching;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <BackButton />

        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1
            className="text-4xl font-black tracking-tight mb-2"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Explore
          </h1>
          <p className="opacity-50 text-sm font-medium">
            Discover other writers and see how they're progressing.
          </p>
        </motion.div>

        {/* ── Search bar ── */}
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-8"
          style={{
            background:  "var(--glass)",
            border:      "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          {searchLoading ? (
            <FiLoader size={16} className="animate-spin shrink-0" style={{ color: "#6366f1" }} />
          ) : (
            <FiSearch size={16} className="shrink-0 opacity-40" />
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name…"
            className="flex-1 bg-transparent focus:outline-none font-mono text-sm font-bold tracking-wide"
            style={{ color: "var(--text)" }}
          />

          {query && (
            <button onClick={() => setQuery("")} className="opacity-40 hover:opacity-100 transition-opacity">
              <FiX size={15} />
            </button>
          )}
        </div>

        {/* ── Search results ── */}
        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Loading skeleton */}
              {searchLoading && (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl animate-pulse"
                      style={{ background: "var(--bg-secondary)" }}
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {searchError && (
                <p className="text-center opacity-50 font-mono text-[11px] uppercase tracking-widest py-8">
                  {searchError}
                </p>
              )}

              {/* Results */}
              {showResults && searchResults.length === 0 && !searchError && (
                <p className="text-center opacity-40 font-mono text-[11px] uppercase tracking-widest py-8">
                  No users found for "{query}"
                </p>
              )}

              {showResults && searchResults.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-40 mb-1">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                  </p>
                  {searchResults.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <UserCard user={user} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Leaderboard ── */}
          {showLeaderboard && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Heading */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(251,191,36,0.15)", color: "#f59e0b" }}
                >
                  <FiAward size={16} />
                </div>
                <p className="font-mono text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--text)" }}>
                  Top Writers Leaderboard
                </p>
              </div>

              {/* Loading */}
              {leaderboardLoading && (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl animate-pulse"
                      style={{ background: "var(--bg-secondary)" }}
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {leaderboardError && (
                <p className="text-center opacity-50 font-mono text-[11px] uppercase tracking-widest py-8">
                  {leaderboardError}
                </p>
              )}

              {/* List */}
              {!leaderboardLoading && leaderboard.length === 0 && !leaderboardError && (
                <p className="text-center opacity-40 font-mono text-[11px] uppercase tracking-widest py-8">
                  No data yet — be the first to write!
                </p>
              )}

              <div className="flex flex-col gap-3">
                {leaderboard.map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: user.rank * 0.05 }}
                  >
                    <UserCard user={user} rank={user.rank} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ExplorePage;