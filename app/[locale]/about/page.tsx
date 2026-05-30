"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import AcademyNavbar from "../../components/AcademyNavbar";
import KodlandFooter from "../../components/KodlandFooter";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import AboutHero from "../../components/about/AboutHero";
import MissionVision from "../../components/about/MissionVision";
import AboutValues from "../../components/about/AboutValues";
import AboutWhyUs from "../../components/about/AboutWhyUs";

export default function AboutPage() {
  const { isRTL } = useLang();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />

      <main className="flex-1">
        <AboutHero />
        <MissionVision />
        <AboutValues />
        <AboutWhyUs />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
