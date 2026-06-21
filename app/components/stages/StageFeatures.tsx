"use client";
import React from "react";
import { BookOpen, PenTool, Brain, Sparkles } from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import { stagesContent, StageKey } from "./stagesContent";
import InteractiveFeatureList from "../shared/InteractiveFeatureList";

export default function StageFeatures({ stage }: { stage: StageKey }) {
  const { lang } = useLang();
  const c = stagesContent[lang as "ar" | "en"][stage];
  const isArabic = lang === "ar";

  const features = c.features.map((feature, i) => ({
    ...feature,
    icon: [
      <BookOpen key="1" className="w-6 h-6" strokeWidth={1.5} />,
      <PenTool key="2" className="w-6 h-6" strokeWidth={1.5} />,
      <Brain key="3" className="w-6 h-6" strokeWidth={1.5} />,
      <Sparkles key="4" className="w-6 h-6" strokeWidth={1.5} />,
    ][i],
  }));

  const heading = (
    <h2
      className="text-center mb-8 md:mb-12"
      style={{
        fontSize: "clamp(28px, 4vw, 40px)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: "120%",
        color: "#262626" }}
    >
      {isArabic ? "ماذا يتعلمون؟" : "What they learn"}
    </h2>
  );

  const imageContent = (
    <div className="flex justify-center items-end relative h-[350px] md:h-[500px] mt-10 md:mt-0 md:-translate-y-8 lg:-translate-y-12">
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
  );

  return (
    <InteractiveFeatureList
      heading={heading}
      features={features}
      imageContent={imageContent}
    />
  );
}
