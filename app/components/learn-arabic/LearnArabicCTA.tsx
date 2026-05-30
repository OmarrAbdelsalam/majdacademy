"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import GenericCTABanner from "../shared/GenericCTABanner";

export default function LearnArabicCTA() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      title: "ابدأ رحلة ولدك مع العربية",
      desc: "حصة تجريبية مجانية — نقيّم مستواه ونوصيك بأفضل خطة.",
      cta: "احجز الحصة المجانية",
    },
    en: {
      title: "Start your child's Arabic journey",
      desc: "Free trial class — we assess their level and recommend the best plan.",
      cta: "Book the free class",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <GenericCTABanner
      title={c.title}
      description={c.desc}
      ctaText={c.cta}
      characterImage="/gur.webp"
      modalVariant="learn-arabic"
    />
  );
}
