import React from 'react';
import AcademyNavbar from "./AcademyNavbar";
import KodlandHero from "./KodlandHero";
import InterestsSection from "./InterestsSection";
import StatsAndPathsSection from "./StatsAndPathsSection";
import TrialStepsSection from "./TrialStepsSection";
import PremiumPackagesHero from "./PremiumPackagesHero";
import StudentTestimonials from "./StudentTestimonials";
import KodlandFooter from "./KodlandFooter";
import FloatingWhatsApp from "./FloatingWhatsApp";
import FAQSection from "./FAQSection";
import PackagesSection from "./PackagesSection";
import GuaranteesSection from "./GuaranteesSection";

type Locale = "ar" | "en";

export default function AcademyLanding2({ locale }: { locale: Locale }) {
  const isArabic = locale === "ar";
  
  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />
      
      <main className="flex-1">
        <KodlandHero />
        <InterestsSection />
        <StatsAndPathsSection />
        <TrialStepsSection />
        <PackagesSection />
        <GuaranteesSection />
        <FAQSection />
        <StudentTestimonials />
      </main>

      {/* ═══ HIDDEN SECTIONS — To be re-enabled later ═══ */}
      {/* <PremiumPackagesHero /> */}

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
