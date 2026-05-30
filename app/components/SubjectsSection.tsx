"use client";
import React, { useState } from "react";
import { useLandingContent } from "./useLandingContent";
import BookingModal from "./BookingModal";

const cardColors = ["#fff8f0", "#fef0f8"];
const cardImages = ["/icon1.webp", "/icon2.webp"];

export default function SubjectsSection() {
  const content = useLandingContent();
  const isArabic = content.hero.cta === "احجز حصة مجانية";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subjects = isArabic
    ? [
        {
          name: "اللغة العربية",
          desc: "نبني مهارات القراءة والكتابة والتعبير بأسلوب ممتع يحبب الطالب باللغة ويقوّي ثقته.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نغرس القيم والمفاهيم الإسلامية بطريقة قريبة من الطالب تربط الدين بحياته اليومية.",
          cta: "احجز حصة مجانية",
        },
      ]
    : [
        {
          name: "Arabic Language",
          desc: "We build reading, writing, and expression skills in an engaging way that makes students love the language.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We instill Islamic values and concepts in a relatable way that connects faith to the student's daily life.",
          cta: "Book a free class",
        },
      ];

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <h2
            className="text-center mb-16"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "120%",
              color: "#262626",
            }}
          >
            {isArabic ? "المواد " : "Subjects "}
            <span className="relative inline-block">
              <span
                className="absolute z-0 rounded-md"
                style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }}
              />
              <span className="relative z-10">{isArabic ? "اللي ندرّسها" : "we teach"}</span>
            </span>
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
                    style={{ fontFamily: "'Cairo', sans-serif", fontSize: "24px", fontWeight: 800, color: "#262626" }}
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
