

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeroImage from "../../assets/images/HeroImage.webp";
import useAuth from "../../hooks/useAuth";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      className="min-h-[90vh] flex items-center justify-between px-12 w-full"
      style={{
  background: "var(--gradient)",
  color: "var(--text)",
}}
    >


      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h1
          className="text-5xl font-bold leading-tight"
          style={{ color: "var(--text)" }}
        >
          Organize Your Thoughts.
          <span className="text-indigo-500"> Boost Productivity.</span>
        </h1>

        <p
          className="mt-6"
          style={{ color: "var(--text)", opacity: 0.7 }}
        >
          A secure cloud-based notes app designed to help you capture,
          manage and access your ideas from anywhere.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </button>

          <button
            onClick={handleLogin}
            className="px-6 py-3 rounded-lg transition"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            Login
          </button>
        </div>
      </motion.div>

      {/* Right Mock UI Box */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden md:block w-[500px] h-[300px] rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--card) " }}
      >
        <img src={HeroImage} alt="Hero" />
      </motion.div>
    </section>
  );
};

export default Hero;