import { FiCpu, FiLayout, FiShield, FiZap } from "react-icons/fi";

const features = [
  { title: "AI Intelligence", desc: "Summarize long meetings or lectures in one click using Gemini AI.", icon: <FiCpu /> },
  { title: "Focus Mode", desc: "A distraction-free writing environment with ambient sounds.", icon: <FiZap /> },
  { title: "Secure Cloud", desc: "Your notes are encrypted and accessible across all your devices.", icon: <FiShield /> },
  { title: "Modern UI", desc: "Clean, responsive, and beautiful design built for productivity.", icon: <FiLayout /> },
];

const FeatureGrid = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black mb-4">Powerful Features</h2>
      <p className="opacity-60 max-w-2xl mx-auto">Everything you need to capture ideas and turn them into reality.</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((f, i) => (
        <div key={i} className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-indigo-500 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-2xl mb-6 group-hover:scale-110 transition-transform">
            {f.icon}
          </div>
          <h3 className="text-xl font-bold mb-3">{f.title}</h3>
          <p className="text-sm opacity-60 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
export default FeatureGrid;