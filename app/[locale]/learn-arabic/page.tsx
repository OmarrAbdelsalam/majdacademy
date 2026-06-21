import type { Metadata } from "next";
import { createPageMetadata, PUBLIC_PAGES } from "../../../lib/metadata";
import { generateCourseSchema, generateFAQSchema } from "../../../lib/structured-data";
import JsonLd from "../../components/seo/JsonLd";
import AcademyNavbar from "../../components/layout/AcademyNavbar";
import KodlandFooter from "../../components/layout/KodlandFooter";
import LearnArabicHero from "../../components/learn-arabic/LearnArabicHero";
import WhoIsThisFor from "../../components/learn-arabic/WhoIsThisFor";
import WhatTheyLearn from "../../components/learn-arabic/WhatTheyLearn";
import LearnArabicPricing from "../../components/learn-arabic/LearnArabicPricing";
import LearnArabicFAQ from "../../components/learn-arabic/LearnArabicFAQ";
import LearnArabicCTA from "../../components/learn-arabic/LearnArabicCTA";
import FloatingWhatsAppClient from "../../components/layout/FloatingWhatsAppClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(PUBLIC_PAGES["/learn-arabic"], locale);
}

export default async function LearnArabicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  const courseSchema = generateCourseSchema(locale);
  const faqSchema = generateFAQSchema([
    {
      question: isRTL ? "ما هي مدة الدورة؟" : "How long is the course?",
      answer: isRTL
        ? "تعتمد مدة الدورة على مستواك وأهدافك. نقدم برامج مرنة تناسب جدولك."
        : "Course duration depends on your level and goals. We offer flexible programs that fit your schedule.",
    },
    {
      question: isRTL ? "هل الدورة مناسبة للمبتدئين؟" : "Is the course suitable for beginners?",
      answer: isRTL
        ? "نعم، نقدم مستويات متعددة تبدأ من المبتدئين وحتى المتقدمين."
        : "Yes, we offer multiple levels from beginner to advanced.",
    },
    {
      question: isRTL ? "كيف تتم الدروس؟" : "How are lessons conducted?",
      answer: isRTL
        ? "الدروس تتم أونلاين عبر منصتنا التفاعلية مع معلمين متخصصين."
        : "Lessons are conducted online through our interactive platform with specialized teachers.",
    },
  ], locale);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#262626] font-sans flex flex-col relative">
      <JsonLd data={[courseSchema, faqSchema]} />
      <AcademyNavbar />
      <main id="main-content" role="main" className="flex-1">
        <LearnArabicHero />
        <WhoIsThisFor />
        <WhatTheyLearn />
        <LearnArabicPricing />
        <LearnArabicFAQ />
        <LearnArabicCTA />
      </main>
      <KodlandFooter />
      <FloatingWhatsAppClient />
    </div>
  );
}
