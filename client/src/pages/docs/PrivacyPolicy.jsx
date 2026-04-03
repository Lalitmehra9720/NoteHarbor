import React from 'react';
import PrivacyHeader from '/images/DocImages/privacy-policy-header.png';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        {/* Left Visual Sidebar */}
        <div className="md:col-span-5 sticky top-24">
          <div className="glass-card p-4 border-none bg-indigo-500/5">
            <img src={PrivacyHeader} alt="Security" className="rounded-xl w-full h-auto shadow-2xl mb-6" />
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                End-to-End Encryption Active
              </div>
              <p className="desc italic">"Your privacy is our priority. We never sell your data to third parties."</p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-7 space-y-10">
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Privacy <span className="text-indigo-500">Policy</span></h1>
            <p className="desc">Effective Date: April 2, 2026</p>
          </div>

          {[
            { id: "01", t: "Information Collection", d: "We collect your email for authentication and encrypted note content to ensure seamless synchronization across your devices." },
            { id: "02", t: "AI Data Processing", d: "When using the 'Summarize' feature, content is processed via Gemini AI. Your data is not stored permanently on AI servers or used for training." },
            { id: "03", t: "Security Measures", d: "We use 256-bit encryption and secure cloud storage (MongoDB Atlas) to keep your intellectual property safe from unauthorized access." }
          ].map((item) => (
            <div key={item.id} className="glass-card border-l-4 border-l-indigo-500 hover:translate-x-2 transition-transform">
              <span className="text-xs font-bold text-indigo-500/50 mb-2 block tracking-widest uppercase">Section {item.id}</span>
              <h3 className="title text-2xl">{item.t}</h3>
              <p className="desc text-base leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;