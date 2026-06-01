"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import AcademyNavbar from "../layout/AcademyNavbar";
import KodlandHero from "./KodlandHero";
import InterestsSection from "./InterestsSection";
import WhyMajdFeatures from "./WhyMajdFeatures";
import SubjectsSection from "./SubjectsSection";
import StatsAndPathsSection from "./StatsAndPathsSection";
import TrialStepsSection from "./TrialStepsSection";
import PackagesSection from "./PackagesSection";
import FAQSection from "./FAQSection";
import KodlandFooter from "../layout/KodlandFooter";

// Below-fold and non-critical components loaded dynamically
const GuaranteesSection = dynamic(() => import("./GuaranteesSection"), { ssr: false });
const StudentTestimonials = dynamic(() => import("./StudentTestimonials"), { ssr: false });
const FloatingWhatsApp = dynamic(() => import("../layout/FloatingWhatsApp"), { ssr: false });

type Locale = "ar" | "en";

export default function AcademyLanding2({ locale }: { locale: Locale }) {
  const isArabic = locale === "ar";
  
  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />
      
      <main id="main-content" role="main" className="flex-1">
        <KodlandHero />
        <InterestsSection />
        <WhyMajdFeatures />
        <SubjectsSection />
        <StatsAndPathsSection />
        <TrialStepsSection />
        <PackagesSection />
        <FAQSection />
        <GuaranteesSection />
        <StudentTestimonials />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
