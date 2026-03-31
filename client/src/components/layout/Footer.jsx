import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text)",
      }}
      className="transition"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-600">NoteHarbor</h2>
          <p className="mt-4 text-sm" style={{ opacity: 0.8 }}>
            Organize your thoughts and boost productivity with a secure
            cloud-based notes app.
          </p>

          <div className="flex gap-4 mt-4 text-xl">
            <a href="#" className="hover:text-indigo-600 transition">
              <FaGithub />
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Product Section */}
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/">Features</Link></li>
            <li><Link to="/">Pricing</Link></li>
            <li><Link to="/">Updates</Link></li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Blog</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/">Help Center</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div
        className="py-6 text-center text-sm"
        style={{
          borderTop: "1px solid var(--border)",
        }}
      >
        © {new Date().getFullYear()} NoteHarbor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;