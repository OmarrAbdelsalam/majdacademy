"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import BookingModal from "../shared/BookingModal";

export default function LearnArabicHero() {
  const { isRTL } = useLang();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = {
    ar: {
      line1: "تعلم العربية كأهلها",
      line2: "من الصفر",
      subtitle: "دورة تفاعلية لغير الناطقين بالعربية — قراءة وكتابة ومحادثة، لجميع الأعمار ومن دون الارتباط بمنهج محدد.",
      cta: "احجز حصة تجريبية",
    },
    en: {
      line1: "Teach your child Arabic",
      line2: "from scratch",
      subtitle: "An interactive course for non-Arabic speakers — reading, writing, and conversation, for any age without curriculum restrictions.",
      cta: "Book a trial class",
    },
  };

  const c = isRTL ? content.ar : content.en;

  return (
    <>
      <section 
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] pt-28 sm:pt-32 pb-16 flex items-center" 
        style={{ backgroundImage: "linear-gradient(to bottom, #e8347d, #f7599a, #ffffff)" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background Wrapper */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Subtle Arabic Typography Watermark Image (Left) */}
          <div 
            className="absolute top-0 left-[5%] w-[80%] md:w-[50%] h-full opacity-[0.09]"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, rgba(0,0,0,0) 80%)",
              maskImage: "radial-gradient(ellipse at center, black 20%, rgba(0,0,0,0) 80%)"
            }}
          >
            <img 
              src="/hroof.png" 
              alt="Typography background" 
              className="w-full h-full object-contain object-left-top"
            />
          </div>

          {/* Subtle Arabic Typography Watermark Image (Right) */}
          <div 
            className="absolute top-0 right-[5%] w-[80%] md:w-[50%] h-full opacity-[0.09]"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, rgba(0,0,0,0) 80%)",
              maskImage: "radial-gradient(ellipse at center, black 20%, rgba(0,0,0,0) 80%)"
            }}
          >
            <img 
              src="/hroof.png" 
              alt="Typography background" 
              className="w-full h-full object-contain object-right-top"
            />
          </div>

          {/* Vibrant Glow effects */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)" }} />
          <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,133,184,0.3) 0%, rgba(255,133,184,0) 60%)" }} />
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-40 flex justify-center">
          <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl">
            {/* Text Content */}
            <motion.div 
              className="flex-1 flex flex-col items-center text-center space-y-8 w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Premium Badge - Mobile Only */}
              <div className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1 bg-white/15 text-white/95 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f6428c] animate-pulse"></span>
                أكاديمية مجد لتعليم العربية
              </div>

              {/* Headlines */}
              <h1 className="text-[34px] sm:text-6xl md:text-7xl lg:text-[80px] font-black text-white leading-[1.1] tracking-tight w-full drop-shadow-md">
                {c.line1}
                <br className="hidden sm:block" />
                <span className="text-white block sm:inline-block mt-2 sm:mt-3 font-extrabold text-[20px] sm:text-5xl md:text-6xl lg:text-[70px] opacity-90">{c.line2}</span>
              </h1>

              {/* Description */}
              <p className="text-[13px] sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-sm px-4 sm:px-0">
                {c.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-4 w-full px-2 sm:px-0">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1 sm:gap-3 px-3 sm:px-10 py-3.5 sm:py-5 bg-white text-[#f6428c] rounded-full text-[14px] sm:text-xl font-bold shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 w-1/2 sm:w-auto"
                >
                  <span className="hidden sm:inline">{c.cta}</span>
                  <span className="sm:hidden">{c.cta}</span>
                </button>
              </div>

            </motion.div>

          </div>
        </div>
        
        {/* Bottom section fade to melt into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-30" style={{ backgroundImage: "linear-gradient(to top, #ffffff, rgba(255,255,255,0))" }} />
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant="learn-arabic" />
    </>
  );
}
