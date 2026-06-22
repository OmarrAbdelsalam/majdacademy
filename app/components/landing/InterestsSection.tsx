"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { LandingVariantContext } from "./useLandingContent";
import { getLandingContent } from "./getLandingContent";
import { useLang } from "../../i18n/LangContext";

const cardColors = ["#f0f4ff", "#fef0f8", "#fff8f0", "#eefbf3"];
const cardImages = ["/icon4.webp", "/icon2.webp", "/icon1.webp", "/icon3.webp"];

export default function InterestsSection({ locale }: { locale: string }) {
  const content = getLandingContent(locale);
  const [activeTab, setActiveTab] = useState(0);
  const variant = React.useContext(LandingVariantContext);
  const { lang } = useLang();
  const pathname = usePathname();
  const isCurriculums = pathname.includes("/curriculums");

  const stageLinks = [
    `/${lang}/stages/kindergarten`,
    `/${lang}/stages/primary`,
    `/${lang}/stages/middle`,
    `/${lang}/stages/secondary`,
  ];

  // First 3 cards (kindergarten, primary, middle) — top row
  const topCards = content.interests.cards.slice(0, 3);
  // 4th card (secondary)
  const secondaryCard = content.interests.cards[3];

  const badgeColors = ["#d4e4ff", "#fcc8e4", "#ffe0c2", "#c7f5d8"];

  return (
    <section id="grades" className="pt-24 pb-8 md:pt-32 md:pb-12 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <h2
          className="text-center mb-8 md:mb-12"
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: "130%",
            color: "#262626" }}
        >
          {content.interests.heading}{" "}{content.interests.headingHighlight}
        </h2>

        {isCurriculums ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.interests.cards.map((item, i) => (
              <div
                key={i}
                className="rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] lg:min-h-0 transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                style={{ background: cardColors[i] }}
              >
                <div>
                  <span
                    className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-6"
                    style={{ background: badgeColors[i], color: "#262626" }}
                  >
                    {item.age}
                  </span>
                  {/* Hide sticker only on lg screens where 4 cards are in the same row */}
                  <div className="flex lg:hidden justify-center mb-6 overflow-hidden h-[160px]">
                    <img
                      src={cardImages[i]}
                      alt={item.title}
                      className="w-[240px] h-[240px] object-contain -my-[40px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                </div>
                <div>
                  <h3
                    className="mb-3"
                    style={{ fontSize: "24px", fontWeight: 800, color: "#262626" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mb-5"
                    style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}
                  >
                    {item.description}
                  </p>
                  <a
                    href={stageLinks[i]}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-300"
                  >
                    {item.link}
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Top row — 3 cards (kindergarten, primary, middle) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {topCards.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                  style={{ background: cardColors[i] }}
                >
                  <div>
                    <span
                      className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-6"
                      style={{ background: badgeColors[i], color: "#262626" }}
                    >
                      {item.age}
                    </span>
                    <div className="flex justify-center mb-6 overflow-hidden h-[160px]">
                      <img
                        src={cardImages[i]}
                        alt={item.title}
                        className="w-[240px] h-[240px] object-contain -my-[40px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="mb-3"
                      style={{ fontSize: "24px", fontWeight: 800, color: "#262626" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mb-5"
                      style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}
                    >
                      {item.description}
                    </p>
                    <a
                      href={stageLinks[i]}
                      className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-300"
                    >
                      {item.link}
                      <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row — Secondary card + Arabic CTA side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

              {/* Secondary stage card */}
              {secondaryCard && (
                <div
                  className="md:col-span-1 rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                  style={{ background: cardColors[3] }}
                >
                  <div>
                    <span
                      className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-6"
                      style={{ background: badgeColors[3], color: "#262626" }}
                    >
                      {secondaryCard.age}
                    </span>
                    <div className="flex justify-center mb-6 overflow-hidden h-[160px]">
                      <img
                        src={cardImages[3]}
                        alt={secondaryCard.title}
                        className="w-[240px] h-[240px] object-contain -my-[40px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="mb-3"
                      style={{ fontSize: "24px", fontWeight: 800, color: "#262626" }}
                    >
                      {secondaryCard.title}
                    </h3>
                    <p
                      className="mb-5"
                      style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}
                    >
                      {secondaryCard.description}
                    </p>
                    <a
                      href={stageLinks[3]}
                      className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-300"
                    >
                      {secondaryCard.link}
                      <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              <div
                className="md:col-span-2 rounded-[32px] relative overflow-hidden border border-gray-100 min-h-[280px] bg-[#e8347d]"
              >
                {/* SVG Background Waves */}
                <div className="absolute inset-0 z-0">
                  <svg
                    className="absolute w-full h-full object-cover"
                    viewBox="0 0 1000 400"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="interestsBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e8347d" />
                        <stop offset="60%" stopColor="#f6428c" />
                        <stop offset="100%" stopColor="#ff66a3" />
                      </linearGradient>
                      <linearGradient id="interestsWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="interestsWaveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <rect width="1000" height="400" fill="url(#interestsBaseGrad)" />
                    <path
                      d="M0,140 C300,80 700,240 1000,110 L1000,400 L0,400 Z"
                      fill="url(#interestsWaveGrad1)"
                    />
                    <path
                      d="M0,230 C350,290 650,180 1000,250 L1000,400 L0,400 Z"
                      fill="url(#interestsWaveGrad2)"
                    />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center h-full w-full">
                  {/* Text content */}
                  <div className="flex-1 p-8 md:p-10">
                    <span
                      className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-5"
                      style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                    >
                      {content.interests.ctaBadge}
                    </span>
                    <h3
                      style={{
                        fontSize: "clamp(20px, 2.5vw, 28px)",
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: "130%",
                        marginBottom: "12px" }}
                    >
                      {content.interests.ctaTitle}
                    </h3>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        lineHeight: "26px",
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: "24px" }}
                    >
                      {content.interests.ctaDesc}
                    </p>
                    <a
                      href={`/${lang}/learn-arabic`}
                      className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-white text-[#ef5da8] hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                      style={{ padding: "16px 32px", fontSize: "15px", fontWeight: 600 }}
                    >
                      {content.interests.ctaButton}
                      <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </a>
                  </div>


                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </section>
  );
}
