"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountry, COUNTRIES } from "../../i18n/CountryContext";
import { useLang } from "../../i18n/LangContext";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Languages, Globe, X } from "lucide-react";
import Image from "next/image";

export default function CountryWelcomeModal({ 
  isOpen, 
  onClose,
  initialStep,
  intent = "select"
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialStep?: 1 | 2;
  intent?: "select" | "booking";
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const { setCountry } = useCountry();
  const { lang } = useLang();
  const pathname = usePathname();
  const router = useRouter();

  // Determine if we are on the Home Page
  const isHome = pathname === "/" || pathname === "/ar" || pathname === "/en";

  useEffect(() => {
    if (isOpen) {
      // Set initial step depending on the page or prop
      if (initialStep) {
        setStep(initialStep);
      } else if (isHome) {
        setStep(1);
      } else {
        setStep(2);
      }
    }
  }, [isOpen, isHome, initialStep]);

  const handleSelectCountry = (id: string) => {
    setCountry(id as any);
    onClose();
    if (typeof window !== "undefined") {
      (window as any)._hasRedirectedToCurriculums = true;
    }
    
    const isHomeOrCurriculums = isHome || pathname.includes("/curriculums");
    const bookingQuery = intent === "booking" ? `&booking=true` : "";
    
    if (isHomeOrCurriculums) {
      router.push(`/${lang}/curriculums?country=${id}${bookingQuery}`);
    } else {
      router.push(`${pathname}?country=${id}${bookingQuery}`);
    }
  };

  const handleNonNative = () => {
    onClose();
    const bookingQuery = intent === "booking" ? `?booking=true` : "";
    router.push(`/${lang}/learn-arabic${bookingQuery}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[420px] bg-white rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-2xl p-4 sm:p-7"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-3 sm:top-4 ${lang === "ar" ? "left-3 sm:left-4" : "right-3 sm:right-4"} w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors z-10`}
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="text-center mb-3 sm:mb-6 mt-1 sm:mt-0">
              <div className="flex justify-center mb-1">
                <Image src="/majd.png" alt="Majd" width={80} height={80} className="h-8 sm:h-14 w-auto object-contain" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-[20px] sm:text-[24px] font-bold text-[#262626] mb-2">
                      {lang === "ar" ? "اختر مسار التعلم" : "Choose Learning Path"}
                    </h2>
                    <p className="text-[14px] text-gray-500 font-medium">
                      {lang === "ar" ? "حدد المسار المناسب لنرشدك للبرامج الصحيحة" : "Select the appropriate path so we can guide you"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="group relative flex items-center p-4 sm:p-5 rounded-[20px] border border-gray-100 bg-white hover:border-[#f04da1] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(240,77,161,0.12)] overflow-hidden text-start"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#f04da1]/5 to-[#f04da1]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fef0f8] flex items-center justify-center text-[#f04da1] shrink-0 ml-4 rtl:ml-4 ltr:mr-4">
                         <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      
                      <div className="relative z-10 flex-1">
                         <h3 className="font-bold text-[16px] sm:text-[17px] text-[#262626] mb-1 group-hover:text-[#f04da1] transition-colors">
                            {lang === "ar" ? "المناهج الدراسية لدول الخليج" : "Gulf School Curricula"}
                         </h3>
                         <p className="text-[13px] text-gray-500 font-medium">
                            {lang === "ar" ? "تأسيس ومتابعة للمناهج المعتمدة" : "Foundation & curriculum tracking"}
                         </p>
                      </div>

                      <div className="relative z-10 w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#f04da1] flex items-center justify-center transition-colors shrink-0">
                         <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleNonNative}
                      className="group relative flex items-center p-4 sm:p-5 rounded-[20px] border border-gray-100 bg-white hover:border-[#2563eb] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] overflow-hidden text-start"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/5 to-[#2563eb]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0 ml-4 rtl:ml-4 ltr:mr-4">
                         <Languages className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      
                      <div className="relative z-10 flex-1">
                         <h3 className="font-bold text-[16px] sm:text-[17px] text-[#262626] mb-1 group-hover:text-[#2563eb] transition-colors">
                            {lang === "ar" ? "تعلم العربية لغير الناطقين" : "Learn Arabic for Non-Natives"}
                         </h3>
                         <p className="text-[13px] text-gray-500 font-medium">
                            {lang === "ar" ? "برامج مخصصة وتفاعلية" : "Specialized interactive programs"}
                         </p>
                      </div>

                      <div className="relative z-10 w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#2563eb] flex items-center justify-center transition-colors shrink-0">
                         <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-1 sm:gap-2.5">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCountry(c.id)}
                        className="w-full flex items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#f9f9f9] border border-transparent hover:border-[#262626]/20 hover:bg-[#262626]/5 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3.5">
                          {c.flag === "un" ? (
                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[#262626]/60 group-hover:text-[#262626] transition-colors" />
                          ) : (
                            <img
                              src={`https://flagcdn.com/w40/${c.flag}.png`}
                              alt=""
                              className="w-6 h-4 sm:w-8 sm:h-5.5 object-cover rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                          <span className="font-bold text-[13px] sm:text-[16px] text-[#262626] group-hover:text-[#262626] transition-colors">
                            {lang === "ar" ? c.labelAr : c.labelEn}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[10px] sm:text-[12px] font-bold text-[#262626]/40 uppercase tracking-wide group-hover:text-[#262626]/70 transition-colors">
                            {c.currencyEn}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#262626]/20 group-hover:text-[#262626] transition-colors w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }}>
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                  {isHome && (
                    <button
                      onClick={() => setStep(1)}
                      className="mt-3 sm:mt-4 w-full py-1.5 sm:py-2 text-[12px] sm:text-[13px] font-semibold text-[#262626]/50 hover:text-[#262626] transition-colors"
                    >
                      {lang === "ar" ? "← رجوع للوراء" : "← Go back"}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
