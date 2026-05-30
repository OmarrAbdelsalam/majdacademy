"use client";
import React, { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../BookingModal";

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
              className="rounded-[32px] overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #f0fce8 0%, #d3ff5f 40%, #c8f550 100%)" }}
            >
              <div
                className="absolute inset-0 z-0 opacity-60"
                style={{ backgroundImage: "url('https://cdn.kodland.org/main-site-v2/banner.png')", backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div className="relative z-10 px-6 py-12 md:px-16 md:py-20 text-center">
                <h2
                  style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#262626", marginBottom: "16px" }}
                >
                  {isArabic ? "ابدأ رحلة ولدك الأكاديمية" : "Start your child's academic journey"}
                </h2>
                <p className="mx-auto mb-8" style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(38,38,38,0.7)", maxWidth: "500px" }}>
                  {isArabic ? "حصة تجريبية مجانية — نقيّم مستواه ونوصيك بأفضل خطة." : "Free trial class — we assess their level and recommend the best plan."}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
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
