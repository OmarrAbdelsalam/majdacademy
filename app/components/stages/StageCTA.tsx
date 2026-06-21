"use client";
import React, { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../shared/BookingModal";

export default function StageCTA() {
  const { lang } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isArabic = lang === "ar";

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <div className="relative">
            <div className="flex justify-center mb-[-60px] relative z-20">
              <img src="/gur.webp" alt="" className="w-[140px] sm:w-[180px] h-auto object-contain" />
            </div>
            <div
              className="rounded-[32px] overflow-hidden relative shadow-xl shadow-pink-900/20"
              style={{ boxShadow: "0 20px 50px rgba(246,66,140,0.25)" }}
            >
              {/* SVG background effect */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="ctaBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e8347d" />
                      <stop offset="60%" stopColor="#f6428c" />
                      <stop offset="100%" stopColor="#ff66a3" />
                    </linearGradient>
                  </defs>
                  <path d="M0,0 L1000,0 L1000,300 L0,300 Z" fill="url(#ctaBaseGrad)" />
                  <path d="M0,300 C300,200 700,350 1000,250 L1000,300 L0,300 Z" fill="rgba(255,255,255,0.08)" />
                  <path d="M0,300 C400,250 800,200 1000,280 L1000,300 L0,300 Z" fill="rgba(255,255,255,0.05)" />
                </svg>
              </div>
              <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 text-center">
                <h2
                  style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#fff", marginBottom: "16px" }}
                >
                  {isArabic ? "ابدأ رحلة طفلك الأكاديمية" : "Start your child's academic journey"}
                </h2>
                <p className="mx-auto mb-8" style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(255,255,255,0.9)", maxWidth: "500px" }}>
                  {isArabic ? "حصة تجريبية مجانية — نقيّم مستواه ونوصيك بأفضل خطة." : "Free trial class — we assess their level and recommend the best plan."}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-white text-[#ef5da8] hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                  style={{ padding: "20px 48px", fontSize: "16px", fontWeight: 600 }}
                >
                  {isArabic ? "احجز الحصة المجانية" : "Book the free class"}
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
