import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { schoolGradesData } from "../../../components/grades/schoolGradesData";
import CourseDetails from "../../../components/course/CourseDetails";
import AcademyNavbar from "../../../components/layout/AcademyNavbar";
import KodlandFooter from "../../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../../components/layout/FloatingWhatsApp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const isRTL = locale === "ar";
  const grade = schoolGradesData.find((g) => g.slug === slug);

  if (!grade) {
    return { title: "Grade Not Found" };
  }

  const seo = isRTL ? grade.seo.ar : grade.seo.en;
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
    },
  };
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isRTL = locale === "ar";
  
  const grade = schoolGradesData.find((g) => g.slug === slug);
  
  if (!grade) {
    notFound();
  }

  const gradeContent = isRTL ? grade.ar : grade.en;
  
  // JSON-LD Course Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": gradeContent.title,
    "description": gradeContent.intro,
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
        <CourseDetails course={gradeContent} isGradePage={true} isSubjectPage={false} gradeSlug={slug} />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
