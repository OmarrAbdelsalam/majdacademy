"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";

export default function AboutValues() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "قيمنا",
      items: ["الجودة — معلمون متخصصون ومناهج معتمدة", "الأمان — بيئة تعليمية آمنة وموثوقة", "التميّز — نسعى دائماً لتقديم الأفضل", "الاهتمام — نهتم بكل طالب كأنه ولدنا"],
    },
    en: {
      title: "Our Values",
      items: ["Quality — Specialized teachers and approved curricula", "Safety — A safe and trusted learning environment", "Excellence — We always strive to deliver the best", "Care — We care for every student like our own"],
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="relative">
          {/* Character */}
          <div className="flex justify-center mb-[-60px] relative z-20">
            <img src="/gur.webp" alt="" className="w-[140px] sm:w-[180px] h-auto object-contain" />
          </div>

          {/* Banner */}
          <div
            className="rounded-[32px] overflow-hidden relative bg-cover bg-center"
            style={{ backgroundImage: "url('https://cdn.kodland.org/main-site-v2/bg-pink.png')" }}
          >
            <div className="relative z-10 px-6 py-12 md:px-16 md:py-20">
              <div className="text-center mb-8 md:mb-12">
                <h2
                  style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#fff" }}
                >
                  {c.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-[800px] mx-auto">
                {c.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:-translate-y-0.5"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
