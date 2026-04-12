

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/* ── Generic Gemini call ── */
export const callGemini = async (prompt, maxTokens = 2048) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key missing! Add VITE_GEMINI_API_KEY in .env");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens },
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

/* ── Translate shortcut ── */
export const geminiTranslate = async (text, targetLang) => {
  if (!text?.trim()) throw new Error("No text to translate");
  return callGemini(
    `Translate the following text to ${targetLang}.
Return ONLY the translated text — no explanation, no preamble, no quotes.

Text:
${text}`,
    2048
  );
};

/* ── Fix grammar shortcut ── */
export const geminiFixGrammar = async (text) => {
  if (!text?.trim()) throw new Error("No text to fix");
  return callGemini(
    `Fix all grammar mistakes, spelling errors, and punctuation in the following text.
Rules:
- Keep original meaning 100% intact
- Keep the same language as the input
- Do NOT add new content or change the style
- Return ONLY the corrected text, no explanation

Text:
${text}`,
    2048
  );
};

/* ── Supported languages ── */
export const LANGUAGES = [
  { code: "hi", label: "Hindi",      flag: "🇮🇳" },
  { code: "fr", label: "French",     flag: "🇫🇷" },
  { code: "es", label: "Spanish",    flag: "🇪🇸" },
  { code: "de", label: "German",     flag: "🇩🇪" },
  { code: "ja", label: "Japanese",   flag: "🇯🇵" },
  { code: "zh", label: "Chinese",    flag: "🇨🇳" },
  { code: "ar", label: "Arabic",     flag: "🇸🇦" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "ru", label: "Russian",    flag: "🇷🇺" },
  { code: "ko", label: "Korean",     flag: "🇰🇷" },
  { code: "it", label: "Italian",    flag: "🇮🇹" },
  { code: "en", label: "English",    flag: "🇬🇧" },
];