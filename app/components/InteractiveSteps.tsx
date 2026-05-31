"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "./BookingModal";

interface InteractiveStepsProps {
  heading: React.ReactNode;
  steps: { title: string; description: string }[];
  stepLabel: string;
  cta: string;
  images: string[];
  modalVariant?: "default" | "learn-arabic" | "landing2" | "landing3";
  showArrowsDesktop?: boolean;
  titleIcon?: React.ReactNode;
}

export default function InteractiveSteps({
  heading,
  steps,
  stepLabel,
  cta,
  images,
  modalVariant = "default",
  showArrowsDesktop = false,
  titleIcon,
}: InteractiveStepsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          {heading}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-14 items-center">
          {/* Left — Step content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <p className="mb-3" style={{ fontSize: "14px", fontWeight: 600, color: "#ef5da8", letterSpacing: "0.02em" }}>
                  {stepLabel} {activeStep + 1} / {steps.length}
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
                  {steps[activeStep].title}
                  {titleIcon && <span className="inline-block mr-2">{titleIcon}</span>}
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
                  {steps[activeStep].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
              style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
            >
              {cta}
            </button>

            {/* Step indicators */}
            <div className="flex items-center gap-3 mt-10">
              {steps.map((_, i) => (
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

          {/* Right — Image with animation */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="rounded-2xl overflow-hidden shadow-2xl bg-gray-50 touch-pan-y cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  const isRTL = document.documentElement.dir === 'rtl';
                  if ((offset.x < -50 && !isRTL) || (offset.x > 50 && isRTL)) {
                    setActiveStep(activeStep < steps.length - 1 ? activeStep + 1 : 0);
                  } else if ((offset.x > 50 && !isRTL) || (offset.x < -50 && isRTL)) {
                    setActiveStep(activeStep > 0 ? activeStep - 1 : steps.length - 1);
                  }
                }}
              >
                <img
                  src={images[activeStep] || images[0]}
                  alt={steps[activeStep].title}
                  className="w-full h-auto pointer-events-none"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {showArrowsDesktop && (
              <>
                <button
                  onClick={() => setActiveStep(activeStep > 0 ? activeStep - 1 : steps.length - 1)}
                  className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg hidden sm:flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#262626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveStep(activeStep < steps.length - 1 ? activeStep + 1 : 0)}
                  className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg hidden sm:flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-5 h-5 text-[#262626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant as any} />
    </section>
  );
}
