


import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import FeedbackModal from "../Modals/feedbackModal"; // ✅ import

const Navbar = () => {
  const { user, logout } = useAuth();

  // ✅ Theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // ✅ Feedback modal state (FIXED POSITION)
  const [showFeedback, setShowFeedback] = useState(false);

  // ✅ Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <nav
        className="flex flex-col md:flex-row justify-between items-center px-6 py-4"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
      >
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          NoteHarbor
        </Link>

        <div className="flex items-center gap-6">
          {/* Theme */}
          <Button variant="theme" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </Button>

          {/* Auth */}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>

              {/* ✅ Feedback button (only when logged in) */}
              <Button onClick={() => setShowFeedback(true)}>
                Feedback
              </Button>

              <Button onClick={logout}>Logout</Button>
            </>
          )}
        </div>
      </nav>

      {/* ✅ Modal OUTSIDE nav (important for layout) */}
      <FeedbackModal
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
};

export default Navbar;