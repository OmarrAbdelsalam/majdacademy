"use client";
import React, { useState } from "react";
import { BookOpen, MessageCircle, FileText, Globe } from "lucide-react";
import { useLang } from "../../i18n/LangContext";

const featureColors = ["#ef5da8", "#2563eb", "#f97316", "#2563eb"];
const featureBgs = [
  "https://cdn.kodland.org/main-site-v2/bg-pink.png",
  "https://cdn.kodland.org/main-site-v2/bg-blue.png",
  "https://cdn.kodland.org/main-site-v2/bg-orange.png",
  "https://cdn.kodland.org/main-site-v2/bg-blue.png",
];

export default function WhatTheyLearn() {
  const { isRTL } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);

  const content = {
    ar: {
      heading: "إيش",
      highlight: "بيتعلمون؟",
      features: [
        { title: "القراءة والكتابة", desc: "الحروف، التشكيل، ربط الكلمات — من الصفر لحد ما يقرأ ويكتب بطلاقة.", icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "المحادثة اليومية", desc: "جمل عملية ومواقف حقيقية — يتعلم يتكلم عربي في حياته اليومية.", icon: <MessageCircle className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "القواعد الأساسية", desc: "بأسلوب مبسط بدون تعقيد — يفهم بنية الجملة ويستخدمها صح.", icon: <FileText className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "الثقافة العربية", desc: "عادات، تعبيرات، أمثال — يفهم اللغة في سياقها الثقافي.", icon: <Globe className="w-6 h-6" strokeWidth={1.5} /> },
      ],
    },
    en: {
      heading: "What will they",
      highlight: "learn?",
      features: [
        { title: "Reading & Writing", desc: "Letters, diacritics, word formation — from zero to fluent reading and writing.", icon: <BookOpen className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "Daily Conversation", desc: "Practical phrases and real situations — learn to speak Arabic in everyday life.", icon: <MessageCircle className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "Basic Grammar", desc: "Simplified without complexity — understand sentence structure and use it correctly.", icon: <FileText className="w-6 h-6" strokeWidth={1.5} /> },
        { title: "Arabic Culture", desc: "Customs, expressions, proverbs — understand the language in its cultural context.", icon: <Globe className="w-6 h-6" strokeWidth={1.5} /> },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

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
          {c.heading}{" "}
          <span className="relative inline-block">
            <span className="absolute z-0 rounded-md" style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }} />
            <span className="relative z-10">{c.highlight}</span>
          </span>
        </h2>

        {/* Content */}
        <div className="max-w-[800px] mx-auto">
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


        </div>
      </div>
    </section>
  );
}
