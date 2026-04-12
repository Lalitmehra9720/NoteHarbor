
import { useState } from "react";
import toast from "react-hot-toast";

import { geminiFixGrammar, geminiTranslate, LANGUAGES } from "../../utils/geminiTranslate";

import ModalHeader    from "./modal/ModalHeader";
import GrammarBanner  from "./modal/GrammarBanner";
import TranslatePanel from "./modal/TranslatePanel";
import NoteTextArea   from "./modal/NoteTextArea";
import ModalFooter    from "./modal/ModalFooter";

/* ════════════════════════════════════════
   NoteModal
   — All UI split into sub-components
   — This file only handles state & logic
════════════════════════════════════════ */
const NoteModal = ({ show, onClose, onSave, note, setNote, isEditing }) => {
  const [formError, setFormError] = useState("");

  /* Grammar state */
  const [grammarLoading, setGrammarLoading]   = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [showUndo, setShowUndo]               = useState(false);

  /* Translate state */
  const [translateOpen, setTranslateOpen]       = useState(false);
  const [selectedLang, setSelectedLang]         = useState(LANGUAGES[0]);
  const [translateLoading, setTranslateLoading] = useState(false);

  const isAiWorking = grammarLoading || translateLoading;

  /* ── Fix Grammar ── */
  const handleFixGrammar = async () => {
    if (!note.content.trim()) {
      toast.error("Write some content first!");
      return;
    }
    setGrammarLoading(true);
    setShowUndo(false);
    try {
      const fixed = await geminiFixGrammar(note.content);
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

  /* ── Undo ── */
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
      setTranslateOpen(false);
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
    setTranslateOpen(false);
    setShowUndo(false);
    setOriginalContent("");
    onClose();
  };

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
        {/* 1. Header — title + AI buttons + close */}
        <ModalHeader
          isEditing={isEditing}
          grammarLoading={grammarLoading}
          translateOpen={translateOpen}
          showUndo={showUndo}
          isAiWorking={isAiWorking}
          onFixGrammar={handleFixGrammar}
          onUndo={handleUndo}
          onToggleTranslate={() => setTranslateOpen((p) => !p)}
          onClose={handleClose}
        />

        {/* 2. Grammar success banner */}
        <GrammarBanner
          show={showUndo && !grammarLoading}
          onUndo={handleUndo}
        />

        {/* 3. Translate language picker */}
        <TranslatePanel
          show={translateOpen}
          selectedLang={selectedLang}
          loading={translateLoading}
          onSelectLang={(lang) => setSelectedLang(lang)}
          onTranslate={handleTranslate}
        />

        {/* 4. Title input + Content textarea */}
        <NoteTextArea
          note={note}
          setNote={setNote}
          formError={formError}
          isAiWorking={isAiWorking}
          grammarLoading={grammarLoading}
          translateLoading={translateLoading}
          showUndo={showUndo}
          onResetUndo={() => setShowUndo(false)}
        />

        {/* 5. Footer — Discard + Save */}
        <ModalFooter
          isEditing={isEditing}
          isAiWorking={isAiWorking}
          onClose={handleClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default NoteModal;