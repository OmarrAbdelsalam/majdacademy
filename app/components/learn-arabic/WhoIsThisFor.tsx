"use client";
import React, { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../BookingModal";

const cardColors = ["#fff8f0", "#fef0f8", "#eefbf3"];
const cardImages = ["/icon1.webp", "/icon2.webp", "/icon3.webp"];

export default function WhoIsThisFor() {
  const { isRTL } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = {
    ar: {
      heading: "الكورس مصمم",
      highlight: "لمين؟",
      cards: [
        { title: "أطفال عرب في الخارج", desc: "يحافظون على لغتهم الأم ويتعلمون القراءة والكتابة بالعربي حتى لو ما يستخدمونها يومياً.", cta: "احجز حصة" },
        { title: "أطفال أجانب حول العالم", desc: "يتعلمون العربية للمدرسة أو عشان يتواصلون مع أصحابهم ويفهمون البيئة اللي حولهم.", cta: "احجز حصة" },
        { title: "كبار يبون يتعلمون العربية", desc: "للعمل أو الثقافة أو لأنهم يحبون اللغة — نعلّمهم من الصفر بأسلوب عملي.", cta: "احجز حصة" },
      ],
    },
    en: {
      heading: "Who is this",
      highlight: "course for?",
      cards: [
        { title: "Arab kids abroad", desc: "Maintain their mother tongue and learn to read and write in Arabic even if they don't use it daily.", cta: "Book a class" },
        { title: "Expat kids in the UAE", desc: "Learn Arabic for school or to communicate with friends and understand the environment around them.", cta: "Book a class" },
        { title: "Adults learning Arabic", desc: "For work, culture, or passion — we teach from scratch with a practical approach.", cta: "Book a class" },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          {/* Heading */}
          <h2
            className="text-center mb-16"
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: "120%",
              color: "#262626",
            }}
          >
            {c.heading}{" "}
            <span className="relative inline-block">
              <span className="absolute z-0 rounded-md" style={{ background: "#d3ff5f", inset: "-2px -8px", borderRadius: "8px" }} />
              <span className="relative z-10">{c.highlight}</span>
            </span>
          </h2>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {c.cards.map((card, i) => (
              <div
                key={i}
                className="rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer"
                style={{ background: cardColors[i] }}
              >
                <div>
                  <div className="flex justify-center mb-6 overflow-hidden h-[160px]">
                    <img
                      src={cardImages[i]}
                      alt={card.title}
                      className="w-[240px] h-[240px] object-contain -my-[40px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <h3
                    className="mb-3"
                    style={{ fontFamily: "'Cairo', sans-serif", fontSize: "24px", fontWeight: 800, color: "#262626" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mb-5"
                    style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}
                  >
                    {card.desc}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-300"
                  >
                    {card.cta}
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant="learn-arabic" />
    </>
  );
}
