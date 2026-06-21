"use client";
import React from "react";
import { useLang } from "../../i18n/LangContext";
import GenericPricing from "../shared/GenericPricing";

export default function LearnArabicPricing() {
  const { isRTL } = useLang();

  const content = {
    ar: {
      subtitle: "كورس العربية لغير الناطقين",
      title: "اختار الباقة",
      highlight: "المناسبة",
      cta: "احجز حصتك المجانية",
      packages: [
        {
          title: "باقة المستوى",
          description: "محادثة وقراءة وكتابة",
          price: "2000",
          period: "درهم / للمستوى",
          features: ["تأسيس من الصفر", "محادثة وقراءة وكتابة", "متابعة وتقييم مستمر", "منهج مخصص لغير الناطقين"],
          featured: true,
        },
      ],
    },
    en: {
      subtitle: "Arabic for Non-Native Speakers",
      title: "Choose the right",
      highlight: "package",
      cta: "Book Your Free Class",
      packages: [
        {
          title: "Level Package",
          description: "Conversation, Reading, and Writing",
          price: "2000",
          period: "AED / level",
          features: ["Learning from scratch", "Conversation, reading, and writing", "Continuous follow-up and assessment", "Custom curriculum for non-natives"],
          featured: true,
        },
      ],
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <GenericPricing
      subtitle={c.subtitle}
      title={c.title}
      titleHighlight={c.highlight}
      packages={c.packages}
      ctaText={c.cta}
      modalVariant="learn-arabic"
    />
  );
}
