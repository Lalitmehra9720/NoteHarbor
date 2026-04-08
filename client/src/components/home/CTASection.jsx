const CTASection = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto p-12 rounded-[3rem] bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to anchor your notes?</h2>
        <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">Join thousands of students and developers who are boosting their productivity with Note Harbor.</p>
        <button className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1">
          Start for Free
        </button>
      </div>
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full -ml-20 -mb-20 blur-3xl" />
    </div>
  </section>
);
export default CTASection;