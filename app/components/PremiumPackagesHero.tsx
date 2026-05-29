"use client";
import React from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useLandingContent } from "./useLandingContent";
import { useLang } from "../i18n/LangContext";

export default function PremiumPackagesHero() {
  const content = useLandingContent();
  const { lang } = useLang();
  const isRTL = lang === "ar";

  return (
    <section className="relative w-full py-12 md:py-16 flex justify-center px-4 sm:px-6 bg-white font-sans">
      <div 
        className="relative w-full max-w-[1200px] min-h-[300px] md:h-[400px] rounded-[16px] flex flex-col md:flex-row shadow-[0_16px_40px_rgba(73,139,255,0.2)]"
        style={{
          backgroundImage: "url('https://cdn.kodland.org/main-site-v2/bg-blue.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content Area */}
        <div className="relative z-10 w-full md:w-7/12 h-full flex flex-col justify-center px-6 py-8 sm:px-8 md:px-16 md:py-0">
          <h2
            className="text-white font-extrabold leading-tight mb-4 drop-shadow-sm"
            style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em", lineHeight: "120%" }}
          >
            {content.premiumHero.title}
          </h2>
          <p className="text-white/85 text-[15px] leading-[1.8] max-w-[480px] mb-8 font-medium">
            {content.premiumHero.desc1}
            {" "}{content.premiumHero.desc2} <span className="text-white font-bold">{content.premiumHero.desc2highlight}</span>
            {" "}{content.premiumHero.desc3}
          </p>
          <div>
            <a
              href="#packages"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 transition-colors text-[#262626] text-[15px] font-bold py-3.5 px-8 rounded-full shadow-md"
            >
              {isRTL ? <ArrowLeftCircle className="w-5 h-5 shrink-0" strokeWidth={2} /> : <ArrowRightCircle className="w-5 h-5 shrink-0" strokeWidth={2} />}
              <span>{content.premiumHero.cta}</span>
            </a>
          </div>
        </div>

        {/* Image Area */}
        <div className="relative z-10 hidden md:flex w-5/12 h-full justify-center items-end pointer-events-none">
          <img
            src="https://cdn.kodland.org/main-site-v2/en/main/kid_4.webp"
            alt=""
            className="w-auto object-contain object-bottom"
            style={{ height: "120%" }}
          />
        </div>
      </div>
    </section>
  );
}
