import Hero from "../components/home/Hero";
import FeedbackSection from "../components/home/FeedbackSection";
import FAQSection from "../components/home/FAQSection";
import StatsSection from "../components/home/StatsSection";
import FeatureGrid from "../components/home/FeatureGrid";
import CTASection from "../components/home/CTASection"; 
const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <StatsSection />
      <FeatureGrid />
      <FeedbackSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Home;
