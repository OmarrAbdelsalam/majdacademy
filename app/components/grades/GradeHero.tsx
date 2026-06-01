"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "../../i18n/LangContext";
import { gradesContent } from "./gradesContent";
import BookingModal from "../shared/BookingModal";

export default function GradeHero({ grade }: { grade: number }) {
  const { isRTL, lang } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const c = gradesContent[lang as "ar" | "en"][grade];

  if (!c) return null;

  return (
    <>
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-[60px] pb-16">
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

        <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6 text-center mt-16 sm:mt-24">


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as const }}
          >
            <span
              className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-6"
              style={{ background: "#d3ff5f", color: "#262626" }}
            >
              {c.stageName}
            </span>
            <h1
              style={{
                fontFamily: "'Baloo Bhaijaan 2', var(--font-baloo), sans-serif",
                fontSize: "clamp(36px, 8vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: "130%",
                color: "#262626",
              }}
            >
              {c.name}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] as const }}
            className="mx-auto mt-6"
            style={{ fontSize: "clamp(15px, 3.5vw, 20px)", fontWeight: 500, lineHeight: "1.7", maxWidth: "700px", color: "rgba(38,38,38,0.7)" }}
          >
            {c.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0, 0, 0.2, 1] as const }}
            className="mt-8"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
              style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
            >
              {c.cta}
            </button>
          </motion.div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
