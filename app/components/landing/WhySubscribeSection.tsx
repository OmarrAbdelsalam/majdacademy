"use client";
import React from "react";
import { BookOpen, Video, Smartphone, Calendar, MessageSquare, GraduationCap, UserCheck } from "lucide-react";
import { useLang } from "../../i18n/LangContext";

export default function WhySubscribeSection() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const t = {
    badge: isAr ? "مميزات المنصة" : "Platform Features",
    title: isAr ? "لماذا تشترك معنا؟" : "Why Subscribe With Us?",
    desc: isAr 
      ? "اخترنا لك أهم مميزات المنصة التي ستجعل دراستك أسهل وتنظيمك أفضل ونتائجك أعلى."
      : "We selected the most important platform features that will make your study easier, better organized, and yield higher results.",
  };

  const features = [
    {
      title: isAr ? "تنظيم الدروس والوحدات" : "Organized Lessons & Modules",
      desc: isAr 
        ? "دورات مقسمة إلى وحدات صغيرة ليتسنى لك المذاكرة بترتيب ومتابعة تقدمك بسهولة."
        : "Courses divided into small modules to study in order and track progress easily.",
      icon: BookOpen,
    },
    {
      title: isAr ? "نخبة من المعلمين المتميزين" : "Elite Outstanding Teachers",
      desc: isAr 
        ? "نختار معلمينا بعناية فائقة ونخضعهم لاختبارات دقيقة لضمان أعلى مستويات الكفاءة والقدرة على تبسيط المعلومة."
        : "We carefully select our teachers through rigorous testing to ensure highest competence.",
      icon: UserCheck,
    },
    {
      title: isAr ? "تطبيقات وتمارين تفاعلية" : "Interactive Apps & Exercises",
      desc: isAr 
        ? "تمارين تفاعلية بعد كل درس لتثبيت المعلومات واختبار مستواك."
        : "Interactive exercises after each lesson to consolidate information and test your level.",
      icon: Smartphone,
    },
    {
      title: isAr ? "متابعة مستمرة وخطة محسوبة" : "Continuous Follow-up",
      desc: isAr 
        ? "نراجع مستواك بشكل دوري ونرسل لك ملاحظات واقتراحات لضمان استمرارك على المسار الصحيح."
        : "We review your level periodically and send feedback to ensure you stay on track.",
      icon: Calendar,
    },
    {
      title: isAr ? "تواصل مباشر مع معلمك" : "Direct Communication",
      desc: isAr 
        ? "عندما تواجهك صعوبة في نقطة أو سؤال، يمكنك إرسال استفسارك فوراً وتلقي إجابة توضح لك الفكرة دون إهدار للوقت."
        : "When facing a difficulty, you can instantly message your teacher for clarification.",
      icon: MessageSquare,
    },
    {
      title: isAr ? "مراجعات سريعة قبل الامتحان" : "Quick Exam Reviews",
      desc: isAr 
        ? "مجموعة مقاطع مرئية مركزة تلخص لك أهم الأفكار قبل الامتحان وتذكرك بالنقاط الأساسية التي يجب مراجعتها."
        : "Focused video clips summarizing key concepts before exams.",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#f6428c]/10 text-[#f6428c] rounded-full text-xs sm:text-sm font-extrabold mb-4">
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#262626] mb-4">
            {t.title}
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#262626]/70 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.desc}
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
