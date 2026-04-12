
// // import { useState } from "react";
// // import Button from "../ui/Button";

// // const NoteModal = ({
// //   show,
// //   onClose,
// //   onSave,
// //   note,
// //   setNote,
// //   isEditing,
// // }) => {
// //   const [error, setError] = useState("");

// //   if (!show) return null;

// //   const handleSave = () => {
// //     if (!note.title.trim() || !note.content.trim()) {
// //       setError("Both title and content are required!");
// //       return;
// //     }
// //     setError("");
// //     onSave();
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4 py-8">
      
// //       {/* 🔥 Expanded Paper-Like Glass Container */}
// //       <div
// //         className="
// //           w-full max-w-4xl 
// //           max-h-[90vh] 
// //           flex flex-col
// //           rounded-3xl
// //           p-6 md:p-10
// //           shadow-2xl
// //           transition-all
// //           overflow-hidden
// //         "
// //         style={{
// //           background: "var(--glass)",
// //           backdropFilter: "blur(20px)",
// //           WebkitBackdropFilter: "blur(20px)",
// //           border: "1px solid var(--border)",
// //           color: "var(--text)",
// //         }}
// //       >
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-6">
// //           <h2 className="text-3xl font-bold tracking-tight">
// //             {isEditing ? "Edit Note" : "New Note"}
// //           </h2>
// //           {error && (
// //             <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>
// //           )}
// //         </div>

// //         {/* Scrollable Writing Area */}
// //         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
// //           {/* Title - Bigger and bolder */}
// //           <input
// //             type="text"
// //             placeholder="Title of your note..."
// //             value={note.title}
// //             onChange={(e) => {
// //               setNote({ ...note, title: e.target.value });
// //               setError("");
// //             }}
// //             className="w-full text-2xl font-semibold p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
// //             style={{
// //               background: "var(--glass-light)",
// //               border: "1px solid var(--border)",
// //               color: "var(--text)",
// //             }}
// //           />

// //           {/* Content - Massive Textarea with Paper feel */}
// //           <textarea
// //             rows={15}
// //             placeholder="Write your note here..."
// //             value={note.content}
// //             onChange={(e) => {
// //               setNote({ ...note, content: e.target.value });
// //               setError("");
// //             }}
// //             className="w-full p-6 text-lg leading-relaxed rounded-xl mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[400px]"
// //             style={{
// //               background: "var(--glass-light)",
// //               border: "1px solid var(--border)",
// //               color: "var(--text)",
// //               fontFamily: "'Inter', sans-serif", // Clean professional font
// //             }}
// //           />
// //         </div>

// //         {/* Footer Buttons */}
// //         <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/10">
// //           <Button variant="theme" onClick={onClose} className="px-6 py-2">
// //             Discard
// //           </Button>
// //           <Button onClick={handleSave} className="px-8 py-2 shadow-lg shadow-indigo-500/20">
// //             {isEditing ? "Update Note" : "Save Note"}
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NoteModal;



// import { useState } from "react";
// import { AlertCircle, X, Globe, Loader } from "lucide-react";
// import { geminiTranslate, LANGUAGES } from "../../utils/geminiTranslate";
// import toast from "react-hot-toast";
// import Button from "../ui/Button";

// /* ════════════════════════════════════════
//    NoteModal with Translate feature
// ════════════════════════════════════════ */
// const NoteModal = ({ show, onClose, onSave, note, setNote, isEditing }) => {
//   const [formError, setFormError]             = useState("");

//   /* Translate state */
//   const [showTranslate, setShowTranslate]     = useState(false);
//   const [selectedLang, setSelectedLang]       = useState(LANGUAGES[0]);
//   const [translateLoading, setTranslateLoading] = useState(false);

//   /* ── Translate content ── */
//   const handleTranslate = async () => {
//     if (!note.content.trim()) {
//       toast.error("Write some content first!");
//       return;
//     }

//     setTranslateLoading(true);
//     try {
//       const translated = await geminiTranslate(note.content, selectedLang.label);
//       setNote((prev) => ({ ...prev, content: translated }));
//       toast.success(`Translated to ${selectedLang.label}! ✅`);
//       setShowTranslate(false);
//     } catch (err) {
//       toast.error(`Translate Error: ${err.message}`);
//     } finally {
//       setTranslateLoading(false);
//     }
//   };

//   /* ── Save ── */
//   const handleSave = () => {
//     if (!note.title.trim() || !note.content.trim()) {
//       setFormError("Title and content both required!");
//       return;
//     }
//     setFormError("");
//     onSave();
//   };

//   /* ── Close ── */
//   const handleClose = () => {
//     setFormError("");
//     setShowTranslate(false);
//     onClose();
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
//       style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}
//     >
//       <div
//         className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] overflow-hidden shadow-2xl"
//         style={{
//           background:     "var(--glass)",
//           backdropFilter: "blur(20px)",
//           border:         "1px solid var(--border)",
//           color:          "var(--text)",
//         }}
//       >
//         {/* ── Header ── */}
//         <div
//           className="flex items-center justify-between px-8 py-5"
//           style={{ borderBottom: "1px solid var(--border)" }}
//         >
//           <h2
//             className="text-2xl font-black tracking-tight"
//             style={{ fontFamily: "'Lora', Georgia, serif" }}
//           >
//             {isEditing ? "Edit Note" : "New Note"}
//           </h2>

//           <div className="flex items-center gap-3">
//             {/* Translate toggle */}
//             <Button
//               onClick={() => setShowTranslate((p) => !p)}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
//               style={
//                 showTranslate
//                   ? {
//                       background: "var(--accent)",
//                       color:      "#fff",
//                       boxShadow:  "0 4px 14px rgba(99,102,241,0.35)",
//                     }
//                   : {
//                       background: "var(--bg-secondary)",
//                       border:     "1px solid var(--border)",
//                       color:      "var(--text)",
//                     }
//               }
//             >
//               <Globe size={13} />
//               Translate
//             </Button>

//             {/* Close */}
//             <Button
//               onClick={handleClose}
//               className="w-9 h-9 flex items-center justify-center rounded-xl transition-all opacity-50 hover:opacity-100"
//               style={{
//                 background: "var(--bg-secondary)",
//                 border:     "1px solid var(--border)",
//               }}
//             >
//               <X size={15} />
//             </Button>
//           </div>
//         </div>

//         {/* ── Translate panel ── */}
//         {showTranslate && (
//           <div
//             className="mx-6 mt-4 px-5 py-4 rounded-2xl flex flex-col gap-3"
//             style={{
//               background: "var(--bg-secondary)",
//               border:     "1px solid var(--border)",
//             }}
//           >
//             <p
//               className="font-mono text-[10px] font-bold tracking-widest uppercase"
//               style={{ opacity: 0.5 }}
//             >
//               Translate content to:
//             </p>

//             {/* Language grid */}
//             <div className="flex flex-wrap gap-2">
//               {LANGUAGES.map((lang) => (
//                 <Button
//                   key={lang.code}
//                   onClick={() => setSelectedLang(lang)}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
//                   style={
//                     selectedLang.code === lang.code
//                       ? {
//                           background: "var(--accent)",
//                           color:      "#fff",
//                           border:     "1px solid transparent",
//                         }
//                       : {
//                           background: "transparent",
//                           border:     "1px solid var(--border)",
//                           color:      "var(--text)",
//                           opacity:    0.6,
//                         }
//                   }
//                 >
//                   {lang.flag} {lang.label}
//                 </Button>
//               ))}
//             </div>

//             {/* Translate button */}
//             <button
//               onClick={handleTranslate}
//               disabled={translateLoading}
//               className="self-start flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
//               style={{
//                 background: "linear-gradient(135deg, #6366f1, #4f46e5)",
//                 boxShadow:  "0 4px 14px rgba(99,102,241,0.35)",
//               }}
//             >
//               {translateLoading ? (
//                 <>
//                   <Loader size={12} className="animate-spin" />
//                   Translating…
//                 </>
//               ) : (
//                 <>
//                   <Globe size={12} />
//                   Translate to {selectedLang.flag} {selectedLang.label}
//                 </>
//               )}
//             </button>

//             <p
//               className="font-mono text-[9px] tracking-widest uppercase"
//               style={{ opacity: 0.35 }}
//             >
//               ⚠️ This will replace your current content with the translation
//             </p>
//           </div>
//         )}

//         {/* ── Form error ── */}
//         {formError && (
//           <div
//             className="flex items-center gap-2 mx-8 mt-3 px-4 py-2.5 rounded-xl text-sm"
//             style={{
//               background: "rgba(239,68,68,0.08)",
//               border:     "1px solid rgba(239,68,68,0.3)",
//               color:      "#ef4444",
//             }}
//           >
//             <AlertCircle size={14} />
//             {formError}
//           </div>
//         )}

//         {/* ── Fields ── */}
//         <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">

//           {/* Title */}
//           <input
//             type="text"
//             placeholder="Note title…"
//             value={note.title}
//             onChange={(e) => {
//               setNote({ ...note, title: e.target.value });
//               setFormError("");
//             }}
//             className="w-full text-xl font-bold px-5 py-3.5 rounded-2xl focus:outline-none transition-all"
//             style={{
//               background: "var(--bg-secondary)",
//               border:     "1px solid var(--border)",
//               color:      "var(--text)",
//               fontFamily: "'Lora', Georgia, serif",
//             }}
//             onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
//             onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
//           />

//           {/* Content */}
//           <textarea
//             rows={14}
//             placeholder={
//               translateLoading
//                 ? "⏳ Translating your note…"
//                 : "Write your note here…"
//             }
//             value={note.content}
//             onChange={(e) => {
//               setNote({ ...note, content: e.target.value });
//               setFormError("");
//             }}
//             disabled={translateLoading}
//             className="w-full px-5 py-4 text-base leading-relaxed rounded-2xl resize-none focus:outline-none transition-all min-h-[320px] disabled:opacity-60"
//             style={{
//               background: "var(--bg-secondary)",
//               border:     `1px solid ${translateLoading ? "#6366f1" : "var(--border)"}`,
//               color:      "var(--text)",
//               boxShadow:  translateLoading
//                 ? "0 0 0 3px rgba(99,102,241,0.15)"
//                 : "none",
//             }}
//             onFocus={(e) => {
//               if (!translateLoading) e.target.style.borderColor = "#6366f1";
//             }}
//             onBlur={(e) => {
//               if (!translateLoading) e.target.style.borderColor = "var(--border)";
//             }}
//           />

//           {/* Word count */}
//           <div className="flex justify-end">
//             <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-35">
//               {note.content.trim().split(/\s+/).filter(Boolean).length} words
//             </span>
//           </div>
//         </div>

//         {/* ── Footer ── */}
//         <div
//           className="flex justify-end gap-3 px-8 py-5"
//           style={{ borderTop: "1px solid var(--border)" }}
//         >
//           <button
//             onClick={handleClose}
//             className="px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
//             style={{
//               background: "var(--bg-secondary)",
//               border:     "1px solid var(--border)",
//               color:      "var(--text)",
//             }}
//           >
//             Discard
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={translateLoading}
//             className="px-8 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white transition-all disabled:opacity-60"
//             style={{
//               background: "linear-gradient(135deg, #6366f1, #4f46e5)",
//               boxShadow:  "0 6px 20px rgba(99,102,241,0.35)",
//             }}
//           >
//             {isEditing ? "Update Note" : "Save Note"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteModal;

















import { useState } from "react";
import { AlertCircle, X, Globe, Loader, Wand2, RotateCcw } from "lucide-react";
import { geminiTranslate, LANGUAGES } from "../../utils/geminiTranslate";
import toast from "react-hot-toast";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/* ── Gemini call helper ── */
const callGemini = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key missing! Add VITE_GEMINI_API_KEY in .env");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Empty response from Gemini");
  return text.trim();
};

/* ════════════════════════════════════════
   NoteModal
════════════════════════════════════════ */
const NoteModal = ({ show, onClose, onSave, note, setNote, isEditing }) => {
  const [formError, setFormError] = useState("");

  /* ── Translate state ── */
  const [showTranslate, setShowTranslate]       = useState(false);
  const [selectedLang, setSelectedLang]         = useState(LANGUAGES[0]);
  const [translateLoading, setTranslateLoading] = useState(false);

  /* ── Grammar state ── */
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState(""); // for undo
  const [showUndo, setShowUndo]             = useState(false);

  /* ── Active AI panel ── */
  const [activePanel, setActivePanel] = useState(null); // null | "translate"

  /* ── Fix Grammar & Spelling ── */
  const handleFixGrammar = async () => {
    if (!note.content.trim()) {
      toast.error("Write some content first!");
      return;
    }

    setGrammarLoading(true);
    setShowUndo(false);

    const prompt = `Fix all grammar mistakes, spelling errors, and punctuation issues in the following text.
Rules:
- Keep the original meaning 100% intact
- Keep the same language as the input
- Do NOT add new content or change the style
- Do NOT add any explanation or preamble
- Return ONLY the corrected text

Text to fix:
${note.content}`;

    try {
      const fixed = await callGemini(prompt);

      /* Save original for undo */
      setOriginalContent(note.content);
      setNote((prev) => ({ ...prev, content: fixed }));
      setShowUndo(true);
      toast.success("Grammar & spelling fixed! ✅");
    } catch (err) {
      toast.error(`AI Error: ${err.message}`);
    } finally {
      setGrammarLoading(false);
    }
  };

  /* ── Undo grammar fix ── */
  const handleUndo = () => {
    setNote((prev) => ({ ...prev, content: originalContent }));
    setOriginalContent("");
    setShowUndo(false);
    toast.success("Restored original content");
  };

  /* ── Translate ── */
  const handleTranslate = async () => {
    if (!note.content.trim()) {
      toast.error("Write some content first!");
      return;
    }

    setTranslateLoading(true);
    try {
      const translated = await geminiTranslate(note.content, selectedLang.label);
      setOriginalContent(note.content);
      setNote((prev) => ({ ...prev, content: translated }));
      setShowUndo(true);
      toast.success(`Translated to ${selectedLang.label}! ✅`);
      setActivePanel(null);
    } catch (err) {
      toast.error(`Translate Error: ${err.message}`);
    } finally {
      setTranslateLoading(false);
    }
  };

  /* ── Save ── */
  const handleSave = () => {
    if (!note.title.trim() || !note.content.trim()) {
      setFormError("Title and content both required!");
      return;
    }
    setFormError("");
    onSave();
  };

  /* ── Close ── */
  const handleClose = () => {
    setFormError("");
    setActivePanel(null);
    setShowUndo(false);
    setOriginalContent("");
    onClose();
  };

  const isAiWorking = grammarLoading || translateLoading;

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] overflow-hidden shadow-2xl"
        style={{
          background:     "var(--glass)",
          backdropFilter: "blur(20px)",
          border:         "1px solid var(--border)",
          color:          "var(--text)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {isEditing ? "Edit Note" : "New Note"}
          </h2>

          <div className="flex items-center gap-2">

            {/* ── Fix Grammar button ── */}
            <button
              onClick={handleFixGrammar}
              disabled={isAiWorking}
              title="Fix grammar & spelling using AI"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: grammarLoading
                  ? "rgba(99,102,241,0.15)"
                  : "var(--bg-secondary)",
                border: grammarLoading
                  ? "1px solid rgba(99,102,241,0.4)"
                  : "1px solid var(--border)",
                color: grammarLoading ? "#6366f1" : "var(--text)",
              }}
            >
              {grammarLoading ? (
                <>
                  <Loader size={12} className="animate-spin" />
                  Fixing…
                </>
              ) : (
                <>
                  <Wand2 size={12} />
                  Fix Grammar
                </>
              )}
            </button>

            {/* ── Undo button (shown after fix) ── */}
            {showUndo && !isAiWorking && (
              <button
                onClick={handleUndo}
                title="Undo AI changes"
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border:     "1px solid rgba(251,191,36,0.3)",
                  color:      "#f59e0b",
                }}
              >
                <RotateCcw size={12} />
                Undo
              </button>
            )}

            {/* ── Translate button ── */}
            <button
              onClick={() =>
                setActivePanel((p) => (p === "translate" ? null : "translate"))
              }
              disabled={isAiWorking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                activePanel === "translate"
                  ? {
                      background: "var(--accent)",
                      color:      "#fff",
                      boxShadow:  "0 4px 14px rgba(99,102,241,0.35)",
                      border:     "1px solid transparent",
                    }
                  : {
                      background: "var(--bg-secondary)",
                      border:     "1px solid var(--border)",
                      color:      "var(--text)",
                    }
              }
            >
              <Globe size={12} />
              Translate
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all opacity-50 hover:opacity-100"
              style={{
                background: "var(--bg-secondary)",
                border:     "1px solid var(--border)",
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Grammar fixed success banner ── */}
        {showUndo && !grammarLoading && (
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
              onClick={handleUndo}
              className="underline underline-offset-2 ml-1 hover:opacity-70 transition-opacity"
            >
              Undo changes
            </button>
          </div>
        )}

        {/* ── Translate panel ── */}
        {activePanel === "translate" && (
          <div
            className="mx-6 mt-4 px-5 py-4 rounded-2xl flex flex-col gap-3"
            style={{
              background: "var(--bg-secondary)",
              border:     "1px solid var(--border)",
            }}
          >
            <p
              className="font-mono text-[10px] font-bold tracking-widest uppercase"
              style={{ opacity: 0.5 }}
            >
              Translate content to:
            </p>

            {/* Language grid */}
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
                  style={
                    selectedLang.code === lang.code
                      ? {
                          background: "var(--accent)",
                          color:      "#fff",
                          border:     "1px solid transparent",
                        }
                      : {
                          background: "transparent",
                          border:     "1px solid var(--border)",
                          color:      "var(--text)",
                          opacity:    0.6,
                        }
                  }
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>

            {/* Translate button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleTranslate}
                disabled={translateLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  boxShadow:  "0 4px 14px rgba(99,102,241,0.35)",
                }}
              >
                {translateLoading ? (
                  <>
                    <Loader size={12} className="animate-spin" />
                    Translating…
                  </>
                ) : (
                  <>
                    <Globe size={12} />
                    Translate to {selectedLang.flag} {selectedLang.label}
                  </>
                )}
              </button>
              <p
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{ opacity: 0.35 }}
              >
                ⚠️ Replaces current content
              </p>
            </div>
          </div>
        )}

        {/* ── Form error ── */}
        {formError && (
          <div
            className="flex items-center gap-2 mx-8 mt-3 px-4 py-2.5 rounded-xl text-sm"
            style={{
              background: "rgba(239,68,68,0.08)",
              border:     "1px solid rgba(239,68,68,0.3)",
              color:      "#ef4444",
            }}
          >
            <AlertCircle size={14} />
            {formError}
          </div>
        )}

        {/* ── Fields ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">

          {/* Title */}
          <input
            type="text"
            placeholder="Note title…"
            value={note.title}
            onChange={(e) => {
              setNote({ ...note, title: e.target.value });
              setFormError("");
            }}
            className="w-full text-xl font-bold px-5 py-3.5 rounded-2xl focus:outline-none transition-all"
            style={{
              background: "var(--bg-secondary)",
              border:     "1px solid var(--border)",
              color:      "var(--text)",
              fontFamily: "'Lora', Georgia, serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
          />

          {/* Content */}
          <div className="relative flex-1">
            <textarea
              rows={14}
              placeholder={
                grammarLoading
                  ? "⏳ AI is fixing grammar & spelling…"
                  : translateLoading
                  ? "⏳ Translating your note…"
                  : "Write your note here…"
              }
              value={note.content}
              onChange={(e) => {
                if (!isAiWorking) {
                  setNote({ ...note, content: e.target.value });
                  setFormError("");
                  /* Reset undo if user manually edits after fix */
                  if (showUndo) setShowUndo(false);
                }
              }}
              disabled={isAiWorking}
              className="w-full px-5 py-4 text-base leading-relaxed rounded-2xl resize-none focus:outline-none transition-all min-h-[320px] disabled:opacity-70"
              style={{
                background: "var(--bg-secondary)",
                border: `1px solid ${
                  grammarLoading || translateLoading
                    ? "#6366f1"
                    : "var(--border)"
                }`,
                color:     "var(--text)",
                boxShadow: isAiWorking
                  ? "0 0 0 3px rgba(99,102,241,0.15)"
                  : "none",
              }}
              onFocus={(e) => {
                if (!isAiWorking) e.target.style.borderColor = "#6366f1";
              }}
              onBlur={(e) => {
                if (!isAiWorking) e.target.style.borderColor = "var(--border)";
              }}
            />

            {/* AI working overlay */}
            {isAiWorking && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl"
                style={{ background: "rgba(0,0,0,0.04)" }}
              >
                <div className="flex flex-col items-center gap-3">
                  <Loader
                    size={28}
                    className="animate-spin"
                    style={{ color: "#6366f1" }}
                  />
                  <p
                    className="font-mono text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "#6366f1" }}
                  >
                    {grammarLoading ? "Fixing grammar…" : "Translating…"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Word count */}
          <div className="flex justify-end">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-35">
              {note.content.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex justify-end gap-3 px-8 py-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase transition-all"
            style={{
              background: "var(--bg-secondary)",
              border:     "1px solid var(--border)",
              color:      "var(--text)",
            }}
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isAiWorking}
            className="px-8 py-2.5 rounded-xl font-mono text-[10px] font-bold tracking-widest uppercase text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow:  "0 6px 20px rgba(99,102,241,0.35)",
            }}
          >
            {isEditing ? "Update Note" : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;