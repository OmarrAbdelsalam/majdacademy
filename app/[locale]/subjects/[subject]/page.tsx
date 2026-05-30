"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import AcademyNavbar from "../../../components/AcademyNavbar";
import KodlandFooter from "../../../components/KodlandFooter";
import FloatingWhatsApp from "../../../components/FloatingWhatsApp";
import SubjectHero from "../../../components/subjects/SubjectHero";
import SubjectFeatures from "../../../components/subjects/SubjectFeatures";
import SubjectWhyUs from "../../../components/subjects/SubjectWhyUs";
import { SubjectKey } from "../../../components/subjects/subjectsContent";

export default function SubjectPage() {
  const { isRTL } = useLang();
  const params = useParams();
  const subject = (params?.subject as SubjectKey) || "arabic";

  const validSubjects: SubjectKey[] = ["arabic", "islamic"];
  const currentSubject = validSubjects.includes(subject) ? subject : "arabic";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <AcademyNavbar />

      <main className="flex-1">
        <SubjectHero subject={currentSubject} />
        <SubjectFeatures subject={currentSubject} />
        <SubjectWhyUs subject={currentSubject} />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
