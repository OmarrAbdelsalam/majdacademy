"use client";
import React, { useState } from "react";
import { Monitor, Users, TrendingUp, GraduationCap } from "lucide-react";
import { useLandingContent } from "./useLandingContent";

const featureColors = ["#ef5da8", "#2563eb", "#f97316", "#2563eb"];
const featureBgs = [
  "https://cdn.kodland.org/main-site-v2/bg-pink.png",
  "https://cdn.kodland.org/main-site-v2/bg-blue.png",
  "https://cdn.kodland.org/main-site-v2/bg-orange.png",
  "https://cdn.kodland.org/main-site-v2/bg-blue.png",
];

export default function WhyMajdFeatures() {
  const content = useLandingContent();
  const isArabic = content.hero.cta === "احجز حصة مجانية";
  const [activeIndex, setActiveIndex] = useState(0);

  const features = content.whyMajd.features.map((feature, i) => ({
    ...feature,
    icon: [
      <GraduationCap key="0" className="w-6 h-6" strokeWidth={1.5} />,
      <Monitor key="1" className="w-6 h-6" strokeWidth={1.5} />,
      <Users key="2" className="w-6 h-6" strokeWidth={1.5} />,
      <TrendingUp key="3" className="w-6 h-6" strokeWidth={1.5} />,
    ][i],
  }));

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
          {content.whyMajd.title1}
          <span className="relative inline-block">
            <span
              className="absolute z-0 rounded-md"
              style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }}
            />
            <span className="relative z-10">{content.whyMajd.title2}</span>
          </span>
        </h2>

        {/* Content: Image left, Features right */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-5 items-center">
          {/* Features list */}
          <div className="flex flex-col gap-3">
            {features.map((feature, i) => {
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
                  {/* Background image for active state */}
                  {isActive && (
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundImage: `url('${featureBgs[i]}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "bottom left",
                        transform: "rotate(180deg)",
                      }}
                    />
                  )}
                  <div
                    className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.2)" : `${color}15`,
                      color: isActive ? "#ffffff" : color,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div className="relative z-10">
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: isActive ? "#ffffff" : "#262626",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "22px",
                        color: isActive ? "rgba(255,255,255,0.8)" : "rgba(38,38,38,0.6)",
                      }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Image side */}
          <div className="flex justify-center items-end relative h-[350px] md:h-[500px] mt-10 md:mt-0 md:-translate-y-8 lg:-translate-y-12">
            {/* Arch background */}
            <div 
              className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] bottom-0 z-0" 
              style={{ 
                backgroundColor: '#fef0f8',
                borderRadius: '200px 200px 24px 24px'
              }} 
            />
            <img
              src="/girll.png"
              alt=""
              className="w-[310px] md:w-[460px] h-auto object-contain relative z-10 transition-transform duration-500 hover:scale-105 origin-bottom"
              loading="lazy"
              style={{ marginBottom: '-2px' }}
            />
          </div>
        </div>

        {/* Bottom subtitle */}
        <p
          className="text-center mt-12 mx-auto"
          style={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: "26px",
            color: "rgba(38,38,38,0.6)",
            maxWidth: "600px",
          }}
        >
          {content.whyMajd.footer}
        </p>
      </div>
    </section>
  );
}
