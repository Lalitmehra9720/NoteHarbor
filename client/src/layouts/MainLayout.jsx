
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--gradient)",
        color: "var(--text)",
      }}
    >
      <Navbar />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;