"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLandingContent } from "./useLandingContent";
import BookingModal from "./BookingModal";

export default function KodlandHero() {
  const content = useLandingContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pt-[60px] pb-16">
      {/* ═══ Background: White + Ellipse Image ═══ */}
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

      {/* ═══ Floating Kid Images — Left Side (bottom-left like Kodland) ═══ */}
      <div className="hidden lg:block absolute top-[35%] z-10" style={{ left: "0", right: "auto" }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <img
            src="/boy.png"
            alt=""
            className="block"
            style={{ width: "308px" }}
          />
        </motion.div>
      </div>

      {/* ═══ Floating Kid Images — Right Top ═══ */}
      <div className="hidden lg:block absolute right-0 top-[20%] z-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative"
        >
          <img
            src="/girl.png"
            alt=""
            className="block"
            style={{ width: "220px" }}
          />
        </motion.div>
      </div>

      {/* ═══ Floating Kid Image — Right Bottom (kid-bottom like Kodland Jack card) ═══ */}
      <div className="hidden lg:block absolute right-[3%] bottom-[-5%] z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative"
        >
          <img
            src="https://cdn.kodland.org/main-site-v2/en/main/kid-bottom.png"
            alt=""
            className="block"
            style={{ width: "280px" }}
          />
        </motion.div>
      </div>

      {/* ═══ Main Content — Center ═══ */}
      <div className="relative z-20 max-w-[800px] mx-auto px-4 sm:px-6 text-center mt-16 sm:mt-24 md:mt-32">
        {/* Main Heading */}
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
          {content.hero.line1}
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
              <span className="relative z-10 text-white">
                {content.hero.line2}
              </span>
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
            color: "#262626",
            textAlign: "center",
          }}
        >
          {content.hero.subtitle1}
          {content.hero.subtitle2 && <><br />{content.hero.subtitle2}</>}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-3 rounded-[60px] bg-[#262626] text-white hover:bg-[#333] transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
            style={{
              padding: "clamp(16px, 3vw, 24px) clamp(28px, 5vw, 44px)",
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 500,
              letterSpacing: "-0.2px",
              lineHeight: "28px",
            }}
          >
            {content.hero.cta}
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Trust Badges — logos only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-20 flex items-center justify-center gap-5 sm:gap-8"
        >
          <img
            src="https://www.moe.gov.ae/Site%20assets/DLS2/images/moe-logo-ar.svg"
            alt=""
            className="h-12 sm:h-16 w-auto"
          />
          <img
            src="https://media.zoom.com/images/assets/logo-zoom%402x.png/Zz00MjQ0MDQzNmM2YWUxMWYwYjFmYzBlNzMxY2I1ZWM4YQ=="
            alt=""
            className="h-6 sm:h-8 w-auto"
          />
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
