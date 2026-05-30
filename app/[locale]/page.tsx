import type { Metadata } from "next";
import { createPageMetadata, PUBLIC_PAGES } from "../../lib/metadata";
import { generateEducationalOrgSchema, generateFAQSchema } from "../../lib/structured-data";
import JsonLd from "../components/seo/JsonLd";
import AcademyLanding2 from "../components/AcademyLanding2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(PUBLIC_PAGES["/"], locale);
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = locale === "en" ? "en" : "ar";

  const orgSchema = generateEducationalOrgSchema(normalizedLocale);
  const faqSchema = generateFAQSchema([
    {
      question: normalizedLocale === "ar" ? "ما هي أكاديمية مَجْد؟" : "What is Majd Academy?",
      answer: normalizedLocale === "ar"
        ? "أكاديمية مَجْد هي منصة تعليمية متخصصة في تعليم اللغة العربية والتربية الإسلامية للأطفال في الإمارات."
        : "Majd Academy is an educational platform specializing in Arabic language and Islamic education for children in the UAE.",
    },
    {
      question: normalizedLocale === "ar" ? "ما المراحل الدراسية المتاحة؟" : "What grade levels are available?",
      answer: normalizedLocale === "ar"
        ? "نقدم برامج تعليمية من الصف الأول إلى الصف الثاني عشر."
        : "We offer educational programs from Grade 1 to Grade 12.",
    },
    {
      question: normalizedLocale === "ar" ? "هل تقدمون حصة تجريبية مجانية؟" : "Do you offer a free trial lesson?",
      answer: normalizedLocale === "ar"
        ? "نعم، نقدم حصة تجريبية مجانية لجميع الطلاب الجدد."
        : "Yes, we offer a free trial lesson for all new students.",
    },
  ], normalizedLocale);

  return (
    <>
      <JsonLd data={[orgSchema, faqSchema]} />
      <AcademyLanding2 locale={normalizedLocale} />
    </>
  );
}
