"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import AcademyNavbar from "../../../components/AcademyNavbar";
import KodlandFooter from "../../../components/KodlandFooter";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import StageHero from "../../../components/stages/StageHero";
import GradesGrid from "../../../components/stages/GradesGrid";
import SubjectsSection from "../../../components/SubjectsSection";
import StageFeatures from "../../../components/stages/StageFeatures";
import StageCTA from "../../../components/stages/StageCTA";
import { StageKey } from "../../../components/stages/stagesContent";

export default function StagePage() {
  const { isRTL } = useLang();
  const params = useParams();
  const stage = (params?.stage as StageKey) || "primary";

  // Validate stage
  const validStages: StageKey[] = ["primary", "middle", "secondary"];
  const currentStage = validStages.includes(stage) ? stage : "primary";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />

      <main className="flex-1">
        <StageHero stage={currentStage} />
        <GradesGrid stage={currentStage} />
        <SubjectsSection />
        <StageFeatures stage={currentStage} />
        <StageCTA />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
