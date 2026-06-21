"use client";
import Link from "next/link";
import { useLang } from "../../i18n/LangContext";

const cardColors = ["#fff8f0", "#fef0f8", "#eefbf3"];
const cardImages = ["/icon1.webp", "/icon2.webp", "/icon3.webp"];

export default function WhoIsThisFor() {
  const { lang, isRTL } = useLang();

  const content = {
    ar: {
      heading: "لمن صُممت",
      highlight: "هذه الدورة؟",
      cards: [
        { slug: "arab-kids-abroad", title: "أطفال العرب في الخارج", desc: "للحفاظ على لغتهم الأم وتعلّم القراءة والكتابة بالعربية، حتى وإن لم يستخدموها يومياً.", cta: "التفاصيل وحجز حصة" },
        { slug: "expat-kids", title: "الأطفال الأجانب حول العالم", desc: "يتعلمون العربية للمدرسة أو للتواصل مع أصدقائهم وفهم البيئة المحيطة بهم.", cta: "التفاصيل وحجز حصة" },
        { slug: "adults", title: "كبار يرغبون في تعلم العربية", desc: "من أجل العمل، الثقافة، أو الشغف باللغة — نعلّمهم من الصفر بأسلوب عملي.", cta: "التفاصيل وحجز حصة" },
      ],
    },
    en: {
      heading: "Who is this",
      highlight: "course for?",
      cards: [
        { slug: "arab-kids-abroad", title: "Arab kids abroad", desc: "Maintain their mother tongue and learn to read and write in Arabic even if they don't use it daily.", cta: "Details & Book" },
        { slug: "expat-kids", title: "Expat kids in the UAE", desc: "Learn Arabic for school or to communicate with friends and understand the environment around them.", cta: "Details & Book" },
        { slug: "adults", title: "Adults learning Arabic", desc: "For work, culture, or passion — we teach from scratch with a practical approach.", cta: "Details & Book" },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <h2
          className="text-center mb-16"
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: "120%",
            color: "#262626" }}
        >
          {c.heading}{" "}<span className="text-[#ef5da8]">{c.highlight}</span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {c.cards.map((card, i) => (
            <Link
              href={`/${lang}/course/${card.slug}`}
              key={i}
              className="rounded-[32px] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-[#262626]/10 hover:shadow-xl group cursor-pointer block"
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
                  style={{ fontSize: "24px", fontWeight: 800, color: "#262626" }}
                >
                  {card.title}
                </h3>
                <p
                  className="mb-5"
                  style={{ fontSize: "15px", fontWeight: 500, lineHeight: "26px", color: "rgba(38,38,38,0.6)" }}
                >
                  {card.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full group-hover:bg-[#262626] group-hover:text-white transition-all duration-300">
                  {card.cta}
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
