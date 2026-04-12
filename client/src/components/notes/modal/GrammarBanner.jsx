// components/notes/modal/GrammarBanner.jsx
import { Wand2 } from "lucide-react";

const GrammarBanner = ({ show, onUndo }) => {
  if (!show) return null;

  return (
    <div
      className="flex items-center gap-2 mx-6 mt-4 px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase"
      style={{
        background: "rgba(34,197,94,0.08)",
        border:     "1px solid rgba(34,197,94,0.3)",
        color:      "#16a34a",
      }}
    >
      <Wand2 size={12} />
      Grammar & spelling fixed by AI —
      <button
        onClick={onUndo}
        className="underline underline-offset-2 ml-1 hover:opacity-70 transition-opacity"
      >
        Undo changes
      </button>
    </div>
  );
};

export default GrammarBanner;