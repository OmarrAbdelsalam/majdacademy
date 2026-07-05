"use client";
import React, { useState } from "react";
import { getLandingContent } from "./getLandingContent";
import BookingModal from "../shared/BookingModal";

const cardColors = ["#fff8f0", "#ebfbf0"];
const cardImages = ["/arabic.webp", "/islam.webp"];

export default function SubjectsSection({ locale }: { locale: string }) {
  const content = getLandingContent(locale);
  const isArabic = content.hero.cta === "احجز حصة مجانية";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subjects = content.subjectsSection.items;

  return (
    <>
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <h2
            className="text-center mb-8 md:mb-12"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "120%",
              color: "#262626" }}
          >
            {content.subjectsSection.title1}{content.subjectsSection.title2}
          </h2>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
            {subjects.map((subject: any, i: number) => (
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
                      className="w-[260px] h-[260px] object-contain -mt-[50px] -mb-[50px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
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
