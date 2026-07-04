import React from 'react';
import dynamic from 'next/dynamic';
import AcademyNavbar from "../layout/AcademyNavbar";
import KodlandHero3 from "./KodlandHero3";
// Below-fold and non-critical components loaded dynamically
const InterestsSection = dynamic(() => import("./InterestsSection"));
const WhyMajdFeatures = dynamic(() => import("./WhyMajdFeatures"));
const PackagesSection = dynamic(() => import("./PackagesSection"));
const FAQSection = dynamic(() => import("./FAQSection"));
const KodlandFooter = dynamic(() => import("../layout/KodlandFooter"));
const GuaranteesSection = dynamic(() => import("./GuaranteesSection"));
const WhatsAppReviewsSlider = dynamic(() => import("./WhatsAppReviewsSlider"));
const FloatingWhatsApp = dynamic(() => import("../layout/FloatingWhatsApp"));

type Locale = "ar" | "en";

export default function AcademyLanding2({ locale, isCurriculums }: { locale: Locale; isCurriculums?: boolean }) {
  const isArabic = locale === "ar";
  
  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />
      
      <main id="main-content" role="main" className="flex-1">
        <KodlandHero3 locale={locale} />
        <InterestsSection locale={locale} />
        <WhyMajdFeatures locale={locale} />
        {isCurriculums && <PackagesSection locale={locale} />}
        <FAQSection locale={locale} />
        <GuaranteesSection />
        <WhatsAppReviewsSlider />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
