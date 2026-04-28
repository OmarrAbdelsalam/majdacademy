import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesSection from "../components/Features";
import ProductsSlider from "../components/ProductsSlider";
import TrustStats from "../components/TrustStats";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home">
        <Hero />
        <div id="products">
          <ProductsSlider />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <TrustStats />
        <div id="faq">
          <FAQ />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
