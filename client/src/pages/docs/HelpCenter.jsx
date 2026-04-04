import React, { useState } from "react"; // 1. useState import kiya
import {
  FaBookOpen,
  FaRegLightbulb,
  FaTools,
  FaLifeRing,
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import HelpCenterHeader from "/images/DocImages/help-center-header.png";

const HelpCenter = () => {
  // 2. Search ke liye state banayi
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      icon: FaBookOpen,
      title: "Getting Started",
      description:
        "Learn the basics of creating, editing, and organizing your thoughts in NoteHarbor.",
    },
    {
      icon: FaRegLightbulb,
      title: "AI Features",
      description:
        "Master the Gemini 1.5 Flash integration to summarize long notes instantly.",
    },
    {
      icon: FaTools,
      title: "Account & Sync",
      description:
        "Manage your cloud synchronization, security settings, and profile details.",
    },
    {
      icon: FaLifeRing,
      title: "Troubleshooting",
      description:
        "Facing issues with saving or loading? Find quick fixes for common problems.",
    },
  ];

  // 3. Filter Logic: Jo title ya description se match kare
  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const gmailComposeLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=lalitmehra1255@gmail.com&su=Support%20Query%20-%20NoteHarbor";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 min-h-screen">
      {/* 1. Hero Section with FUNCTIONAL Search */}
      <div className="glass-card flex flex-col md:flex-row items-center gap-10 mb-16 border-none shadow-2xl relative overflow-hidden">
        <div className="flex-1 z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-500 mb-4 tracking-tight">
            How can we help?
          </h1>
          <p className="desc text-lg mb-8 max-w-md">
            Browse our documentation or search for specific topics.
          </p>

          <div className="relative group max-w-sm mx-auto md:mx-0">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:text-indigo-400 transition" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm} // State bind ki
              onChange={(e) => setSearchTerm(e.target.value)} // Change handle kiya
              className="w-full bg-white/10 border border-white/20 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 ring-indigo-500/50 backdrop-blur-sm text-white"
            />
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={HelpCenterHeader}
            alt="Support"
            className="img-style h-[250px] w-auto border-none shadow-indigo-500/20"
          />
        </div>
      </div>

      {/* 2. Filtered Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-24">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, index) => (
            <div
              key={index}
              className="glass-card hover:border-indigo-500/50 transition-all duration-300 group cursor-default"
            >
              <cat.icon className="text-4xl text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="title">{cat.title}</h3>
              <p className="desc leading-relaxed">{cat.description}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 opacity-50 italic">
            No topics found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* 3. Get In Touch Section (Same as before) */}
      <section className="mt-20">
        {/* ... (Contact Section Code) ... */}
        <div className="text-center mb-12">
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-2">
            # Let's Connect
          </p>
          <h2 className="text-4xl font-bold mb-4">
            Get In <span className="text-indigo-500">Touch</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-indigo-500"></span> Contact
              Information
            </h3>

            <a
              href={gmailComposeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-6 border-l-4 border-l-indigo-500 hover:bg-indigo-500/10 transition-all block"
            >
              <div className="bg-indigo-500/10 p-4 rounded-xl text-indigo-400">
                <FaEnvelope size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-50">
                  Email Me Directly
                </p>
                <p className="font-medium">lalitmehra1255@gmail.com</p>
              </div>
            </a>
            {/* ... rest of contact cards ... */}
            <div className="glass-card flex items-center gap-6 border-l-4 border-l-indigo-500">
              <div className="bg-indigo-500/10 p-4 rounded-xl text-indigo-400">
                <FaPhone size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-50">
                  Phone
                </p>
                <p className="font-medium">+91 7819961255</p>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <a
                href="https://github.com/Lalitmehra9720/NoteHarbor"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-3 hover:text-indigo-400 border-none bg-white/5"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/lalit-mehra-8a798228a/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-3 hover:text-indigo-400 border-none bg-white/5"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href={gmailComposeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-3 hover:text-indigo-400 border-none bg-white/5"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          <div className="glass-card bg-indigo-500/5 border-indigo-500/10 shadow-2xl">
            {/* ... Form code stays same ... */}
            <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-indigo-500"></span> Send a Message
            </h3>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Lalit Mehra"
                className="w-full bg-black/20 border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-1 ring-indigo-500/50"
              />
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full bg-black/20 border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-1 ring-indigo-500/50"
              />
              <textarea
                rows="4"
                placeholder="Hello..."
                className="w-full bg-black/20 border border-white/10 p-3 rounded-xl focus:outline-none focus:ring-1 ring-indigo-500/50 resize-none"
              ></textarea>
              <button className="w-full bg-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3">
                Send Message <FaPaperPlane size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
