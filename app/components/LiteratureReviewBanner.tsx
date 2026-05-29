"use client";
import React from "react";
import { ArrowLeftCircle, Play } from "lucide-react";

export default function LiteratureReviewBanner() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background Video — full bleed, edge to edge */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero3.png"
        >
          <source src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(27,45,79,0.55) 0%, rgba(27,45,79,0.82) 100%)" }}></div>
      </div>

      {/* Content — centered */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 text-center pt-[140px] pb-28">
        {/* Heading */}
        <h1 className="text-[32px] md:text-[50px] lg:text-[60px] font-black text-white mb-7 leading-[1.15] max-w-4xl mx-auto">
          طريق عيالك{" "}
          <span style={{ color: "#FFC843" }}>للمَجْد</span>{" "}
          يبدأ من هنيه.
          <br />
          تفوّق بدون ضغط.
        </h1>

        {/* Subtitle */}
        <p className="text-[16px] md:text-[20px] font-medium leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          دروس أونلاين بالمنهج الإماراتي مع معلمين متخصصين يحتوون عيالكم ويوصلونهم للتفوق وهم مرتاحين ومستمتعين.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            className="flex items-center gap-2 text-[#1B2D4F] font-bold text-[15px] px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1"
            style={{ background: "#FFC843", boxShadow: "0 8px 30px rgba(255,200,67,0.3)" }}
          >
            <ArrowLeftCircle className="w-5 h-5" strokeWidth={2} />
            <span>احجز حصة مجانية</span>
          </button>
          <button
            className="flex items-center gap-2 text-white font-bold text-[14px] px-7 py-4 rounded-full transition-all duration-300 hover:-translate-y-1"
            style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)" }}
          >
            <Play className="w-4 h-4" fill="white" />
            <span>شوف كيف ندرّس</span>
          </button>
        </div>
      </div>
      {/* Bottom curve SVG */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <svg className="block w-full" viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: "60px" }}>
          <path d="M0,60 L0,40 Q720,0 1440,40 L1440,60 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
