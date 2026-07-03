"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import BookingModal from "./BookingModal";

interface GenericHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  ctaVariant?: "default" | "learn-arabic";
}

export default function GenericHero({ badge, title, subtitle, cta, ctaVariant }: GenericHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-[60px] pb-16">
        <div className="absolute inset-0 z-0" style={{ backgroundColor: "#ffffff" }} />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: "linear-gradient(180deg, #fce7f3 0%, #f9a8d4 40%, #ffffff 100%)"
          }}
        />

        <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6 text-center mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {badge && (
              <span
                className="inline-block text-[13px] font-bold px-4 py-2 rounded-full mb-6 text-white"
                style={{ background: "var(--color-highlight)" }}
              >
                {badge}
              </span>
            )}
            <h1
              style={{
                fontSize: "clamp(36px, 8vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: "130%",
                color: "#262626"
              }}
            >
              {title}
            </h1>
          </motion.div>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto mt-6"
              style={{ fontSize: "clamp(15px, 3.5vw, 20px)", fontWeight: 500, lineHeight: "1.7", maxWidth: "700px", color: "rgba(38, 38, 38, 0.8)" }}
            >
              {subtitle}
            </motion.p>
          )}

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
                style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
              >
                {cta}
              </button>
            </motion.div>
          )}
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={ctaVariant} />
    </>
  );
}
