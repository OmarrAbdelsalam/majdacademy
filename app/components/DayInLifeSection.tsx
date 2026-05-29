"use client";
import React from "react";
import { Smartphone, MonitorPlay, PenLine, BarChart3, Coffee, Star } from "lucide-react";

const timelineSteps = [
  {
    time: "3:30 م",
    title: "يفتح المنصة",
    description: "الطالب يدخل على حسابه ويشوف جدول حصصه اليوم",
    icon: <Smartphone className="w-5 h-5" strokeWidth={1.5} />,
    color: "#F0548B",
  },
  {
    time: "4:00 م",
    title: "يحضر الحصة",
    description: "حصة تفاعلية مع المعلم — يسأل ويشارك ويفهم",
    icon: <MonitorPlay className="w-5 h-5" strokeWidth={1.5} />,
    color: "#FFC843",
  },
  {
    time: "4:50 م",
    title: "يحل الواجب",
    description: "تمارين قصيرة تثبّت المعلومة اللي أخذها بالحصة",
    icon: <PenLine className="w-5 h-5" strokeWidth={1.5} />,
    color: "#1B2D4F",
  },
  {
    time: "5:15 م",
    title: "استراحة مستحقة ☕",
    description: "يرتاح ويلعب — لأن التوازن مهم عشان يرجع بنشاط",
    icon: <Coffee className="w-5 h-5" strokeWidth={1.5} />,
    color: "#8B6E96",
  },
  {
    time: "8:00 م",
    title: "ولي الأمر يستلم التقرير",
    description: "تقرير بسيط عن أداء اليوم يوصل على الواتساب",
    icon: <BarChart3 className="w-5 h-5" strokeWidth={1.5} />,
    color: "#F0548B",
  },
  {
    time: "نهاية الأسبوع",
    title: "نجم الأسبوع ⭐",
    description: "الطالب المتميز يحصل على شهادة تقدير ونقاط مكافأة",
    icon: <Star className="w-5 h-5" strokeWidth={1.5} />,
    color: "#FFC843",
  },
];

export default function DayInLifeSection() {
  return (
    <section className="py-16 md:py-[100px] relative overflow-hidden" dir="rtl" style={{ background: "#fafbfc" }}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl md:text-[44px] font-black text-[#1B2D4F] mb-4 leading-tight">
            يوم في حياة طالب <span className="text-[#F0548B]">مَجْد</span>
          </h2>
          <p className="text-[#8B6E96] text-lg md:text-[20px] font-medium max-w-2xl mx-auto leading-relaxed">
            تخيّل كيف يكون يوم ولدك معنا — منظّم، ممتع، وبدون ضغط
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-[700px] mx-auto relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0 right-[23px] md:right-[27px] w-[2px]"
            style={{ background: "linear-gradient(to bottom, #F0548B, #FFC843, #1B2D4F)" }}
          ></div>

          {/* Steps */}
          <div className="flex flex-col gap-2">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-5 relative group">
                {/* Dot/Icon */}
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "#fff", border: `2px solid ${step.color}30`, color: step.color, boxShadow: `0 4px 15px ${step.color}15` }}
                >
                  {step.icon}
                </div>

                {/* Content Card */}
                <div
                  className="flex-1 rounded-2xl p-5 md:p-6 transition-all duration-300 group-hover:-translate-y-0.5"
                  style={{ background: "#fff", border: "1px solid #f0f0f2", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = `${step.color}30`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.02)"; e.currentTarget.style.borderColor = "#f0f0f2"; }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-[12px] font-bold px-3 py-1 rounded-full"
                      style={{ background: `${step.color}10`, color: step.color }}
                    >
                      {step.time}
                    </span>
                  </div>
                  <h3 className="text-[17px] md:text-[18px] font-black text-[#1B2D4F] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-[#8B6E96] font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
