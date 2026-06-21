"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";

const cardColors = ["#fff8f0", "#fef0f8"];
const cardImages = ["/wi.webp", "/mi.webp"];

export default function MissionVision() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      heading: "رسالتنا",
      highlight: "ورؤيتنا",
      cards: [
        { title: "رسالتنا", desc: "نؤمن أن كل طفل يستحق تعليماً يفهمه ويحفّزه. نسعى لتوفير بيئة تعليمية آمنة وداعمة تُمكّن الطلاب من تحقيق أقصى إمكاناتهم الأكاديمية مع بناء ثقتهم بأنفسهم." },
        { title: "رؤيتنا", desc: "أن نكون المنصة التعليمية الأولى في الإمارات التي يثق بها أولياء الأمور لبناء مستقبل أبنائهم الأكاديمي." },
      ],
    },
    en: {
      heading: "Our Mission",
      highlight: "& Vision",
      cards: [
        { title: "Our Mission", desc: "We believe every child deserves education that understands and motivates them. We strive to provide a safe and supportive learning environment that enables students to reach their full academic potential while building their confidence." },
        { title: "Our Vision", desc: "To be the leading educational platform in the UAE that parents trust to build their children's academic future." },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2
          className="text-center mb-8 md:mb-12"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: "120%", color: "#262626" }}
        >
          {c.heading}{" "}{c.highlight}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
          {c.cards.map((card, i) => (
            <div
              key={i}
              className="rounded-[32px] p-8 flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group"
              style={{ background: cardColors[i] }}
            >
              <div className="flex justify-center items-center mb-6 overflow-visible h-[160px]">
                <img
                  src={cardImages[i]}
                  alt=""
                  className={`w-[230px] h-[230px] object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${i === 1 ? 'translate-x-4 translate-y-3 -rotate-[8deg]' : ''}`}
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="mb-3" style={{ fontSize: "24px", fontWeight: 800, color: "#262626" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
