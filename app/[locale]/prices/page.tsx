import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PricesHero from "../../components/prices/PricesHero";
import ProductsShowcase from "../../components/ProductsShowcase";
import TrustStats from "../../components/TrustStats";
import AboutUs from "../../components/AboutUs";
import LatestNews from "../../components/LatestNews";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "أسعار الذهب والفضة اليوم | Golden Circle Gold",
  description:
    "تحديث مباشر لأسعار الذهب عيار 24 و21 و18 وأسعار الفضة في مصر بالجنيه المصري — حاسبة الذهب ومنتجاتنا",
  keywords: [
    "أسعار الذهب اليوم",
    "سعر الذهب",
    "gold prices",
    "أسعار الفضة",
    "silver prices",
    "حاسبة الذهب",
    "سبائك ذهب",
    "Golden Circle",
  ],
};

export default function PricesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricesHero />
        <ProductsShowcase />
        <TrustStats />
        <AboutUs />
        <LatestNews />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
