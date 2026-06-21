"use client";
import React, { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { gradesContent } from "./gradesContent";
import BookingModal from "../shared/BookingModal";

const cardColors = ["#fff8f0", "#fef0f8"];
const cardImages = ["/icon1.webp", "/icon2.webp"];

export default function GradeSubjects({ grade }: { grade: number }) {
  const { lang } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const c = gradesContent[lang as "ar" | "en"][grade];

  if (!c) return null;

  const isArabic = lang === "ar";
  const subjects = c.subjects;

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <h2
            className="text-center mb-16"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "120%",
              color: "#262626" }}
          >
            {isArabic ? "المواد التي نُدرّسها" : "Subjects we teach"}
          </h2>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
            {subjects.map((subject, i) => (
              <div
                key={i}
                className="rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                style={{ background: cardColors[i] }}
              >
                <div>
                  <div className="flex justify-center mb-6 overflow-hidden h-[160px]">
                    <img
                      src={cardImages[i]}
                      alt={subject.name}
                      className="w-[240px] h-[240px] object-contain -my-[40px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                </div>
                <div>
                  <h3
                    className="mb-3"
                    style={{ fontSize: "24px", fontWeight: 800, color: "#262626" }}
                  >
                    {subject.name}
                  </h3>
                  <p
                    className="mb-5"
                    style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}
                  >
                    {subject.desc}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-300"
                  >
                    {subject.cta}
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
