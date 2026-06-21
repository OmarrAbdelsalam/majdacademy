"use client";
import React, { useState } from "react";
import { BookOpen, PenTool, Brain, Sparkles } from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import { gradesContent } from "./gradesContent";

const featureColors = ["#2563eb", "#ef5da8", "#f97316", "#2563eb"];
const featureBgs = [
  "https://cdn.kodland.org/main-site-v2/bg-blue.png",
  "https://cdn.kodland.org/main-site-v2/bg-pink.png",
  "https://cdn.kodland.org/main-site-v2/bg-orange.png",
  "https://cdn.kodland.org/main-site-v2/bg-blue.png",
];
const featureIcons = [
  <BookOpen key="1" className="w-6 h-6" strokeWidth={1.5} />,
  <PenTool key="2" className="w-6 h-6" strokeWidth={1.5} />,
  <Brain key="3" className="w-6 h-6" strokeWidth={1.5} />,
  <Sparkles key="4" className="w-6 h-6" strokeWidth={1.5} />,
];

export default function GradeFeatures({ grade }: { grade: number }) {
  const { lang } = useLang();
  const c = gradesContent[lang as "ar" | "en"][grade];
  const isArabic = lang === "ar";
  const [activeIndex, setActiveIndex] = useState(0);

  if (!c) return null;

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
          {isArabic ? `إيش بيتعلم في ${c.name}؟` : `What they learn in ${c.name}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-5 items-center">
          {/* Features list */}
          <div className="flex flex-col gap-3">
            {c.features.map((feature, i) => {
              const isActive = activeIndex === i;
              const color = featureColors[i];
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative flex items-start gap-4 p-6 rounded-[32px] transition-all duration-300 text-start w-full overflow-hidden ${
                    isActive ? "shadow-lg" : "bg-[#f8f9fa] hover:-translate-y-0.5"
                  }`}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundImage: `url('${featureBgs[i]}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "bottom left",
                        transform: "rotate(180deg)" }}
                    />
                  )}
                  <div
                    className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: isActive ? "rgba(255,255,255,0.2)" : `${color}15`, color: isActive ? "#ffffff" : color }}
                  >
                    {featureIcons[i]}
                  </div>
                  <div className="relative z-10">
                    <h3 className="mb-1" style={{ fontSize: "17px", fontWeight: 700, color: isActive ? "#ffffff" : "#262626" }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: "14px", fontWeight: 500, lineHeight: "22px", color: isActive ? "rgba(255,255,255,0.8)" : "rgba(38,38,38,0.6)" }}>
                      {feature.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Image */}
          <div className="hidden md:flex justify-center items-center">
            <img src="/hero-illustration.png" alt="" className="w-[350px] h-auto object-contain" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
