import React from 'react';
import TermsOfServiceHeader from '/images/DocImages/terms-of-service-header.png';

const TermsOfService = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      {/* Header with FULL WIDTH Rectangle Image */}
      <div className="text-center mb-16 relative">
        {/* Wider Glow Effect */}
        <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-[120px] opacity-10 animate-pulse"></div>

        {/* Full Width Rectangle Image Container */}
        <div className="mb-12 relative z-10 w-full overflow-hidden rounded-3xl border border-indigo-500/20 shadow-[0_20px_50px_rgba(79,70,229,0.15)]">
          <img 
            src={TermsOfServiceHeader} 
            alt="Terms of Service Banner" 
            className="w-full h-auto md:h-[350px] object-cover transition-transform duration-700 hover:scale-105" 
          />
        </div>

        {/* Main Title Section */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Terms of <span className="text-indigo-500">Service</span>
          </h1>
          <p className="desc text-lg md:text-xl opacity-80">
            Please read these terms carefully before using NoteHarbor. We've kept them simple and transparent.
          </p>
        </div>
      </div>

      {/* Terms Content - 2 Column Grid for better space utilization */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { t: "1. Acceptance", d: "By accessing or using NoteHarbor, you agree to be bound by these Terms. If you disagree with any part, you may not access the service." },
          { t: "2. User Conduct", d: "You are responsible for your account's security and for any content you post. Prohibited activities include hacking, spamming, or hosting illegal content." },
          { t: "3. Service Limitations", d: "NoteHarbor is provided 'As Is'. While we aim for 99.9% uptime, we are not liable for data loss during unexpected server maintenance." },
          { t: "4. Intellectual Property", d: "Your notes belong to YOU. NoteHarbor claims no ownership over the text, images, or summaries you create." }
        ].map((item, i) => (
          <div key={i} className="glass-card hover:bg-white/5 transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-indigo-500">
            <div className="flex items-start gap-5">
              <span className="text-3xl font-black text-indigo-500/10 group-hover:text-indigo-500/30 transition">0{i+1}</span>
              <div>
                <h3 className="title text-xl mb-3">{item.t}</h3>
                <p className="desc leading-relaxed text-base opacity-70">{item.d}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 glass-card border-none text-center bg-indigo-500/5 py-10">
        <p className="desc mb-4 font-medium text-lg">Still have questions about our legal terms?</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20">
          Contact Legal Team
        </button>
      </div>
    </div>
  );
};

export default TermsOfService;