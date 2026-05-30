"use client";
import React, { useState } from "react";
import { useLandingContent } from "./useLandingContent";
import BookingModal from "./BookingModal";

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
            className="rounded-[32px] overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #f0fce8 0%, #d3ff5f 40%, #c8f550 100%)" }}
          >
            <div
              className="absolute inset-0 z-0 opacity-60"
              style={{ backgroundImage: "url('https://cdn.kodland.org/main-site-v2/banner.png')", backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="relative z-10 px-6 py-12 md:px-16 md:py-20">
              <div className="text-center mb-12 max-w-[700px] mx-auto">
                <p className="text-[14px] font-bold mb-3" style={{ color: "rgba(38,38,38,0.5)" }}>
                  {content.guarantees.cardTitle}
                </p>
                <h2
                  style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#262626", marginBottom: "20px" }}
                >
                  {content.guarantees.title}
                </h2>
                <p className="mx-auto" style={{ fontSize: "18px", fontWeight: 500, lineHeight: "28px", color: "rgba(38,38,38,0.7)", maxWidth: "600px" }}>
                  {content.guarantees.description}
                </p>
              </div>

              {/* Guarantees grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-[1000px] mx-auto">
                {content.guarantees.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:-translate-y-0.5">
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
                  className="inline-flex items-center justify-center gap-2 rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5 shadow-lg cursor-pointer"
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
