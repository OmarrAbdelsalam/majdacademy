"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLang } from "../../i18n/LangContext";
import PriceTable from "./PriceTable";

export default function PricesHero() {
  const { isRTL } = useLang();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formatted = new Intl.DateTimeFormat(isRTL ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    setCurrentDate(formatted);
  }, [isRTL]);

  return (
    <div className="w-full relative flex flex-col bg-[#FDFBF5] overflow-hidden">
      {/* Premium subtle gold glows */}
      <div className="absolute -top-32 -left-16 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#E9C237]/20 to-transparent blur-[60px] sm:blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 -right-16 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-tl from-[#C9A84C]/15 via-[#F5E6A3]/8 to-transparent blur-[50px] sm:blur-[80px] pointer-events-none z-0"></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30 md:opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(201, 168, 76, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201, 168, 76, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 50% 0%, #000 60%, transparent 100%)",
        }}
      ></div>

      {/* Fine noise texture */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <section
        className="relative w-full flex flex-col justify-center items-center overflow-visible z-10 pt-28 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Trust badge */}
        <motion.div
          className="flex items-center gap-2 mb-5 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex -space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#FDF1B8]" />
            <div className="w-2 h-2 rounded-full bg-[#F4CD58]" />
            <div className="w-2 h-2 rounded-full bg-[#D39C04]" />
          </div>
          <span
            className={`text-[11px] sm:text-[13px] font-semibold text-[#999] flex items-center gap-2 ${!isRTL ? "tracking-[0.2em] uppercase" : "tracking-normal"
              }`}
          >
            <span>{isRTL ? "تحديث مباشر لحظة بلحظة" : "Live Real-Time Updates"}</span>
            {currentDate && (
              <>
                <span className="text-[#ccc]">|</span>
                <span className="text-[#888]">{currentDate}</span>
              </>
            )}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-[30px] sm:text-[42px] md:text-[52px] lg:text-[60px] font-bold leading-[1.15] tracking-tight mb-4 sm:mb-5 text-[#1a1a1a] px-1 max-w-[900px] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {isRTL ? (
            <>
              أسعار{" "}
              <span className="text-[#E4B815]">الذهب والفضة</span> اليوم
            </>
          ) : (
            <>
              Today&apos;s{" "}
              <span className="text-[#E4B815]">Gold &amp; Silver</span> Prices
            </>
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-[13px] sm:text-[16px] md:text-[18px] text-[#777] leading-[1.7] max-w-[340px] sm:max-w-[700px] mb-10 sm:mb-12 font-medium px-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {isRTL
            ? "تابع أسعار الذهب عيار 24 و21 و18 وأسعار الفضة لحظة بلحظة بالجنيه المصري"
            : "Track live gold prices for 24K, 21K, 18K and silver prices in Egyptian Pounds"}
        </motion.p>

        {/* Price Table */}
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
        >
          <PriceTable />
        </motion.div>
      </section>
    </div>
  );
}
