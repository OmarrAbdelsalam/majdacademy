"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "../shared/BookingModal";

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
        <div className="max-w-[700px] mx-auto w-full relative">
          <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
                  if ((offset.x < -50 && !isRTL) || (offset.x > 50 && isRTL)) {
                    setActiveStep(activeStep < steps.length - 1 ? activeStep + 1 : 0);
                  } else if ((offset.x > 50 && !isRTL) || (offset.x < -50 && isRTL)) {
                    setActiveStep(activeStep > 0 ? activeStep - 1 : steps.length - 1);
                  }
                }}
              >
                <div className="p-8 md:p-12 pb-0 flex-1">
                  <div className="text-[#ef5da8] font-bold text-sm md:text-base mb-4 text-start">
                    {stepLabel} {activeStep + 1} / {steps.length}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-extrabold text-[#262626] mb-5 text-start" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    {steps[activeStep].title}
                    {titleIcon && <span className="inline-block mr-2">{titleIcon}</span>}
                  </h3>
                  
                  <p className="text-gray-600 md:text-lg leading-relaxed mb-8 text-start font-medium">
                    {steps[activeStep].description}
                  </p>
                  
                  <div className="flex flex-row items-center justify-between gap-6 mb-10">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex justify-center items-center px-10 py-4 rounded-[60px] bg-[#262626] text-white font-bold text-lg hover:bg-[#333] transition-colors"
                    >
                      {cta}
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-2">
                      {steps.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveStep(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            activeStep === idx ? "w-8 bg-[#262626]" : "w-2.5 bg-gray-200 hover:bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          {showArrowsDesktop && (
            <>
              <button
                onClick={() => setActiveStep(activeStep > 0 ? activeStep - 1 : steps.length - 1)}
                className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 z-10 text-[#262626]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveStep(activeStep < steps.length - 1 ? activeStep + 1 : 0)}
                className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 z-10 text-[#262626]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant as any} />
    </section>
  );
}
