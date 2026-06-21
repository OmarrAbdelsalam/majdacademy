import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { coursesData } from "../../../components/course/courseData";
import CourseDetails from "../../../components/course/CourseDetails";
import AcademyNavbar from "../../../components/layout/AcademyNavbar";
import KodlandFooter from "../../../components/layout/KodlandFooter";
import FloatingWhatsApp from "../../../components/layout/FloatingWhatsApp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const isRTL = locale === "ar";
  const course = coursesData.find((c) => c.slug === slug);

  if (!course) {
    return { title: "Course Not Found" };
  }

  const seo = isRTL ? course.seo.ar : course.seo.en;
  
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

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isRTL = locale === "ar";
  
  const course = coursesData.find((c) => c.slug === slug);
  
  if (!course) {
    notFound();
  }

  const courseContent = isRTL ? course.ar : course.en;
  
  // JSON-LD Course Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseContent.title,
    "description": courseContent.intro,
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
        <CourseDetails course={courseContent} />
      </main>

      <KodlandFooter />
      <FloatingWhatsApp />
    </div>
  );
}
