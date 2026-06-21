"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CountryWelcomeModal from "../shared/CountryWelcomeModal";
import BookingModal from "../shared/BookingModal";
import { usePathname } from "next/navigation";
import { getLandingContent } from "./getLandingContent";
import { useCountry } from "../../i18n/CountryContext";
import { ChevronLeft, CheckCircle2, Users, Star } from "lucide-react";

export default function KodlandHero3({ locale }: { locale: string }) {
  const content = getLandingContent(locale);
  const isRTL = locale === "ar";
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/ar" || pathname === "/en";
  const { activeCountry } = useCountry();
  const countryText = isHome || activeCountry.id === "other" ? "بلدك" : activeCountry.labelAr;

  return (
    <section 
      className="relative w-full min-h-[90vh] bg-gradient-to-br from-[#fbcfe8] via-[#fdf2f8] to-white pt-32 pb-16 overflow-hidden flex items-center" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle Arabic Typography Watermark Image */}
      <div className="absolute top-0 left-0 w-[80%] md:w-[50%] h-full opacity-[0.08] pointer-events-none select-none z-0">
        <img 
          src="/hroof.png" 
          alt="Typography background" 
          className="w-full h-full object-contain object-left-top"
          style={{ filter: "brightness(0) saturate(100%) invert(37%) sepia(74%) saturate(2132%) hue-rotate(315deg) brightness(96%) contrast(96%)" }}
        />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#fbcfe8]/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-[#f472b6]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-[#fbcfe8]/65 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Right Side: Text Content */}
          <motion.div 
            className={`flex-1 flex flex-col items-center lg:items-start text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} space-y-8 max-w-3xl lg:max-w-2xl xl:max-w-3xl`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Headlines */}
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-extrabold text-[#2a3042] leading-[1.2] sm:leading-[1.15] tracking-tight w-full drop-shadow-sm">
              اصنع تفوق أبنائك
              <br className="hidden sm:block" />{" "}
              في <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f6428c] to-[#ff66a3]">اللغة العربية</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-[#262626]/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium px-2 sm:px-0">
              نقدم دروساً تفاعلية حية لتأسيس <span className="hidden sm:inline">وتفوق </span>أبنائكم في اللغة العربية والتربية الإسلامية بأسلوب يواكب المنهج المعتمد في {countryText}<span className="hidden sm:inline">، بالإضافة إلى برامج مخصصة لتعليم لغير الناطقين بها</span>.
            </p>

            {/* CTA Button */}
            <div className="pt-2 w-full sm:w-auto px-4 sm:px-0">
              <button 
                onClick={() => {
                  if (isHome) {
                    setIsCountryModalOpen(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#f6428c] to-[#ff66a3] text-white rounded-full text-[17px] sm:text-xl font-bold shadow-[0_10px_30px_rgba(246,66,140,0.3)] hover:shadow-[0_15px_35px_rgba(246,66,140,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                {isRTL ? <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" /> : null}
                احجز حصة تجريبية مجانية
                {!isRTL ? <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" /> : null}
              </button>
            </div>

            {/* Mobile-only Image Area (Between CTA and Stats) */}
            <motion.div 
              className="flex justify-center items-center relative w-full mt-2 lg:hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <div className="relative z-10 w-full max-w-[400px] aspect-square flex justify-center items-end [mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)]">
                <img 
                  src="/girlboy.png" 
                  alt="طلابنا" 
                  className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
                />
              </div>
            </motion.div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-8 pt-8 sm:pt-10 w-full border-t border-gray-200/60 mt-4">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-50 flex items-center justify-center shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="font-extrabold text-[#2a3042] text-lg sm:text-xl leading-tight">7 سنوات</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">خبرة تعليمية</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pink-50 flex items-center justify-center shadow-sm shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#f6428c]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="font-extrabold text-[#2a3042] text-lg sm:text-xl leading-tight">+500</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">طالب مستفيد</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 flex items-center justify-center shadow-sm shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-purple-500 text-purple-500" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="font-extrabold text-[#2a3042] text-lg sm:text-xl leading-tight">4.9/5</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">تقييم أولياء الأمور</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Left Side: Image Area (Desktop) */}
          <motion.div 
            className="hidden lg:flex flex-1 justify-center lg:justify-end items-center relative w-full lg:w-auto mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >

            {/* Image Area with bottom fade mask */}
            <div className="relative z-10 w-full max-w-[500px] lg:max-w-[650px] xl:max-w-[750px] aspect-square flex justify-center items-end [mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)]">
              <img 
                src="/girlboy.png" 
                alt="طلابنا" 
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Bottom section fade to melt into the next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-30" />
      
      <CountryWelcomeModal isOpen={isCountryModalOpen} onClose={() => setIsCountryModalOpen(false)} initialStep={1} intent="booking" />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={pathname?.includes("/learn-arabic") ? "learn-arabic" : "default"} />
    </section>
  );
}
