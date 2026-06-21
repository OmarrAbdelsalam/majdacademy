"use client";
import React, { useState } from "react";
import { useLandingContent } from "./useLandingContent";
import BookingModal from "../shared/BookingModal";

export default function GuaranteesSection() {
  const content = useLandingContent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <section id="guarantees" className="py-12 md:py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <div className="relative">
          {/* Character */}
          <div className="flex justify-center mb-[-60px] relative z-20">
            <img src="/gur.webp" alt="" className="w-[140px] sm:w-[180px] h-auto object-contain" />
          </div>

          {/* Main card */}
          <div
            className="rounded-[32px] overflow-hidden relative bg-[#e8347d]"
          >
            {/* SVG Background Waves */}
            <div className="absolute inset-0 z-0">
              <svg
                className="absolute w-full h-full object-cover"
                viewBox="0 0 1000 400"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Base Gradient */}
                  <linearGradient id="guaranteeBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e8347d" />
                    <stop offset="60%" stopColor="#f6428c" />
                    <stop offset="100%" stopColor="#ff66a3" />
                  </linearGradient>
                  {/* Wave 1 Gradient */}
                  <linearGradient id="guaranteeWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                  {/* Wave 2 Gradient */}
                  <linearGradient id="guaranteeWaveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="1000" height="400" fill="url(#guaranteeBaseGrad)" />
                {/* Wave 1 */}
                <path
                  d="M0,140 C300,80 700,240 1000,110 L1000,400 L0,400 Z"
                  fill="url(#guaranteeWaveGrad1)"
                />
                {/* Wave 2 */}
                <path
                  d="M0,230 C350,290 650,180 1000,250 L1000,400 L0,400 Z"
                  fill="url(#guaranteeWaveGrad2)"
                />
              </svg>
            </div>

            <div className="relative z-10 px-6 py-12 md:px-16 md:py-20">
              <div className="text-center mb-12 max-w-[700px] mx-auto">
                <p className="text-[14px] font-bold mb-3 text-white/80">
                  {content.guarantees.cardTitle}
                </p>
                <h2
                  className="text-white"
                  style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", marginBottom: "16px" }}
                >
                  {content.guarantees.title}
                </h2>
                <p className="mx-auto text-white/90" style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", maxWidth: "600px" }}>
                  {content.guarantees.description}
                </p>
              </div>

              {/* Guarantees grid */}
              <div className="flex flex-wrap justify-center gap-4 max-w-[1000px] mx-auto">
                {content.guarantees.items.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:-translate-y-0.5 w-full ${i < 3 ? 'sm:w-[calc(33.333%-11px)]' : 'sm:w-[calc(50%-8px)]'}`}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(239,93,168,0.15)" }}>
                      <svg className="w-4 h-4 text-[#ef5da8]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-semibold text-[#262626]">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-white text-[#f6428c] hover:bg-[#fff0f5] transition-all duration-300 hover:-translate-y-0.5 shadow-lg cursor-pointer"
                  style={{ padding: "20px 48px", fontSize: "16px", fontWeight: 600 }}
                >
                  {content.guarantees.cta}
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
