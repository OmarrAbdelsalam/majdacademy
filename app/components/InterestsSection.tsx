"use client";
import React from "react";
import { useLandingContent } from "./useLandingContent";

const cardColors = ["#fff8f0", "#fef0f8", "#eefbf3"];
const cardImages = ["/icon1.webp", "/icon2.webp", "/icon3.webp"];

export default function InterestsSection() {
  const content = useLandingContent();

  return (
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
          {content.interests.heading}{" "}
          <span className="relative inline-block">
            <span
              className="absolute z-0 rounded-md"
              style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }}
            />
            <span className="relative z-10">{content.interests.headingHighlight}</span>
          </span>
        </h2>

        {/* Top row — 3 cycle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {content.interests.cards.map((item, i) => {
            const badgeColors = ["#ffe0c2", "#fcc8e4", "#b8f0d0"];
            return (
              <div
                key={i}
                className="rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                style={{ background: cardColors[i] || "#f7fee7" }}
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
                    style={{ fontFamily: "'Cairo', sans-serif", fontSize: "24px", fontWeight: 800, color: "#262626" }}
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
                    href="#packages"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-300"
                  >
                    {item.link}
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom row — Arabic for non-native speakers (full width) */}
        <div
          className="rounded-[32px] mt-6 relative overflow-hidden min-h-[280px] md:min-h-[320px] border border-gray-100"
          style={{
            background: "linear-gradient(135deg, #f0fce8 0%, #d3ff5f 40%, #c8f550 100%)",
          }}
        >
          {/* Decorative gradient overlay */}
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{
              backgroundImage: "url('https://cdn.kodland.org/main-site-v2/banner.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scaleX(-1)",
            }}
          />

          {/* Content grid */}
          <div className="relative z-10 flex flex-col md:flex-row-reverse items-center h-full">
            {/* Icon — left side */}
            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <img
                src="/icon4.webp"
                alt=""
                className="w-[500px] h-auto object-contain"
              />
            </div>

            {/* Text content — right side */}
            <div className="flex-1 p-8 md:p-12 md:pr-16">
              <span
                className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-5"
                style={{ background: "rgba(38,38,38,0.08)", color: "#262626" }}
              >
                {content.interests.ctaBadge}
              </span>
              <h3
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 800,
                  color: "#262626",
                  lineHeight: "130%",
                  marginBottom: "14px",
                }}
              >
                {content.interests.ctaTitle}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "28px",
                  color: "rgba(38,38,38,0.6)",
                  marginBottom: "28px",
                  maxWidth: "520px",
                }}
              >
                {content.interests.ctaDesc}
              </p>
              <a
                href="/ar/learn-arabic"
                className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                style={{ padding: "18px 40px", fontSize: "16px", fontWeight: 600 }}
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
    </section>
  );
}
