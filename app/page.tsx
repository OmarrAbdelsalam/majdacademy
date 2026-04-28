import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesSection from "./components/Features";
import ProductsSlider from "./components/ProductsSlider";
import TrustStats from "./components/TrustStats";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home">
        <Hero />
        <ProductsSlider />
        <FeaturesSection />
        <TrustStats />

        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

