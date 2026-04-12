// utils/geminiTranslate.js

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Translate text to target language using Gemini API
 * @param {string} text - Text to translate
 * @param {string} targetLang - e.g. "Hindi", "French", "Spanish"
 * @returns {Promise<string>} translated text
 */
export const geminiTranslate = async (text, targetLang) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) throw new Error("Gemini API key missing! Add VITE_GEMINI_API_KEY in .env");
  if (!text?.trim()) throw new Error("No text to translate");

  const prompt = `Translate the following text to ${targetLang}. 
Return ONLY the translated text — no explanation, no preamble, no quotes.

Text to translate:
${text}`;

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
  const result = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!result) throw new Error("Empty response from Gemini");
  return result.trim();
};

/* ── Supported languages ── */
export const LANGUAGES = [
  { code: "hi",  label: "Hindi",      flag: "🇮🇳" },
  { code: "fr",  label: "French",     flag: "🇫🇷" },
  { code: "es",  label: "Spanish",    flag: "🇪🇸" },
  { code: "de",  label: "German",     flag: "🇩🇪" },
  { code: "ja",  label: "Japanese",   flag: "🇯🇵" },
  { code: "zh",  label: "Chinese",    flag: "🇨🇳" },
  { code: "ar",  label: "Arabic",     flag: "🇸🇦" },
  { code: "pt",  label: "Portuguese", flag: "🇧🇷" },
  { code: "ru",  label: "Russian",    flag: "🇷🇺" },
  { code: "ko",  label: "Korean",     flag: "🇰🇷" },
  { code: "it",  label: "Italian",    flag: "🇮🇹" },
  { code: "en",  label: "English",    flag: "🇬🇧" },
];