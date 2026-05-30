// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Educational Organization Schema (Landing Page) ──────────────────────────

export function generateEducationalOrgSchema(locale: string) {
  const isArabic = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: isArabic ? "أكاديمية مَجْد" : "Majd Academy",
    description: isArabic
      ? "أكاديمية مَجْد تقدم تعليم اللغة العربية والتربية الإسلامية للأطفال في الإمارات من الصف الأول إلى الصف الثاني عشر."
      : "Majd Academy provides Arabic language and Islamic education for children in the UAE from Grade 1 to Grade 12.",
    url: "https://majdacademy.ae",
    logo: "https://majdacademy.ae/icon.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
    },
    audience: {
      "@type": "Audience",
      audienceType: isArabic
        ? "الأطفال وأولياء الأمور"
        : "Children and Parents",
    },
  };
}

// ─── Course Schema (Learn Arabic Page) ───────────────────────────────────────

export function generateCourseSchema(locale: string) {
  const isArabic = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: isArabic
      ? "تعلم العربية لغير الناطقين"
      : "Learn Arabic for Non-Native Speakers",
    description: isArabic
      ? "دورات تعلم اللغة العربية لغير الناطقين بها - برنامج مخصص للبالغين والمغتربين الراغبين في تعلم العربية أونلاين."
      : "Learn Arabic online with courses designed for adult non-native speakers and expats. Professional Arabic language tutoring tailored to your level.",
    provider: {
      "@type": "Organization",
      name: "Majd Academy",
      url: "https://majdacademy.ae",
    },
    audience: {
      "@type": "Audience",
      audienceType: isArabic ? "البالغين والمغتربين" : "Adults and Expats",
    },
    inLanguage: "ar",
  };
}

// ─── FAQ Schema ──────────────────────────────────────────────────────────────

export function generateFAQSchema(faqs: FAQItem[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
