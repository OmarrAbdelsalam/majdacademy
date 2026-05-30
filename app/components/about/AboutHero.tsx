"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";

export default function AboutHero() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "من نحن",
      highlight: "مَجد",
      subtitle: "تعرّف على مَجد أكاديمي وليش آلاف العائلات يثقون فينا",
      intro: "مَجد أكاديمي هي منصة تعليمية إماراتية متخصصة في تقديم دروس أونلاين عالية الجودة لطلاب المراحل من الصف الأول حتى الثاني عشر، وفقاً للمنهج الإماراتي المعتمد من وزارة التربية والتعليم.",
    },
    en: {
      title: "About",
      highlight: "Majd",
      subtitle: "Get to know Majd Academy and why thousands of families trust us",
      intro: "Majd Academy is a UAE-based educational platform specializing in high-quality online tutoring for students from Grade 1 to 12, following the UAE Ministry of Education curriculum.",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-[60px] pb-16">
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
      <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6 text-center mt-16 sm:mt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Baloo Bhaijaan 2', var(--font-baloo), sans-serif",
            fontSize: "clamp(36px, 8vw, 80px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: "130%",
            color: "#262626",
          }}
        >
          {c.title}{" "}
          <span className="relative inline-block">
            <span className="absolute z-0" style={{ background: "#d3ff5f", borderRadius: "14px 20px 18px 22px", top: "-4px", bottom: "-4px", left: "-12px", right: "-12px" }} />
            <span className="relative z-10">{c.highlight}</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6"
          style={{ fontSize: "clamp(15px, 3.5vw, 20px)", fontWeight: 500, lineHeight: "1.7", maxWidth: "700px", color: "rgba(38,38,38,0.7)" }}
        >
          {c.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8"
          style={{ fontSize: "18px", fontWeight: 500, lineHeight: "32px", maxWidth: "750px", color: "rgba(38,38,38,0.6)" }}
        >
          {c.intro}
        </motion.p>
      </div>
    </section>
  );
}
