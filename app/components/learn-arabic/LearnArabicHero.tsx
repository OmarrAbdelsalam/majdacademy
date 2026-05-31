"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../BookingModal";

export default function LearnArabicHero() {
  const { isRTL } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = {
    ar: {
      line1: "تعلم العربية كأهلها",
      line2: "من الصفر",
      subtitle: "كورس تفاعلي لغير الناطقين بالعربية — قراءة وكتابة ومحادثة، لأي عمر وبدون ارتباط بمنهج محدد.",
      cta: "احجز حصة تجريبية",
    },
    en: {
      line1: "Teach your child Arabic",
      line2: "from scratch",
      subtitle: "An interactive course for non-Arabic speakers — reading, writing, and conversation, for any age without curriculum restrictions.",
      cta: "Book a trial class",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <>
      <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center sm:justify-start overflow-hidden pt-[60px] pb-16">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-white" />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: "url('https://cdn.kodland.org/main-site-v2/bg-ellipse.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center -10vh",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Content */}
        <div className="relative z-20 max-w-[800px] mx-auto px-4 sm:px-6 text-center mt-0 sm:mt-24 md:mt-32">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
            style={{
              fontFamily: "'Baloo Bhaijaan 2', var(--font-baloo), sans-serif",
              fontSize: "clamp(36px, 8vw, 90px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "130%",
              color: "#262626",
              textAlign: "center",
            }}
          >
            {c.line1}
            <br />
            <span className="flex justify-center mt-2">
              <span className="relative inline-block whitespace-nowrap" style={{ fontSize: "clamp(26px, 6vw, 72px)", letterSpacing: "0.04em" }}>
                <span
                  className="absolute z-0"
                  style={{
                    background: "#ef5da8",
                    borderRadius: "14px 20px 18px 22px",
                    top: "-4px",
                    bottom: "-4px",
                    left: "-12px",
                    right: "-12px",
                    boxShadow: "0 4px 20px rgba(239,93,168,0.3)",
                  }}
                />
                <span className="relative z-10 text-white">{c.line2}</span>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto px-2"
            style={{
              fontSize: "clamp(15px, 3.5vw, 20px)",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: "1.7",
              marginTop: "clamp(20px, 5vw, 40px)",
              marginBottom: "0",
              maxWidth: "700px",
              color: "rgba(38,38,38,0.7)",
              textAlign: "center",
            }}
          >
            {c.subtitle}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
              style={{
                padding: "clamp(16px, 3vw, 24px) clamp(28px, 5vw, 44px)",
                fontSize: "clamp(16px, 3vw, 20px)",
                fontWeight: 500,
              }}
            >
              {c.cta}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant="learn-arabic" />
    </>
  );
}
