"use client";
import React from "react";
import Link from "next/link";
import { useLang } from "../../i18n/LangContext";
import { stagesContent, StageKey } from "./stagesContent";

const cardColors = ["#fff8f0", "#fef0f8", "#eefbf3", "#fff8f0", "#fef0f8"];

export default function GradesGrid({ stage }: { stage: StageKey }) {
  const { lang } = useLang();
  const c = stagesContent[lang as "ar" | "en"][stage];
  const isArabic = lang === "ar";

  const getGradeSlug = (id: string | number) => {
    if (typeof id === 'number') return `grade-${id}`;
    if (typeof id === 'string' && id.startsWith('KG')) return `kg-${id.replace('KG', '')}`;
    return String(id).toLowerCase();
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <h2
          className="text-center mb-16"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: "120%",
            color: "#262626" }}
        >
          {isArabic ? "الصفوف الدراسية" : "Grades included"}
        </h2>

        <div className="flex flex-wrap justify-center gap-5 max-w-[1100px] mx-auto">
          {c.grades.map((grade, i) => (
            <Link 
              key={grade.id} 
              href={`/${lang}/grade/${getGradeSlug(grade.id)}/arabic`}
              className="w-[calc(50%-10px)] sm:w-[180px] md:w-[220px] lg:w-[240px] flex-none"
            >
              <div
                className="rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[220px] md:min-h-[250px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                style={{ background: cardColors[i % cardColors.length] }}
              >
                <span
                  className="text-[48px] md:text-[60px] font-black mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: "#262626" }}
                >
                  {grade.id}
                </span>
                <span
                  className="text-[17px] md:text-[18px] font-bold text-black/70 text-center"
                >
                  {grade.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
