// import { Link } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import { useState } from "react";
// import Button from "../ui/Button";
// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const [dark, setDark] = useState(true);

//   const toggleTheme = () => {
//     document.documentElement.classList.toggle("dark");
//     setDark(!dark);
//   };

//   return (
//     <nav className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
//       <Link to="/" className="text-2xl font-bold text-indigo-600">
//         NoteHarbor
//       </Link>

//       <div className="flex items-center gap-6">
//         <Button variant="theme" onClick={toggleTheme}>
//           {dark ? "Light" : "Dark"}
//         </Button>

//         {!user ? (
//           <>
//             <Link to="/login">Login</Link>
//             <Link
//               to="/register"
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
//             >
//               Sign Up
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard">Dashboard</Link>
//             <Button onClick={logout}>Logout</Button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import Button from "../ui/Button";

const Navbar = () => {
  const { user, logout } = useAuth();

  // ✅ Theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // ✅ Apply theme to HTML
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
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
        {/* 🔥 THEME BUTTON */}
        <Button variant="theme" onClick={toggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
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