"use client";
import React, { useState } from "react";
import { UserPlus, BookMarked, CalendarCheck, Rocket, ArrowLeftCircle } from "lucide-react";
import BookingModal from "./BookingModal";

const stepsRight = [
  {
    number: "01",
    title: "سجّل بياناتك",
    description: "عبّي النموذج البسيط واختار صف ولدك. ما ياخذ أكثر من دقيقة.",
    icon: <UserPlus className="w-6 h-6" strokeWidth={1.5} />,
    color: "#F0548B",
  },
  {
    number: "02",
    title: "اختار المواد",
    description: "حدد المواد اللي يحتاجها ولدك — مادة وحدة أو المنهج كامل.",
    icon: <BookMarked className="w-6 h-6" strokeWidth={1.5} />,
    color: "#FFC843",
  },
];

const stepsLeft = [
  {
    number: "03",
    title: "احجز الحصة المجانية",
    description: "جرّب قبل ما تلتزم. نرتب لك حصة تجريبية مع المعلم المناسب.",
    icon: <CalendarCheck className="w-6 h-6" strokeWidth={1.5} />,
    color: "#1B2D4F",
  },
  {
    number: "04",
    title: "ابدأ رحلة التفوق!",
    description: "بعد الحصة التجريبية، اختار باقتك وابدأ مشوار ولدك نحو المَجْد.",
    icon: <Rocket className="w-6 h-6" strokeWidth={1.5} />,
    color: "#F0548B",
  },
];

export default function HowToStartSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <section className="py-16 md:py-[100px] bg-white relative overflow-hidden" dir="rtl">
      {/* Subtle background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#F0548B 1px, transparent 1px), linear-gradient(90deg, #F0548B 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl md:text-[44px] font-black text-[#1B2D4F] mb-4 leading-tight">
            كيف تبدأ مع <span className="text-[#F0548B]">مَجْد</span>؟
          </h2>
          <p className="text-[#8B6E96] text-lg md:text-[20px] font-medium max-w-2xl mx-auto leading-relaxed">
            أربع خطوات بسيطة وولدك يبدأ رحلة التفوق
          </p>
        </div>

        {/* Layout: Steps Right | Phone Center | Steps Left */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6">

          {/* Right Steps */}
          <div className="w-full lg:w-[30%] flex flex-col gap-10">
            {stepsRight.map((step) => (
              <div key={step.number} className="flex items-start gap-4 text-right">
                <div className="flex-1">
                  <h3 className="text-[20px] font-black text-[#1B2D4F] mb-2">{step.title}</h3>
                  <p className="text-[14px] text-[#8B6E96] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  {step.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Center Phone Mockup */}
          <div className="w-full lg:w-[34%] flex justify-center relative py-8 lg:py-0">
            <div
              className="w-full max-w-[300px] aspect-[9/16] rounded-[40px] flex flex-col items-center justify-center p-6 relative overflow-hidden"
              style={{ background: "linear-gradient(160deg, #fef0f5, #fff5f8)", border: "2px solid rgba(240,84,139,0.1)", boxShadow: "0 20px 60px rgba(240,84,139,0.1)" }}
            >
              {/* Phone notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full" style={{ background: "rgba(240,84,139,0.08)" }}></div>

              {/* Content inside phone */}
              <div className="flex flex-col items-center text-center mt-6">
                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: "rgba(240,84,139,0.1)" }}>
                  <Rocket className="w-8 h-8 text-[#F0548B]" />
                </div>
                <p className="text-[#1B2D4F] font-black text-lg mb-2">مَجْد</p>
                <p className="text-[#8B6E96] text-xs font-medium mb-6">ابدأ رحلة التفوق</p>

                {/* Fake steps progress */}
                <div className="w-full space-y-3">
                  {["سجّل", "اختار", "احجز", "ابدأ"].map((label, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                        style={{ background: i < 2 ? "#F0548B" : "#e0e0e0" }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 h-2 rounded-full" style={{ background: i < 2 ? "rgba(240,84,139,0.2)" : "#f0f0f0" }}></div>
                      <span className="text-[11px] font-bold" style={{ color: i < 2 ? "#F0548B" : "#ccc" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: "rgba(255,200,67,0.08)" }}></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{ background: "rgba(240,84,139,0.06)" }}></div>
          </div>

          {/* Left Steps */}
          <div className="w-full lg:w-[30%] flex flex-col gap-10">
            {stepsLeft.map((step) => (
              <div key={step.number} className="flex items-start gap-4 text-right lg:text-left lg:flex-row-reverse">
                <div className="flex-1">
                  <h3 className="text-[20px] font-black text-[#1B2D4F] mb-2">{step.title}</h3>
                  <p className="text-[14px] text-[#8B6E96] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  {step.icon}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{ background: "#F0548B", boxShadow: "0 8px 25px rgba(240,84,139,0.3)" }}
          >
            <ArrowLeftCircle className="w-5 h-5" strokeWidth={2} />
            <span>سجل عيالك ويانا الحين</span>
          </button>
        </div>

      </div>
    </section>
    <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
