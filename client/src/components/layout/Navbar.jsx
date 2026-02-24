import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import Button from "../ui/Button";
const Navbar = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        NoteHarbor
      </Link>

      <div className="flex items-center gap-6">
        <Button variant="theme" onClick={toggleTheme}>
          {dark ? "Light" : "Dark"}
        </Button>

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
            <Button onClick={logout}>Logout</Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
