import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      style={{ 
        borderColor: 'var(--border)', 
        backgroundColor: 'var(--glass-light)',
        fontFamily: '"Inter", sans-serif' // Standard industry UI font
      }}
      className="mb-4 rounded-2xl border backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-indigo-400/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
      >
        {/* Industry standard: semibold + tight tracking */}
        <span 
          style={{ color: 'var(--text)' }} 
          className="text-[17px] font-semibold tracking-tight leading-snug"
        >
          {question}
        </span>
        <div 
           style={{ color: 'var(--text)' }}
           className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div 
          style={{ color: 'var(--text)', borderTopColor: 'var(--border)' }}
          className="px-6 pb-6 pt-2 text-[15px] font-medium leading-relaxed opacity-70 border-t border-dashed mt-1"
        >
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the AI summarization work?",
      answer: "Note-Harbor leverages the Gemini API to scan your long-form notes and generate concise summaries, allowing you to review key points in seconds."
    },
    {
      question: "Is my data stored securely?",
      answer: "Your privacy is our priority. We store your notes and preferences directly in your browser's local storage, meaning your data stays with you."
    },
    {
      question: "Can I use this for college projects?",
      answer: "Definitely! Note-Harbor is designed for students and developers to manage complex project notes and documentation efficiently."
    },
    {
      question: "Is there a limit to how many notes I can save?",
      answer: "The limit depends on your browser's local storage capacity (usually 5-10MB), which is plenty for thousands of standard text notes."
    },
    {
      question: "Does the AI support multiple languages?",
      answer: "Yes, the integrated AI handles various languages, making it a versatile tool for international academic or professional projects."
    }
  ];

  return (
    <section className="mx-auto mt-24 max-w-3xl px-6 py-16" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="text-center mb-16">
        {/* Industry standard: extra bold + negative tracking */}
        <h2 
          style={{ color: 'var(--text)' }} 
          className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4"
        >
          Frequently Asked Questions
        </h2>
        <p 
          style={{ color: 'var(--text)' }} 
          className="text-lg font-medium opacity-60 tracking-tight"
        >
          Everything you need to know about mastering your workflow.
        </p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;