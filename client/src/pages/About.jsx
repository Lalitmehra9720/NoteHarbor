import { motion, useScroll, useTransform } from "framer-motion";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiTailwindcss } from "react-icons/si";

const About = () => {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 1000], [0, 60]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 30]);

  //  Get theme directly from DOM (same as Navbar)
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  //  Dynamic images
  const images = {
    hero: isDark ? "/images/hero.png" : "/images/hero_light.png",
    login: isDark ? "/images/login.png" : "/images/login_light.png",
    notes: isDark ? "/images/notes.png" : "/images/notes_light.png",
    dashboard: isDark ? "/images/dashboard.png" : "/images/dashboard_light.png",
  };

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ background: "var(--gradient)", color: "var(--text)" }}
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* 🔥 HERO */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              About <span className="text-indigo-400">NoteHarbor</span>
            </h1>
            <p className="opacity-70">
              Capture ideas, organize notes and boost productivity with a modern
              experience.
            </p>
          </motion.div>

          <motion.img
            src={images.hero}
            loading="lazy"
            className="img-style"
            style={{ y: y1 }}
          />
        </div>

        {/* 🔐 LOGIN */}
        <div className="glass-card grid md:grid-cols-2 gap-8 items-center">
          <motion.img
            src={images.login}
            loading="lazy"
            className="img-style"
            style={{ y: y2 }}
          />

          <div>
            <h2 className="title">Secure Authentication</h2>
            <p className="desc">
              JWT-based authentication keeps your notes safe and private.
            </p>
          </div>
        </div>

        {/* 📝 NOTES */}
        <div className="glass-card grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="title">Manage Notes</h2>
            <p className="desc">
              Create, edit, delete and pin notes easily with a smooth UI.
            </p>
          </div>

          <motion.img
            src={images.notes}
            loading="lazy"
            className="img-style"
            style={{ y: y1 }}
          />
        </div>

        {/* 📊 DASHBOARD */}
        <div className="glass-card grid md:grid-cols-2 gap-8 items-center">
          <motion.img
            src={images.dashboard}
            loading="lazy"
            className="img-style"
            style={{ y: y2 }}
          />

          <div>
            <h2 className="title">Smart Dashboard</h2>
            <p className="desc">
              Clean overview with pinned notes, search and structured layout.
            </p>
          </div>
        </div>

        {/* 🚀 TECH STACK */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>

          <div className="flex justify-center gap-10 text-4xl">
            <FaReact className="icon text-blue-500" />
            <FaNodeJs className="icon text-green-500" />
            <SiMongodb className="icon text-green-600" />
            <SiTailwindcss className="icon text-sky-400" />
          </div>
        </div>

        {/* 👨‍💻 DEV */}
        <div className="glass-card text-center">
          <h2 className="text-xl font-bold mb-2">Built by Lalit </h2>
          <p className="opacity-70">
            Full Stack Developer building modern web apps with MERN.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
