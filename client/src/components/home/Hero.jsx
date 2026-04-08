

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import useAuth from "../../hooks/useAuth";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = (path) => navigate(user ? "/dashboard" : path);

  return (
    <section 
      className="min-h-[90vh] flex items-center justify-center w-full overflow-hidden relative transition-colors duration-500"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* ── Dynamic Background Blobs (Synced with accent colors) ── */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-72 h-72 bg-[var(--accent)] rounded-full blur-[120px] animate-pulse opacity-40" />
        <div className="absolute bottom-20 right-[5%] w-80 h-80 bg-purple-500 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-12 w-full gap-8 md:gap-12">
        
        {/* ── Left Content (Text & Buttons) ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left z-10 order-2 md:order-1"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[var(--border)] bg-[var(--glass-light)] text-[var(--accent-text)] text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
             Your Digital Sanctuary for Thoughts
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[var(--text)]">
            Capture Ideas. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-300">
               Anchor Success.
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg opacity-70 leading-relaxed max-w-lg mx-auto md:mx-0 text-[var(--text)] font-medium">
            NoteHarbor is a secure, AI-powered workspace designed for modern thinkers. 
            Organize, summarize, and access your ideas from anywhere.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction("/register")}
              className="vn-focus-btn group flex items-center gap-2 px-8 py-4 text-white rounded-2xl font-bold shadow-lg"
            >
              Get Started <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: "var(--bg-secondary)" }}
              onClick={() => handleAction("/login")}
              className="px-8 py-4 rounded-2xl border border-[var(--border)] font-bold transition-all text-[var(--text)] bg-[var(--glass-light)] backdrop-blur-sm"
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>

        {/* ── Right Content (Lottie Animation) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 flex justify-center items-center w-full order-1 md:order-2"
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-[500px] aspect-square">
            <DotLottiePlayer
              src="https://lottie.host/a2ad105b-bef3-4260-90a2-271a74fa5480/FYq7xNC27r.lottie"
              background="transparent"
              speed={1}
              style={{ width: '100%', height: '100%' }}
              loop
              autoplay
            />
            {/* Soft Glow syncing with your --accent-glow */}
            <div className="absolute inset-0 bg-[var(--accent-glow)] blur-[100px] -z-10 rounded-full scale-75 opacity-40" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;