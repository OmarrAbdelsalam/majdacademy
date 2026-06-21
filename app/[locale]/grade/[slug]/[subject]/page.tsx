import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { schoolGradesData } from "../../../../components/grades/schoolGradesData";
import CourseDetails from "../../../../components/course/CourseDetails";
import AcademyNavbar from "../../../../components/layout/AcademyNavbar";
import KodlandFooter from "../../../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../../../components/layout/FloatingWhatsApp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string; subject: string }> }): Promise<Metadata> {
  const { locale, slug, subject } = await params;
  const isRTL = locale === "ar";
  const grade = schoolGradesData.find((g) => g.slug === slug);

  if (!grade || (subject !== "arabic" && subject !== "islamic")) {
    return { title: "Subject Not Found" };
  }

  const subjectNameAr = subject === "arabic" ? "اللغة العربية" : "التربية الإسلامية";
  const subjectNameEn = subject === "arabic" ? "Arabic Language" : "Islamic Education";
  
  const gradeTitleAr = grade.ar.title;
  const gradeTitleEn = grade.en.title;

  const title = isRTL 
    ? `تأسيس ${subjectNameAr} - ${gradeTitleAr} | مَجْد أكاديمي` 
    : `${subjectNameEn} Foundation - ${gradeTitleEn} | Majd Academy`;

  const description = isRTL
    ? `دورة متخصصة في ${subjectNameAr} لطلاب ${gradeTitleAr}. نهدف لبناء أساس قوي يعزز التفوق الأكاديمي بخطط منهجية مدروسة.`
    : `Specialized ${subjectNameEn} course for ${gradeTitleEn} students. We aim to build a strong foundation for academic excellence.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subject: string }>;
}) {
  const { locale, slug, subject } = await params;
  const isRTL = locale === "ar";
  
  const grade = schoolGradesData.find((g) => g.slug === slug);
  
  if (!grade || (subject !== "arabic" && subject !== "islamic")) {
    notFound();
  }

  const baseContent = isRTL ? grade.ar : grade.en;
  
  const subjectNameAr = subject === "arabic" ? "اللغة العربية" : "التربية الإسلامية";
  const subjectNameEn = subject === "arabic" ? "Arabic Language" : "Islamic Education";
  const subjectName = isRTL ? subjectNameAr : subjectNameEn;

  // Override content for the specific subject
  const subjectContent = {
    ...baseContent,
    title: `${subjectName} - ${baseContent.title}`,
    subtitle: isRTL 
      ? `عزز مهارات طفلك في ${subjectNameAr} بخطة مخصصة تلبي احتياجاته الأكاديمية.` 
      : `Enhance your child's skills in ${subjectNameEn} with a customized plan.`,
    intro: isRTL 
      ? `نقدم في هذه الدورة شرحاً مبسطاً وتدريبات عملية مكثفة في ${subjectNameAr} لضمان تفوق الطالب في ${baseContent.title} واستيعابه الكامل للمنهج المدرسي.`
      : `In this course, we provide simplified explanations and intensive practical exercises in ${subjectNameEn} to ensure the student excels in ${baseContent.title}.`,
  };

  const courseProps = {
    ...grade,
    ar: subject === "arabic" ? { ...grade.ar, ...subjectContent } : grade.ar,
    en: subject === "arabic" ? grade.en : { ...grade.en, ...subjectContent },
  };
  
  // Assign modified content based on locale to ensure CourseDetails reads the overridden fields
  if (isRTL) {
    courseProps.ar = subjectContent;
  } else {
    courseProps.en = subjectContent;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": subjectContent.title,
    "description": subjectContent.intro,
    "provider": {
      "@type": "Organization",
      "name": "Majd Academy",
      "sameAs": "https://majd-academy.com"
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#fafafa] text-[#262626] font-sans flex flex-col relative">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <AcademyNavbar />

      <main className="flex-1">
        <CourseDetails course={subjectContent} isGradePage={true} isSubjectPage={true} gradeSlug={slug} />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
