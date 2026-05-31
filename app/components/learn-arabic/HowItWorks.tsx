"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import InteractiveSteps from "../InteractiveSteps";

const stepImages = [
  "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png",
  "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png",
  "https://cdn.kodland.org/main-site-v2/en/main/step-3-en.png",
];

export default function HowItWorks() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      heading1: "كيف",
      highlight: "نشتغل؟",
      steps: [
        { title: "تقييم المستوى", description: "نحدد وين الطالب بالظبط ونبدأ من عنده — ما نضيّع وقته بحاجات يعرفها." },
        { title: "خطة مخصصة", description: "نصمم المنهج حسب عمره وهدفه — سواء يبي يتكلم أو يقرأ أو الاثنين." },
        { title: "حصص تفاعلية", description: "يتعلم بالممارسة مش الحفظ — ألعاب، محادثات، وتمارين عملية كل حصة." },
      ],
      stepLabel: "الخطوة",
      cta: "ابدأ الآن",
    },
    en: {
      heading1: "How does it",
      highlight: "work?",
      steps: [
        { title: "Level Assessment", description: "We determine exactly where the student is and start from there — no wasting time on what they already know." },
        { title: "Custom Plan", description: "We design the curriculum based on their age and goal — whether they want to speak, read, or both." },
        { title: "Interactive Sessions", description: "They learn by doing, not memorizing — games, conversations, and practical exercises every session." },
      ],
      stepLabel: "Step",
      cta: "Start now",
    },
  };

  const c = isRTL ? content.ar : content.en;

  const heading = (
    <h2
      className="mb-0"
      style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: "clamp(32px, 5vw, 56px)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: "120%",
        color: "#262626",
      }}
    >
      {c.heading1}{" "}
      <span className="relative inline-block">
        <span className="absolute z-0 rounded-md" style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }} />
        <span className="relative z-10">{c.highlight}</span>
      </span>
    </h2>
  );

  const titleIcon = (
    <img
      src="/icon6.webp"
      alt=""
      className="inline-block w-16 h-16 md:w-20 md:h-20 object-contain aspect-square -my-4"
      style={{ verticalAlign: "middle" }}
    />
  );

  return (
    <InteractiveSteps
      heading={heading}
      steps={c.steps}
      stepLabel={c.stepLabel}
      cta={c.cta}
      images={stepImages}
      modalVariant="learn-arabic"
      titleIcon={titleIcon}
    />
  );
}
