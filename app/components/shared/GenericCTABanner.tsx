"use client";
import React, { useState } from "react";
import BookingModal from "./BookingModal";

interface GenericCTABannerProps {
  title: string;
  description: string;
  ctaText: string;
  characterImage?: string;
  modalVariant?: "default" | "learn-arabic";
}

export default function GenericCTABanner({
  title,
  description,
  ctaText,
  characterImage = "/gur.webp",
  modalVariant = "default",
}: GenericCTABannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Character */}
            {characterImage && (
              <div className="flex justify-center mb-[-60px] relative z-20">
                <img src={characterImage} alt="" className="w-[140px] sm:w-[180px] h-auto object-contain" />
              </div>
            )}

            {/* Banner */}
            <div className="rounded-[32px] overflow-hidden relative shadow-[0_20px_50px_rgba(246,66,140,0.25)] border border-white/10">
              <div className="absolute inset-0 z-0 pointer-events-none">
                <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="ctaBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e8347d" />
                      <stop offset="60%" stopColor="#f6428c" />
                      <stop offset="100%" stopColor="#ff66a3" />
                    </linearGradient>
                    <linearGradient id="ctaWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="ctaWaveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <rect width="1000" height="300" fill="url(#ctaBaseGrad)" />
                  <path d="M0,140 C300,80 700,240 1000,110 L1000,300 L0,300 Z" fill="url(#ctaWaveGrad1)" />
                  <path d="M0,230 C350,290 650,180 1000,250 L1000,300 L0,300 Z" fill="url(#ctaWaveGrad2)" />
                </svg>
              </div>
              <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 text-center">
                <h2
                  style={{
                    fontSize: "clamp(28px, 4vw, 40px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: "120%",
                    color: "#fff",
                    marginBottom: "16px" }}
                >
                  {title}
                </h2>
                <p
                  className="mx-auto mb-8"
                  style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(255,255,255,0.9)", maxWidth: "500px" }}
                >
                  {description}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-white text-[#ef5da8] hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                  style={{ padding: "20px 48px", fontSize: "16px", fontWeight: 600 }}
                >
                  {ctaText}
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant} />
    </>
  );
}
