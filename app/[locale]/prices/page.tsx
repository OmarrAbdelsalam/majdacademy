import Navbar from "../../components/Navbar";
import GoldPrices from "../../components/GoldPrices";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

export default function PricesPage() {
  return (
    <>
      <Navbar />
      <main>
        <GoldPrices />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
