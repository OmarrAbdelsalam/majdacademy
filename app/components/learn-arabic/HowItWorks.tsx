"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../BookingModal";

const stepImages = [
  "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png",
  "https://cdn.kodland.org/main-site-v2/en/main/step-2-en.png",
  "https://cdn.kodland.org/main-site-v2/en/main/step-3-en.png",
];

export default function HowItWorks() {
  const { isRTL } = useLang();
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = {
    ar: {
      heading1: "كيف",
      highlight: "نشتغل؟",
      steps: [
        { title: "تقييم المستوى", desc: "نحدد وين الطالب بالظبط ونبدأ من عنده — ما نضيّع وقته بحاجات يعرفها." },
        { title: "خطة مخصصة", desc: "نصمم المنهج حسب عمره وهدفه — سواء يبي يتكلم أو يقرأ أو الاثنين." },
        { title: "حصص تفاعلية", desc: "يتعلم بالممارسة مش الحفظ — ألعاب، محادثات، وتمارين عملية كل حصة." },
      ],
      stepLabel: "الخطوة",
      cta: "ابدأ الآن",
    },
    en: {
      heading1: "How does it",
      highlight: "work?",
      steps: [
        { title: "Level Assessment", desc: "We determine exactly where the student is and start from there — no wasting time on what they already know." },
        { title: "Custom Plan", desc: "We design the curriculum based on their age and goal — whether they want to speak, read, or both." },
        { title: "Interactive Sessions", desc: "They learn by doing, not memorizing — games, conversations, and practical exercises every session." },
      ],
      stepLabel: "Step",
      cta: "Start now",
    },
  };

  const c = isRTL ? content.ar : content.en;

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
            {c.heading1}{" "}
            <span className="relative inline-block">
              <span className="absolute z-0 rounded-md" style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }} />
              <span className="relative z-10">{c.highlight}</span>
            </span>
          </h2>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-14 items-center">
            {/* Steps */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <p className="mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "#ef5da8" }}>
                    {c.stepLabel} {activeStep + 1} / {c.steps.length}
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      fontSize: "clamp(24px, 3vw, 34px)",
                      fontWeight: 700,
                      color: "#262626",
                      lineHeight: "130%",
                      marginBottom: "16px",
                    }}
                  >
                    {c.steps[activeStep].title}
                  </h3>
                  <p
                    style={{
                      fontSize: "17px",
                      fontWeight: 500,
                      lineHeight: "30px",
                      color: "rgba(38,38,38,0.65)",
                      marginBottom: "32px",
                      maxWidth: "420px",
                    }}
                  >
                    {c.steps[activeStep].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
                style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
              >
                {c.cta}
              </button>

              {/* Step indicators */}
              <div className="flex items-center gap-3 mt-10">
                {c.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className="transition-all duration-300"
                    style={{
                      width: activeStep === i ? "32px" : "10px",
                      height: "10px",
                      borderRadius: "5px",
                      background: activeStep === i ? "#262626" : "#e0e0e0",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="rounded-2xl overflow-hidden shadow-2xl bg-gray-50"
                >
                  <img
                    src={stepImages[activeStep]}
                    alt={c.steps[activeStep].title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant="learn-arabic" />
    </>
  );
}
