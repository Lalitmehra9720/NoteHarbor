
// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import { useState, useEffect, useRef } from "react";
// import Button from "../ui/Button";
// import { FaUser } from "react-icons/fa";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "light"
//   );

//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef();

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   // 🔥 Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

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
//             {/* ✅ All Notes */}
//             <Link
//               to="/notes"
//               className="px-4 py-2 rounded-lg"
//               style={{
//                 border: "1px solid var(--border)",
//               }}
//             >
//               All Notes
//             </Link>

//             {/* 🔥 Avatar Dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <div
//                 onClick={() => setOpen((prev) => !prev)}
//                 className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
//                 style={{
//                   background: "var(--card)",
//                   border: "1px solid var(--border)",
//                 }}
//               >
//                 {user?.profileImage ? (
//                   <img
//                     src={user.profileImage}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <FaUser />
//                 )}
//               </div>

//               {/* 🔽 Dropdown */}
//               {open && (
//                 <div
//                   className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg z-50"
//                   style={{
//                     background: "var(--card)",
//                     border: "1px solid var(--border)",
//                   }}
//                 >
//                   <button
//                     onClick={() => {
//                       navigate("/dashboard");
//                       setOpen(false);
//                     }}
//                     className="w-full text-left px-4 py-2 hover:bg-indigo-500/10"
//                   >
//                     Dashboard
//                   </button>

//                   <button
//                     onClick={() => {
//                       logout();
//                       setOpen(false);
//                     }}
//                     className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { FaUser } from "react-icons/fa";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";

/* ── Nav links shown to everyone ── */
const NAV_LINKS = [
  { label: "About",       to: "/about" },
  { label: "Help Center", to: "/help" },
  { label: "Privacy",     to: "/privacy" },
  { label: "Terms",       to: "/terms" },
  { label: "Explore", to: "/explore" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [theme, setTheme]     = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);   // mobile menu
  const [dropOpen, setDropOpen] = useState(false);   // avatar dropdown

  const dropRef   = useRef();
  const menuRef   = useRef();

  /* ── Theme ── */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Close mobile menu on route change ── */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="w-full sticky top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--glass)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link
          to="/"
          className="text-xl font-black text-indigo-600 tracking-tight shrink-0"
          style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
          NoteHarbor
        </Link>

        {/* ── Desktop Nav Links (center) ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase transition-all"
              style={{
                color: isActive(link.to) ? "#6366f1" : "var(--text)",
                background: isActive(link.to) ? "rgba(99,102,241,0.1)" : "transparent",
                opacity: isActive(link.to) ? 1 : 0.55,
              }}
              onMouseEnter={(e) => { if (!isActive(link.to)) e.currentTarget.style.opacity = 1; }}
              onMouseLeave={(e) => { if (!isActive(link.to)) e.currentTarget.style.opacity = 0.55; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right Side ── */}
        <div className="flex items-center gap-3">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? <FiMoon size={15} /> : <FiSun size={15} />}
          </button>

          {!user ? (
            /* ── Guest buttons ── */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            /* ── Logged-in: All Notes + Avatar ── */
            <>
              <Link
                to="/notes"
                className="hidden sm:flex px-4 py-2 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all"
                style={{
                  background: isActive("/notes") ? "rgba(99,102,241,0.1)" : "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: isActive("/notes") ? "#6366f1" : "var(--text)",
                }}
              >
                All Notes
              </Link>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((p) => !p)}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <FaUser size={14} />
                  )}
                </button>

                {dropOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    style={{
                      background: "var(--glass)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* User info */}
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-40">
                        Signed in as
                      </p>
                      <p className="font-semibold text-sm mt-0.5 truncate">
                        {user?.name || user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => { navigate("/dashboard"); setDropOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-mono font-bold tracking-wide transition-colors"
                      style={{ color: "var(--text)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => { navigate("/notes"); setDropOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-mono font-bold tracking-wide transition-colors"
                      style={{ color: "var(--text)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      All Notes
                    </button>

                    <div style={{ borderTop: "1px solid var(--border)" }}>
                      <button
                        onClick={() => { logout(); setDropOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-mono font-bold tracking-wide text-red-500 transition-colors"
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {menuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE MENU
      ══════════════════════════════════════ */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden px-6 pb-6 flex flex-col gap-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-3 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all"
              style={{
                color: isActive(link.to) ? "#6366f1" : "var(--text)",
                background: isActive(link.to) ? "rgba(99,102,241,0.1)" : "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-3 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase text-center transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-3 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase text-center text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/notes"
                className="px-4 py-3 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase text-center transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                All Notes
              </Link>
              <button
                onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                className="px-4 py-3 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase text-center transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="px-4 py-3 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase text-center text-red-500"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;