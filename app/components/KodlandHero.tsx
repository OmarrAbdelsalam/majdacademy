"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLandingContent } from "./useLandingContent";
import BookingModal from "./BookingModal";

export default function KodlandHero() {
  const content = useLandingContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center lg:justify-start overflow-hidden pt-[80px] lg:pt-[60px] pb-16">
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
      <div className="hidden sm:block absolute bottom-0 xl:bottom-auto xl:top-[35%] z-0 xl:z-10 w-[140px] sm:w-[160px] xl:w-auto opacity-70 xl:opacity-100 pointer-events-none" style={{ left: "0", right: "auto" }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <Image
            src="/boy.png"
            alt=""
            role="presentation"
            width={308}
            height={400}
            className="block w-full h-auto"
            priority
          />
        </motion.div>
      </div>

      {/* ═══ Floating Kid Images — Right Top ═══ */}
      <div className="hidden sm:block absolute bottom-[-12px] xl:bottom-auto xl:top-[20%] right-[-10px] xl:right-0 z-0 xl:z-10 w-[130px] sm:w-[170px] xl:w-[220px] opacity-70 xl:opacity-100 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative"
        >
          <Image
            src="/girl.png"
            alt=""
            role="presentation"
            width={220}
            height={300}
            className="block w-full h-auto"
            priority
          />
        </motion.div>
      </div>

      {/* ═══ Floating Kid Image — Right Bottom (kid-bottom like Kodland Jack card) ═══ */}
      <div className="hidden xl:block absolute right-[3%] bottom-[-5%] z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative"
        >
          <Image
            src="https://cdn.kodland.org/main-site-v2/en/main/kid-bottom.png"
            alt=""
            role="presentation"
            width={280}
            height={360}
            className="block"
          />
        </motion.div>
      </div>



      {/* ═══ Main Content — Center ═══ */}
      <div className="relative z-20 max-w-[90vw] mx-auto px-2 sm:px-6 text-center mt-0 lg:mt-32 flex flex-col items-center justify-center">
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
          <span className="flex justify-center mt-4 px-2">
            <span className="relative inline-block whitespace-normal sm:whitespace-nowrap" style={{ fontSize: "clamp(26px, 6vw, 64px)", letterSpacing: "0.04em", lineHeight: "1.4" }}>
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
          <Image
            src="https://www.moe.gov.ae/Site%20assets/DLS2/images/moe-logo-ar.svg"
            alt=""
            role="presentation"
            width={120}
            height={64}
            className="h-12 sm:h-16 w-auto"
            unoptimized
          />
          <Image
            src="https://media.zoom.com/images/assets/logo-zoom%402x.png/Zz00MjQ0MDQzNmM2YWUxMWYwYjFmYzBlNzMxY2I1ZWM4YQ=="
            alt=""
            role="presentation"
            width={100}
            height={32}
            className="h-6 sm:h-8 w-auto"
            unoptimized
          />
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
