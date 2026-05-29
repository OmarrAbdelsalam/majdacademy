"use client";
import React from "react";
import { ArrowLeftCircle, Briefcase, GraduationCap, Users, Sparkles } from "lucide-react";

export default function TeacherHiringBanner() {
  return (
    <section className="relative w-full py-16 md:py-[100px] flex justify-center bg-[#F8F9FA] font-sans">
      <div 
        dir="rtl"
        className="relative w-full min-h-[400px] overflow-hidden flex shadow-lg"
      >
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
            alt="Education Background" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay: Dark on the right (where text is), fading to left */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#1B2D4F]/95 via-[#1B2D4F]/70 to-transparent"></div>
        </div>

        {/* Text Content Area */}
        <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-center px-8 py-16 md:px-16 items-start text-right">
          
          <h2 className="text-white font-black text-3xl md:text-[44px] leading-tight mb-4 tracking-tight drop-shadow-md">
            انضم لفريق <span className="text-[#FFC843]">مَجْد</span>
          </h2>
          
          <p className="text-white/90 text-sm md:text-lg leading-[1.8] max-w-[500px] mb-8 font-medium drop-shadow-md">
            نبحث عن معلمين ومعلمات مبدعين في كافة المواد التعليمية. 
            إذا كان عندك شغف بالتدريس، وتحب تصنع تأثير حقيقي في حياة الطلاب.. مكانك محجوز ويانا!
          </p>
          
          <div>
            <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-all duration-300 text-[#1B2D4F] text-[16px] font-bold py-3.5 px-8 rounded-xl shadow-lg hover:-translate-y-1">
              <span>قدم طلب انضمام</span>
              <ArrowLeftCircle className="w-5 h-5 shrink-0" strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
