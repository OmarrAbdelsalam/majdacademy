"use client";
import React, { useState } from "react";

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface InteractiveFeatureListProps {
  heading: React.ReactNode;
  features: Feature[];
  imageContent: React.ReactNode;
  bottomText?: React.ReactNode;
}

const featureColors = ["#ef5da8", "#2563eb", "#f97316", "#2563eb", "#8b5cf6", "#14b8a6"];

export default function InteractiveFeatureList({
  heading,
  features,
  imageContent,
  bottomText,
}: InteractiveFeatureListProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          {heading}
        </div>

        {/* Content: Image left (RTL), Features right (RTL) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-5 items-center">
          {/* Features list */}
          <div className="flex flex-col gap-3">
            {features.map((feature, i) => {
              const isActive = activeIndex === i;
              const color = featureColors[i % featureColors.length];
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative flex items-start gap-4 p-6 rounded-[32px] transition-all duration-300 text-start w-full overflow-hidden ${
                    isActive ? "shadow-lg" : "bg-[#f8f9fa] hover:-translate-y-0.5"
                  }`}
                >
                  {/* SVG Background Waves for active state */}
                  {isActive && (
                    <div className="absolute inset-0 z-0">
                      <svg
                        className="absolute w-full h-full object-cover"
                        viewBox="0 0 1000 400"
                        preserveAspectRatio="xMidYMid slice"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id={`featureBaseGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            {(i % 4 === 0) && (
                              <>
                                <stop offset="0%" stopColor="#e8347d" />
                                <stop offset="60%" stopColor="#f6428c" />
                                <stop offset="100%" stopColor="#ff66a3" />
                              </>
                            )}
                            {(i % 4 === 1 || i % 4 === 3) && (
                              <>
                                <stop offset="0%" stopColor="#1d4ed8" />
                                <stop offset="60%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#93c5fd" />
                              </>
                            )}
                            {(i % 4 === 2) && (
                              <>
                                <stop offset="0%" stopColor="#c2410c" />
                                <stop offset="60%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#fdba74" />
                              </>
                            )}
                          </linearGradient>
                          <linearGradient id={`featureWaveGrad1-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id={`featureWaveGrad2-${i}`} x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <rect width="1000" height="400" fill={`url(#featureBaseGrad-${i})`} />
                        <path
                          d="M0,140 C300,80 700,240 1000,110 L1000,400 L0,400 Z"
                          fill={`url(#featureWaveGrad1-${i})`}
                        />
                        <path
                          d="M0,230 C350,290 650,180 1000,250 L1000,400 L0,400 Z"
                          fill={`url(#featureWaveGrad2-${i})`}
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.2)" : `${color}15`,
                      color: isActive ? "#ffffff" : color }}
                  >
                    {feature.icon}
                  </div>
                  <div className="relative z-10">
                    <h3
                      className="mb-1"
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        color: isActive ? "#ffffff" : "#262626" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "22px",
                        color: isActive ? "rgba(255,255,255,0.8)" : "rgba(38,38,38,0.6)" }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Image side */}
          {imageContent}
        </div>

        {/* Bottom subtitle */}
        {bottomText && (
          <p
            className="text-center mt-12 mx-auto"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              lineHeight: "26px",
              color: "rgba(38,38,38,0.6)",
              maxWidth: "600px" }}
          >
            {bottomText}
          </p>
        )}
      </div>
    </section>
  );
}
