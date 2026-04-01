

// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import { useState, useEffect } from "react";
// import Button from "../ui/Button";
// import { FaUser } from "react-icons/fa";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "light"
//   );

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <nav
//       className="w-full flex justify-between items-center px-6 py-4"
//       style={{
//         backgroundColor: "var(--bg)",
//         color: "var(--text)",
//       }}
//     >
//       {/* Logo */}
//       <Link to="/" className="text-2xl font-bold text-indigo-600">
//         NoteHarbor
//       </Link>

//       <div className="flex items-center gap-6">

//         {/* Theme */}
//         <Button variant="theme" onClick={toggleTheme}>
//           {theme === "light" ? "Dark Mode" : "Light Mode"}
//         </Button>

//         {!user ? (
//           <>
//             {/* ✅ LOGIN / REGISTER */}
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
//             {/* ✅ ALL NOTES */}
//             <Link
//               to="/notes"
//               className="px-4 py-2 rounded-lg"
//               style={{
//                 border: "1px solid var(--border)",
//               }}
//             >
//               All Notes
//             </Link>

//             {/* ✅ AVATAR → DASHBOARD */}
//             <div
//               onClick={() => navigate("/dashboard")}
//               className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
//               style={{
//                 background: "var(--card)",
//                 border: "1px solid var(--border)",
//               }}
//             >
//               {user?.profileImage ? (
//                 <img
//                   src={user.profileImage}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <FaUser />
//               )}
//             </div>

//             {/* ✅ LOGOUT */}
//             <Button onClick={logout}>Logout</Button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="w-full flex justify-between items-center px-6 py-4"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        NoteHarbor
      </Link>

      <div className="flex items-center gap-6">

        {/* Theme */}
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
            {/* ✅ All Notes */}
            <Link
              to="/notes"
              className="px-4 py-2 rounded-lg"
              style={{
                border: "1px solid var(--border)",
              }}
            >
              All Notes
            </Link>

            {/* 🔥 Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser />
                )}
              </div>

              {/* 🔽 Dropdown */}
              {open && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg z-50"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-500/10"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;