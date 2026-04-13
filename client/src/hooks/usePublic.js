// hooks/usePublic.js
import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

const usePublic = () => {
  const [searchResults, setSearchResults]       = useState([]);
  const [leaderboard, setLeaderboard]           = useState([]);
  const [profile, setProfile]                   = useState(null);
  const [searchLoading, setSearchLoading]       = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [profileLoading, setProfileLoading]     = useState(false);
  const [searchError, setSearchError]           = useState("");
  const [leaderboardError, setLeaderboardError] = useState("");
  const [profileError, setProfileError]         = useState("");

  /* ── Search users by name ── */
  const searchUsers = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    try {
      const { data } = await axiosInstance.get(
        `/public/search?q=${encodeURIComponent(query.trim())}`
      );
      setSearchResults(data);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Search failed");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  /* ── Fetch leaderboard ── */
  const fetchLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    setLeaderboardError("");
    try {
      const { data } = await axiosInstance.get("/public/leaderboard");
      setLeaderboard(data);
    } catch (err) {
      setLeaderboardError(err.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  /* ── Fetch single public profile ── */
  const fetchProfile = useCallback(async (userId) => {
    setProfileLoading(true);
    setProfileError("");
    setProfile(null);
    try {
      const { data } = await axiosInstance.get(`/public/profile/${userId}`);
      setProfile(data);
    } catch (err) {
      setProfileError(err.response?.data?.message || "User not found");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  return {
    searchResults, searchLoading, searchError, searchUsers,
    leaderboard, leaderboardLoading, leaderboardError, fetchLeaderboard,
    profile, profileLoading, profileError, fetchProfile,
  };
};

export default usePublic;