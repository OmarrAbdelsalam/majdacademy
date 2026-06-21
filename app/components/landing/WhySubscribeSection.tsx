"use client";
import React from "react";
import { BookOpen, Video, Smartphone, Calendar, MessageSquare, GraduationCap, UserCheck } from "lucide-react";

export default function WhySubscribeSection() {
  const features = [
    {
      title: "تنظيم الدروس والوحدات",
      desc: "دورات مقسمة إلى وحدات صغيرة ليتسنى لك المذاكرة بترتيب ومتابعة تقدمك بسهولة.",
      icon: BookOpen,
    },
    {
      title: "نخبة من المعلمين المتميزين",
      desc: "نختار معلمينا بعناية فائقة ونخضعهم لاختبارات دقيقة لضمان أعلى مستويات الكفاءة والقدرة على تبسيط المعلومة.",
      icon: UserCheck,
    },
    {
      title: "تطبيقات وتمارين تفاعلية",
      desc: "تمارين تفاعلية بعد كل درس لتثبيت المعلومات واختبار مستواك.",
      icon: Smartphone,
    },
    {
      title: "متابعة مستمرة وخطة محسوبة",
      desc: "نراجع مستواك بشكل دوري ونرسل لك ملاحظات واقتراحات لضمان استمرارك على المسار الصحيح.",
      icon: Calendar,
    },
    {
      title: "تواصل مباشر مع معلمك",
      desc: "عندما تواجهك صعوبة في نقطة أو سؤال، يمكنك إرسال استفسارك فوراً وتلقي إجابة توضح لك الفكرة دون إهدار للوقت.",
      icon: MessageSquare,
    },
    {
      title: "مراجعات سريعة قبل الامتحان",
      desc: "مجموعة مقاطع مرئية مركزة تلخص لك أهم الأفكار قبل الامتحان وتذكرك بالنقاط الأساسية التي يجب مراجعتها.",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#f6428c]/10 text-[#f6428c] rounded-full text-xs sm:text-sm font-extrabold mb-4">
            مميزات المنصة
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#262626] mb-4">
            لماذا تشترك معنا؟
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#262626]/70 max-w-2xl mx-auto font-medium leading-relaxed">
            اخترنا لك أهم مميزات المنصة التي ستجعل دراستك أسهل وتنظيمك أفضل ونتائجك أعلى.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-[#fff8f0] border border-transparent hover:bg-[#f6428c] hover:shadow-[0_20px_40px_rgba(246,66,140,0.2)] transition-all duration-300 rounded-[24px] p-8 flex flex-col items-center text-center justify-start group cursor-default min-h-[200px]"
              >
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-white border border-pink-100 group-hover:bg-white/20 group-hover:border-transparent flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-[#f6428c] group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#262626] group-hover:text-white mb-3 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#262626]/70 group-hover:text-white/90 font-medium transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
