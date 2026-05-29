"use client";

import { useLang } from "../../i18n/LangContext";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AcademyNavbar from "../../components/AcademyNavbar";
import { useSearchParams } from "next/navigation";

const gradesData = [
  { id: 1, ar: "الصف الأول", en: "Grade 1" },
  { id: 2, ar: "الصف الثاني", en: "Grade 2" },
  { id: 3, ar: "الصف الثالث", en: "Grade 3" },
  { id: 4, ar: "الصف الرابع", en: "Grade 4" },
  { id: 5, ar: "الصف الخامس", en: "Grade 5" },
  { id: 6, ar: "الصف السادس", en: "Grade 6" },
  { id: 7, ar: "الصف السابع", en: "Grade 7" },
  { id: 8, ar: "الصف الثامن", en: "Grade 8" },
  { id: 9, ar: "الصف التاسع", en: "Grade 9" },
  { id: 10, ar: "الصف العاشر", en: "Grade 10" },
  { id: 11, ar: "صف الحادي عشر", en: "Grade 11" },
  { id: 12, ar: "صف الثاني عشر", en: "Grade 12" },
];

export default function ProductsPage() {
  const { lang, isRTL } = useLang();
  const searchParams = useSearchParams();
  const stage = searchParams?.get("stage");

  // Filter grades based on stage
  let filteredGrades = gradesData;
  if (stage === "1") {
    filteredGrades = gradesData.slice(0, 4);
  } else if (stage === "2") {
    filteredGrades = gradesData.slice(4, 8);
  } else if (stage === "3") {
    filteredGrades = gradesData.slice(8, 12);
  }

  return (
    <div className="min-h-screen bg-[#fcf9fe] text-[#22122c] font-sans pb-20">
      
      {/* Header */}
      <AcademyNavbar inverted={false} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-[#22122c] mb-4">
            {isRTL ? "اختر الصف الدراسي الخاص بك" : "Select Your Grade"}
          </h1>
          <p className="text-[#6f6077] font-medium text-lg">
            {isRTL 
              ? "جميع الباقات التعليمية مصممة خصيصاً لتناسب كل مرحلة عمرية" 
              : "All educational packages are specially designed for each age stage"}
          </p>
        </div>

        {/* 3D Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {filteredGrades.map((grade) => (
            <Link key={grade.id} href={`/${lang}/products/${grade.id}`} className="group block outline-none">
              <div className="bg-[#663ba0] rounded-[24px] aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(102,59,160,0.3)] group-focus-visible:ring-4 ring-[#7B56C5]/50 border-2 border-transparent group-hover:border-[#9667d9]">
                
                {/* 3D Number */}
                <div 
                  className="text-[80px] sm:text-[90px] font-black leading-none mb-2"
                  style={{
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    textShadow: `
                      -1px 1px 0px #cca044,
                      -2px 2px 0px #cca044,
                      -3px 3px 0px #cca044,
                      -4px 4px 0px #cca044,
                      -5px 5px 0px #cca044,
                      -6px 6px 0px #cca044,
                      -7px 7px 10px rgba(0,0,0,0.4)
                    `,
                    transform: isRTL ? 'skewX(5deg)' : 'skewX(-5deg)', // Slight italic/skew for dynamic feel
                  }}
                >
                  {grade.id}
                </div>
                
                <h3 className="text-white font-extrabold text-[15px] sm:text-[17px] tracking-wide relative z-10">
                  {isRTL ? grade.ar : grade.en}
                </h3>
                
                {/* Subtle highlight overlay */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[24px]"></div>
              </div>
            </Link>
          ))}
        </div>
      </main>

    </div>
  );
}
