"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import AcademyNavbar from "../../../components/AcademyNavbar";
import KodlandFooter from "../../../components/KodlandFooter";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import GradeHero from "../../../components/grades/GradeHero";
import GradeSubjects from "../../../components/grades/GradeSubjects";
import GradeFeatures from "../../../components/grades/GradeFeatures";
import GradeCTA from "../../../components/grades/GradeCTA";

export default function GradePage() {
  const { isRTL } = useLang();
  const params = useParams();

  const gradeParam = params?.grade as string;
  const gradeNumber = parseInt(gradeParam, 10);
  const validGrade = gradeNumber >= 1 && gradeNumber <= 12 ? gradeNumber : 1;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />

      <main className="flex-1">
        <GradeHero grade={validGrade} />
        <GradeSubjects grade={validGrade} />
        <GradeFeatures grade={validGrade} />
        <GradeCTA />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
