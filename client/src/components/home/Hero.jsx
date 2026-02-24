import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroImage from "../../assets/images/HeroImage.webp";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-between px-12 bg-gradient-to-br from-[#0f172a] to-[rgb(30,41,59)] text-white w-full">

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <h1 className=" text-5xl font-bold leading-tight">
          Organize Your Thoughts.
          <span className="text-indigo-500"> Boost Productivity.</span>
        </h1>

        <p className="mt-6 text-gray-300">
          A secure cloud-based notes app designed to help you capture,
          manage and access your ideas from anywhere.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 border border-gray-500 rounded-lg hover:bg-gray-700 transition"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Right Mock UI Box */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden md:block w-[500px] h-[300px] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <img src={HeroImage} alt="" />
        </motion.div>
    </section>
  );
};

export default Hero;