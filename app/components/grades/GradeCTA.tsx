"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import GenericCTABanner from "../shared/GenericCTABanner";

export default function GradeCTA() {
  const { lang } = useLang();
  const isArabic = lang === "ar";

  return (
    <GenericCTABanner
      title={isArabic ? "ابدأ رحلة ولدك الأكاديمية" : "Start your child's academic journey"}
      description={isArabic ? "حصة تجريبية مجانية — نقيّم مستواه ونوصيك بأفضل خطة." : "Free trial class — we assess their level and recommend the best plan."}
      ctaText={isArabic ? "احجز الحصة المجانية" : "Book the free class"}
      characterImage="/gur.webp"
      modalVariant="default"
    />
  );
}
