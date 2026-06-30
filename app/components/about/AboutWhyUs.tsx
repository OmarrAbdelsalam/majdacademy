"use client";
import React, { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../shared/BookingModal";

export default function AboutWhyUs() {
  const { isRTL } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = {
    ar: {
      heading: "ليش",
      highlight: "مَجد؟",
      items: [
        "معلمون متخصصون بالمنهج الإماراتي",
        "حصص فردية ومجموعات صغيرة",
        "متابعة مستمرة مع أولياء الأمور",
        "تقوية في النحو والإملاء والتعبير الكتابي",
        "مرونة في المواعيد",
        "تقارير أداء دورية",
      ],
      cta: "احجز حصة مجانية",
    },
    en: {
      heading: "Why",
      highlight: "Majd?",
      items: [
        "Teachers specialized in the UAE curriculum",
        "Individual and small group sessions",
        "Continuous follow-up with parents",
        "Grammar, spelling & writing support",
        "Flexible scheduling",
        "Regular performance reports",
      ],
      cta: "Book a free class",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2
            className="text-center mb-8 md:mb-12"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#262626" }}
          >
            {c.heading}{" "}{c.highlight}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {c.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[32px] p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "#f8f9fa" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-highlight)" }}>
                  <span className="text-[12px] font-bold text-[#262626]">0{i + 1}</span>
                </div>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#262626" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] transition-all duration-300 hover:-translate-y-0.5"
              style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
            >
              {c.cta}
            </button>
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
