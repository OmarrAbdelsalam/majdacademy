"use client";
import React, { useState } from "react";
import Image from "next/image";
import BookingModal from "../shared/BookingModal";
import { Check, ArrowLeft } from "lucide-react";

export default function ChoosePathSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const paths = [
    {
      title: "جميع مناهج الخليج الدراسية",
      subtitle: "تأسيس ومتابعة دراسية",
      desc: "شرح مبسط ومتابعة دقيقة لجميع المناهج الدراسية في دول الخليج بأساليب تفاعلية تناسب مختلف الأعمار والمراحل التعليمية.",
      image: "/arabic_native_card.png",
      features: [
        "تغطية شاملة للمواد الدراسية في مختلف المناهج الخليجية.",
        "متابعة دورية وتقييم مستمر لضمان تطور مستوى الطالب الأكاديمي.",
        "شروحات مبسطة وتدريبات مكثفة تهدف إلى التفوق والتميز.",
        "تأسيس قوي وبناء قاعدة معرفية متينة للمراحل التأسيسية والابتدائية.",
      ],
      imagePosition: "left", // Image on left, text on right
    },
    {
      title: "العربية بين يديك",
      subtitle: "لغة عربية لغير الناطقين بها",
      desc: "سلسلة متخصصة في تعليم اللغة العربية لغير الناطقين بها بأسلوب سلس ومبسط، تبدأ معك من الصفر وتتدرج بك خطوة بخطوة حتى الإتقان.",
      image: "/arabic_non_native.png",
      features: [
        "تتكون من 4 أجزاء متدرجة تبدأ من المستوى التأسيسي وحتى مرحلة الإتقان التام.",
        "تعتمد على أسلوب تفاعلي يركز على المحادثة والاستماع في مواقف الحياة اليومية.",
        "تجمع بين تعلم اللغة واكتساب مهارات التواصل الطبيعي بثقة وسهولة.",
      ],
      imagePosition: "right", // Image on right, text on left
    },
  ];

  return (
    <section id="choose-path" className="py-16 md:py-24 bg-[#fafafb] relative overflow-hidden" dir="rtl">
      {/* Decorative background shapes */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-[#f6428c]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-[#e8347d]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#f6428c]/10 text-[#f6428c] rounded-full text-xs sm:text-sm font-extrabold mb-4">
            المناهج التعليمية
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#262626] tracking-tight leading-tight">
            اختر مسارك التعليمي
          </h2>
          <p className="mt-4 text-[15px] sm:text-lg text-[#262626]/70 max-w-2xl mx-auto font-medium">
            نوفر مسارات متكاملة ومخصصة لتلبية احتياجات الطلاب سواء كانوا من الناطقين بالعربية أو الراغبين في تعلمها كلغة ثانية.
          </p>
        </div>

        {/* Path Cards */}
        {/* Path Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-7xl mx-auto">
          {paths.map((path, idx) => {
            const isPinkCard = idx === 0;
            return (
              <div
                key={idx}
                className={`flex flex-col rounded-[32px] overflow-hidden relative transition-all duration-500 border ${
                  isPinkCard 
                    ? "border-white/10 text-white shadow-[0_20px_50px_rgba(236,72,153,0.3)] hover:shadow-[0_25px_60px_rgba(246,66,140,0.4)] hover:-translate-y-1" 
                    : "bg-white border-gray-100 text-[#262626] shadow-[0_15px_40px_rgba(0,0,0,0.035)] hover:shadow-[0_25px_60px_rgba(246,66,140,0.06)] hover:border-[#f6428c]/15 hover:-translate-y-1"
                }`}
              >
                {isPinkCard && (
                  <div className="absolute inset-0 z-0">
                    <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="bannerBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#e8347d" />
                          <stop offset="60%" stopColor="#f6428c" />
                          <stop offset="100%" stopColor="#ff66a3" />
                        </linearGradient>
                        <linearGradient id="bannerWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="bannerWaveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <rect width="1000" height="300" fill="url(#bannerBaseGrad)" />
                      <path d="M0,140 C300,80 700,240 1000,110 L1000,300 L0,300 Z" fill="url(#bannerWaveGrad1)" />
                      <path d="M0,230 C350,290 650,180 1000,250 L1000,300 L0,300 Z" fill="url(#bannerWaveGrad2)" />
                    </svg>
                  </div>
                )}


                {/* Content Container */}
                <div className="w-full flex flex-col items-start text-right p-6 sm:p-8 md:p-10 relative z-10">
                  {/* Badge/Subtitle */}
                  <span className={`font-extrabold text-sm sm:text-base mb-3 ${
                    isPinkCard 
                      ? "text-white/90 bg-white/15 px-3.5 py-1 rounded-full border border-white/10" 
                      : "text-[#f6428c]"
                  }`}>
                    {path.subtitle}
                  </span>
                  
                  {/* Title */}
                  <h3 className={`text-2xl sm:text-3xl font-black mb-4 ${
                    isPinkCard ? "text-white" : "text-[#262626]"
                  }`}>
                    {path.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-[14px] sm:text-base leading-relaxed mb-6 font-medium ${
                    isPinkCard ? "text-white/90" : "text-[#262626]/80"
                  }`}>
                    {path.desc}
                  </p>

                  {/* Features List */}
                  {path.features && path.features.length > 0 && (
                    <ul className="space-y-4 mb-6 w-full">
                      {path.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-right">
                          <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            isPinkCard ? "bg-white/20" : "bg-[#f6428c]/10"
                          }`}>
                            <Check className={`w-3.5 h-3.5 stroke-[3] ${
                              isPinkCard ? "text-white" : "text-[#f6428c]"
                            }`} />
                          </span>
                          <span className={`text-[14px] sm:text-[15px] font-medium leading-snug ${
                            isPinkCard ? "text-white/90" : "text-[#262626]/90"
                          }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={`px-6 py-3 rounded-full font-bold text-sm sm:text-[15px] transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 ${
                        isPinkCard 
                          ? "bg-white text-[#f6428c] hover:bg-white/95 shadow-[0_4px_15px_rgba(255,255,255,0.2)]" 
                          : "bg-[#f6428c] text-white hover:bg-[#e8347d] shadow-[0_4px_15px_rgba(246,66,140,0.3)]"
                      }`}
                    >
                      سجل الآن
                    </button>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={`px-6 py-3 rounded-full font-bold text-sm sm:text-[15px] transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 border ${
                        isPinkCard 
                          ? "bg-transparent border-white/35 text-white hover:bg-white/10" 
                          : "bg-white border-gray-200 text-[#262626] hover:bg-gray-50"
                      }`}
                    >
                      عرض المنهج
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
