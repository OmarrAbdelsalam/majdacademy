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
          title: "الباقة المكثفة",
          description: "تعلّم أسرع مع حصص أكثر",
          price: "600",
          period: "درهم / شهرياً",
          features: ["8 حصص شهرياً (حصتين بالأسبوع)", "معلم متخصص بتعليم العربية لغير الناطقين", "منهج مخصص حسب مستوى الطالب", "تقارير أسبوعية لولي الأمر"],
          featured: true,
        },
        {
          title: "الباقة الأساسية",
          description: "بداية مريحة بوتيرة خفيفة",
          price: "350",
          period: "درهم / شهرياً",
          features: ["4 حصص شهرياً (حصة بالأسبوع)", "معلم متخصص بتعليم العربية لغير الناطقين", "حصة تقييم مجانية لتحديد المستوى", "تقرير شهري لولي الأمر"],
          featured: false,
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
          title: "Intensive Package",
          description: "Learn faster with more sessions",
          price: "600",
          period: "AED / month",
          features: ["8 sessions/month (twice a week)", "Teacher specialized in Arabic for non-natives", "Custom curriculum based on student level", "Weekly reports for parents"],
          featured: true,
        },
        {
          title: "Basic Package",
          description: "A comfortable start at a light pace",
          price: "350",
          period: "AED / month",
          features: ["4 sessions/month (once a week)", "Teacher specialized in Arabic for non-natives", "Free assessment session to determine level", "Monthly report for parents"],
          featured: false,
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
