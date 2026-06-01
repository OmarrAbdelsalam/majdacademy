"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLandingContent } from "../landing/useLandingContent";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "default" | "learn-arabic";
}

const grades = Array.from({ length: 12 }, (_, i) => i + 1);

const subjects = {
  ar: [
    { id: "arabic", label: "اللغة العربية" },
    { id: "islamic", label: "التربية الإسلامية" },
    { id: "both", label: "الاثنين معاً" },
  ],
  en: [
    { id: "arabic", label: "Arabic Language" },
    { id: "islamic", label: "Islamic Education" },
    { id: "both", label: "Both Subjects" },
  ],
};

const packages = {
  ar: [
    { id: "comprehensive", title: "الباقة الشاملة", price: "600", period: "درهم/شهرياً", desc: "المادتين معاً · 8 حصص", popular: true },
    { id: "basic", title: "الباقة الأساسية", price: "400", period: "درهم/شهرياً", desc: "مادة واحدة · 4 حصص", popular: false },
  ],
  en: [
    { id: "comprehensive", title: "Comprehensive", price: "600", period: "AED/month", desc: "Both subjects · 8 sessions", popular: true },
    { id: "basic", title: "Basic", price: "400", period: "AED/month", desc: "One subject · 4 sessions", popular: false },
  ],
};

export default function BookingModal({ isOpen, onClose, variant = "default" }: BookingModalProps) {
  const content = useLandingContent();
  const isArabic = content.hero.cta === "احجز حصة مجانية";

  const [step, setStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<"uae-curriculum" | "learn-arabic" | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Determine effective variant: either from prop or from user selection
  const effectiveVariant = variant === "learn-arabic" ? "learn-arabic" : (selectedProgram === "learn-arabic" ? "learn-arabic" : "default");
  const isLearnArabic = effectiveVariant === "learn-arabic";
  const showProgramSelection = variant === "default";

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedProgram(null);
        setSelectedGrade(null);
        setSelectedSubject(null);
        setSelectedPackage(null);
        setSelectedLevel(null);
        setName("");
        setPhone("");
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const currentSubjects = isArabic ? subjects.ar : subjects.en;
  const currentPackages = isArabic ? packages.ar : packages.en;

  // Learn Arabic specific content
  const learnArabicLevels = {
    ar: [
      { id: "beginner", label: "مبتدئ — لا يعرف الحروف" },
      { id: "elementary", label: "يعرف الحروف — يحتاج يقرأ ويكتب" },
      { id: "intermediate", label: "يقرأ ويكتب — يحتاج محادثة وقواعد" },
      { id: "adult", label: "كبير يبي يتعلم من الصفر" },
    ],
    en: [
      { id: "beginner", label: "Beginner — doesn't know the alphabet" },
      { id: "elementary", label: "Knows letters — needs reading & writing" },
      { id: "intermediate", label: "Reads & writes — needs conversation & grammar" },
      { id: "adult", label: "Adult learning from scratch" },
    ],
  };

  const learnArabicPackages = {
    ar: [
      { id: "intensive", title: "الباقة المكثفة", price: "500", period: "درهم/شهرياً", desc: "8 حصص شهرياً · 45 دقيقة", popular: true },
      { id: "standard", title: "الباقة العادية", price: "300", period: "درهم/شهرياً", desc: "4 حصص شهرياً · 45 دقيقة", popular: false },
    ],
    en: [
      { id: "intensive", title: "Intensive", price: "500", period: "AED/month", desc: "8 sessions/month · 45 min", popular: true },
      { id: "standard", title: "Standard", price: "300", period: "AED/month", desc: "4 sessions/month · 45 min", popular: false },
    ],
  };

  const currentLearnArabicLevels = isArabic ? learnArabicLevels.ar : learnArabicLevels.en;
  const currentLearnArabicPackages = isArabic ? learnArabicPackages.ar : learnArabicPackages.en;

  // For learn-arabic (direct): step 1 = level, step 2 = package, step 3 = contact
  // For default: step 1 = program choice, then:
  //   if uae-curriculum: step 2 = grade, step 3 = subject, step 4 = package, step 5 = contact
  //   if learn-arabic: step 2 = level, step 3 = package, step 4 = contact
  const totalSteps = variant === "learn-arabic" ? 3 : (selectedProgram === "learn-arabic" ? 4 : 5);

  const canProceedStep1 = variant === "learn-arabic" ? selectedLevel !== null : selectedProgram !== null;
  const canProceedStep2 = isLearnArabic 
    ? (variant === "learn-arabic" ? selectedPackage !== null : selectedLevel !== null) 
    : selectedGrade !== null;
  const canProceedStep3 = isLearnArabic 
    ? (variant === "learn-arabic" ? (name.trim().length > 0 && phone.trim().length >= 9) : selectedPackage !== null) 
    : selectedSubject !== null;
  const canProceedStep4 = isLearnArabic 
    ? (name.trim().length > 0 && phone.trim().length >= 9) 
    : selectedPackage !== null;
  const canSubmit = name.trim().length > 0 && phone.trim().length >= 9;

  const handleNext = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleSubmit = () => {
    let message: string;
    if (isLearnArabic) {
      const levelText = currentLearnArabicLevels.find(l => l.id === selectedLevel)?.label || "";
      const packageText = currentLearnArabicPackages.find(p => p.id === selectedPackage)?.title || "";
      message = isArabic
        ? `السلام عليكم، أبي أحجز حصة مجانية لتعلم العربية.\n\nالاسم: ${name}\nالتواصل: ${phone}\nالمستوى: ${levelText}\nالباقة المتوقعة: ${packageText}`
        : `Hello, I'd like to book a free Arabic learning class.\n\nName: ${name}\nContact: ${phone}\nLevel: ${levelText}\nExpected Package: ${packageText}`;
    } else {
      const gradeText = isArabic ? `الصف ${selectedGrade}` : `Grade ${selectedGrade}`;
      const subjectText = currentSubjects.find(s => s.id === selectedSubject)?.label || "";
      const packageText = currentPackages.find(p => p.id === selectedPackage)?.title || "";
      message = isArabic
        ? `السلام عليكم، أبي أحجز حصة مجانية لولدي.\n\nالاسم: ${name}\nالتواصل: ${phone}\n${gradeText}\nالمادة: ${subjectText}\nالباقة المتوقعة: ${packageText}`
        : `Hello, I'd like to book a free class for my child.\n\nName: ${name}\nContact: ${phone}\n${gradeText}\nSubject: ${subjectText}\nExpected Package: ${packageText}`;
    }

    const whatsappUrl = `https://wa.me/201098505924?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  const totalStepsDisplay = totalSteps;

  const slideVariants = {
    enter: { opacity: 0, x: isArabic ? -20 : 20, scale: 0.98 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: isArabic ? 20 : -20, scale: 0.98 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] rounded-[28px] overflow-hidden shadow-2xl bg-[#f7f7f8]"
          >
            {/* Content */}
            <div className="p-7 pb-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <motion.h2
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[22px] font-black text-[#262626] leading-tight"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {isArabic ? "احجز حصتك المجانية" : "Book your free class"}
                </motion.h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors flex-shrink-0 mt-0.5"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-1.5 mb-7">
                {Array.from({ length: totalStepsDisplay }, (_, i) => i + 1).map((s) => (
                  <motion.div
                    key={s}
                    className="h-[3px] rounded-full flex-1"
                    initial={false}
                    animate={{
                      backgroundColor: s <= step ? "#ef5da8" : "rgba(0,0,0,0.08)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* Steps */}
              <AnimatePresence mode="wait">
                {/* ===== LEARN ARABIC VARIANT (from prop) ===== */}
                {variant === "learn-arabic" && step === 1 && (
                  <motion.div
                    key="la-step1"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "إيش مستواه في العربي؟" : "What's their Arabic level?"}
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {currentLearnArabicLevels.map((level) => (
                        <motion.button
                          key={level.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedLevel(level.id)}
                          className={`w-full py-4 px-5 rounded-2xl text-[15px] font-semibold transition-all duration-200 flex items-center gap-3 ${
                            selectedLevel === level.id
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626]/70 hover:bg-[#ef5da8]/5 hover:text-[#262626]"
                          }`}
                        >
                          <span className="flex-1 text-start">{level.label}</span>
                          {selectedLevel === level.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-[#d3ff5f] flex items-center justify-center"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={canProceedStep1 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep1 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep1 && handleNext(2)}
                      disabled={!canProceedStep1}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep1
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {variant === "learn-arabic" && step === 2 && (
                  <motion.div
                    key="la-step2"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "أي باقة تناسبكم؟" : "Which package suits you?"}
                    </p>

                    <div className="flex flex-col gap-3">
                      {currentLearnArabicPackages.map((pkg) => (
                        <motion.button
                          key={pkg.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative w-full p-5 rounded-2xl text-start transition-all duration-200 ${
                            selectedPackage === pkg.id
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626] hover:bg-[#ef5da8]/5"
                          }`}
                        >
                          {pkg.popular && (
                            <span className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              selectedPackage === pkg.id ? "bg-[#d3ff5f] text-[#262626]" : "bg-[#ef5da8]/10 text-[#ef5da8]"
                            }`}>
                              {isArabic ? "الأكثر طلباً" : "Popular"}
                            </span>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-bold text-[15px]">{pkg.title}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-black text-[22px]">{pkg.price}</span>
                              <span className={`text-[11px] font-medium ${selectedPackage === pkg.id ? "text-white/50" : "text-[#262626]/35"}`}>
                                {pkg.period}
                              </span>
                            </div>
                          </div>
                          <p className={`text-[13px] mt-1 font-medium ${selectedPackage === pkg.id ? "text-white/50" : "text-[#262626]/40"}`}>
                            {pkg.desc}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={canProceedStep2 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep2 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep2 && handleNext(3)}
                      disabled={!canProceedStep2}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep2
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {variant === "learn-arabic" && step === 3 && (
                  <motion.div
                    key="la-step3"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "خطوة أخيرة — بيانات التواصل" : "Last step — your contact info"}
                    </p>

                    <div className="flex flex-col gap-3">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isArabic ? "الاسم" : "Name"}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-0 text-[#262626] text-[15px] font-medium placeholder:text-[#262626]/30 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-shadow"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isArabic ? "رقم الواتساب" : "WhatsApp number"}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-0 text-[#262626] text-[15px] font-medium placeholder:text-[#262626]/30 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-shadow"
                        dir="ltr"
                      />
                    </div>

                    {/* Summary */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="px-3 py-1.5 rounded-full bg-[#ef5da8]/10 text-[#262626] text-[12px] font-bold">
                        {currentLearnArabicLevels.find(l => l.id === selectedLevel)?.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[#d3ff5f]/30 text-[#262626] text-[12px] font-bold">
                        {currentLearnArabicPackages.find(p => p.id === selectedPackage)?.title}
                      </span>
                    </div>

                    <motion.button
                      whileHover={canProceedStep3 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep3 ? { scale: 0.98 } : {}}
                      onClick={handleSubmit}
                      disabled={!canProceedStep3}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep3
                          ? "bg-[#ef5da8] text-white shadow-lg shadow-[#ef5da8]/30 hover:shadow-xl hover:shadow-[#ef5da8]/40"
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "احجز الحصة المجانية" : "Book Free Class"}
                    </motion.button>

                    <p className="text-center text-[12px] text-[#262626]/40 mt-3 font-medium">
                      {isArabic ? "هنتواصل معاك خلال ساعات قليلة" : "We'll contact you within a few hours"}
                    </p>
                  </motion.div>
                )}

                {/* ===== DEFAULT VARIANT ===== */}
                {/* Step 1: Program Selection */}
                {showProgramSelection && step === 1 && (
                  <motion.div
                    key="prog-step1"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "تبي تسجل في إيش؟" : "What would you like to enroll in?"}
                    </p>

                    <div className="flex flex-col gap-2.5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedProgram("uae-curriculum")}
                        className={`w-full py-5 px-5 rounded-2xl text-[15px] font-semibold transition-all duration-200 flex items-center gap-3 ${
                          selectedProgram === "uae-curriculum"
                            ? "bg-[#262626] text-white shadow-lg"
                            : "bg-white text-[#262626]/70 hover:bg-[#ef5da8]/5 hover:text-[#262626]"
                        }`}
                      >
                        <span className="flex-1 text-start">
                          <span className="block font-bold text-[16px]">{isArabic ? "مناهج الإمارات" : "UAE Curriculum"}</span>
                          <span className={`block text-[13px] mt-0.5 ${selectedProgram === "uae-curriculum" ? "text-white/60" : "text-[#262626]/40"}`}>
                            {isArabic ? "عربي · تربية إسلامية" : "Arabic · Islamic Education"}
                          </span>
                        </span>
                        {selectedProgram === "uae-curriculum" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-[#d3ff5f] flex items-center justify-center"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedProgram("learn-arabic")}
                        className={`w-full py-5 px-5 rounded-2xl text-[15px] font-semibold transition-all duration-200 flex items-center gap-3 ${
                          selectedProgram === "learn-arabic"
                            ? "bg-[#262626] text-white shadow-lg"
                            : "bg-white text-[#262626]/70 hover:bg-[#ef5da8]/5 hover:text-[#262626]"
                        }`}
                      >
                        <span className="flex-1 text-start">
                          <span className="block font-bold text-[16px]">{isArabic ? "تعلم العربية لغير الناطقين" : "Arabic for Non-Native Speakers"}</span>
                          <span className={`block text-[13px] mt-0.5 ${selectedProgram === "learn-arabic" ? "text-white/60" : "text-[#262626]/40"}`}>
                            {isArabic ? "قراءة · كتابة · محادثة" : "Reading · Writing · Conversation"}
                          </span>
                        </span>
                        {selectedProgram === "learn-arabic" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-[#d3ff5f] flex items-center justify-center"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={canProceedStep1 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep1 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep1 && handleNext(2)}
                      disabled={!canProceedStep1}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep1
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default + Learn Arabic (selected from program): Step 2 = Level */}
                {showProgramSelection && selectedProgram === "learn-arabic" && step === 2 && (
                  <motion.div
                    key="prog-la-step2"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "إيش مستواه في العربي؟" : "What's their Arabic level?"}
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {currentLearnArabicLevels.map((level) => (
                        <motion.button
                          key={level.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedLevel(level.id)}
                          className={`w-full py-4 px-5 rounded-2xl text-[15px] font-semibold transition-all duration-200 flex items-center gap-3 ${
                            selectedLevel === level.id
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626]/70 hover:bg-[#ef5da8]/5 hover:text-[#262626]"
                          }`}
                        >
                          <span className="flex-1 text-start">{level.label}</span>
                          {selectedLevel === level.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-[#d3ff5f] flex items-center justify-center"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={selectedLevel !== null ? { scale: 1.02, y: -2 } : {}}
                      whileTap={selectedLevel !== null ? { scale: 0.98 } : {}}
                      onClick={() => selectedLevel !== null && handleNext(3)}
                      disabled={selectedLevel === null}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        selectedLevel !== null
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default + Learn Arabic (selected from program): Step 3 = Package */}
                {showProgramSelection && selectedProgram === "learn-arabic" && step === 3 && (
                  <motion.div
                    key="prog-la-step3"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "أي باقة تناسبكم؟" : "Which package suits you?"}
                    </p>

                    <div className="flex flex-col gap-3">
                      {currentLearnArabicPackages.map((pkg) => (
                        <motion.button
                          key={pkg.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative w-full p-5 rounded-2xl text-start transition-all duration-200 ${
                            selectedPackage === pkg.id
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626] hover:bg-[#ef5da8]/5"
                          }`}
                        >
                          {pkg.popular && (
                            <span className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              selectedPackage === pkg.id ? "bg-[#d3ff5f] text-[#262626]" : "bg-[#ef5da8]/10 text-[#ef5da8]"
                            }`}>
                              {isArabic ? "الأكثر طلباً" : "Popular"}
                            </span>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-bold text-[15px]">{pkg.title}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-black text-[22px]">{pkg.price}</span>
                              <span className={`text-[11px] font-medium ${selectedPackage === pkg.id ? "text-white/50" : "text-[#262626]/35"}`}>
                                {pkg.period}
                              </span>
                            </div>
                          </div>
                          <p className={`text-[13px] mt-1 font-medium ${selectedPackage === pkg.id ? "text-white/50" : "text-[#262626]/40"}`}>
                            {pkg.desc}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={selectedPackage !== null ? { scale: 1.02, y: -2 } : {}}
                      whileTap={selectedPackage !== null ? { scale: 0.98 } : {}}
                      onClick={() => selectedPackage !== null && handleNext(4)}
                      disabled={selectedPackage === null}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        selectedPackage !== null
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default + Learn Arabic (selected from program): Step 4 = Contact */}
                {showProgramSelection && selectedProgram === "learn-arabic" && step === 4 && (
                  <motion.div
                    key="prog-la-step4"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "خطوة أخيرة — بيانات التواصل" : "Last step — your contact info"}
                    </p>

                    <div className="flex flex-col gap-3">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isArabic ? "الاسم" : "Name"}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-0 text-[#262626] text-[15px] font-medium placeholder:text-[#262626]/30 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-shadow"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isArabic ? "رقم الواتساب" : "WhatsApp number"}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-0 text-[#262626] text-[15px] font-medium placeholder:text-[#262626]/30 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-shadow"
                        dir="ltr"
                      />
                    </div>

                    {/* Summary */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="px-3 py-1.5 rounded-full bg-[#ef5da8]/10 text-[#262626] text-[12px] font-bold">
                        {currentLearnArabicLevels.find(l => l.id === selectedLevel)?.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[#d3ff5f]/30 text-[#262626] text-[12px] font-bold">
                        {currentLearnArabicPackages.find(p => p.id === selectedPackage)?.title}
                      </span>
                    </div>

                    <motion.button
                      whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canSubmit ? { scale: 0.98 } : {}}
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canSubmit
                          ? "bg-[#ef5da8] text-white shadow-lg shadow-[#ef5da8]/30 hover:shadow-xl hover:shadow-[#ef5da8]/40"
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "احجز الحصة المجانية" : "Book Free Class"}
                    </motion.button>

                    <p className="text-center text-[12px] text-[#262626]/40 mt-3 font-medium">
                      {isArabic ? "هنتواصل معاك خلال ساعات قليلة" : "We'll contact you within a few hours"}
                    </p>
                  </motion.div>
                )}

                {/* Default + UAE Curriculum: Step 2 = Grade */}
                {showProgramSelection && selectedProgram === "uae-curriculum" && step === 2 && (
                  <motion.div
                    key="step1"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "ولدك في أي صف؟" : "What grade is your child in?"}
                    </p>

                    <div className="grid grid-cols-4 gap-2">
                      {grades.map((grade) => (
                        <motion.button
                          key={grade}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedGrade(grade)}
                          className={`py-3 rounded-2xl text-[15px] font-bold transition-colors duration-200 ${
                            selectedGrade === grade
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626] hover:bg-[#d3ff5f]/40"
                          }`}
                        >
                          {grade}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={canProceedStep2 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep2 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep2 && handleNext(3)}
                      disabled={!canProceedStep2}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep2
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default + UAE Curriculum: Step 3 = Subject */}
                {showProgramSelection && selectedProgram === "uae-curriculum" && step === 3 && (
                  <motion.div
                    key="step3"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "يبي يدرس إيش؟" : "What would they like to study?"}
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {currentSubjects.map((subject) => (
                        <motion.button
                          key={subject.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedSubject(subject.id)}
                          className={`w-full py-4 px-5 rounded-2xl text-[15px] font-semibold transition-all duration-200 flex items-center gap-3 ${
                            selectedSubject === subject.id
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626]/70 hover:bg-[#ef5da8]/5 hover:text-[#262626]"
                          }`}
                        >
                          <span className="flex-1 text-start">{subject.label}</span>
                          {selectedSubject === subject.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-[#d3ff5f] flex items-center justify-center"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={canProceedStep3 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep3 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep3 && handleNext(4)}
                      disabled={!canProceedStep3}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep3
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default + UAE Curriculum: Step 4 = Package */}
                {showProgramSelection && selectedProgram === "uae-curriculum" && step === 4 && (
                  <motion.div
                    key="step3"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "أي باقة تناسبكم؟" : "Which package suits you?"}
                    </p>

                    <div className="flex flex-col gap-3">
                      {currentPackages.map((pkg) => (
                        <motion.button
                          key={pkg.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative w-full p-5 rounded-2xl text-start transition-all duration-200 ${
                            selectedPackage === pkg.id
                              ? "bg-[#262626] text-white shadow-lg"
                              : "bg-white text-[#262626] hover:bg-[#ef5da8]/5"
                          }`}
                        >
                          {pkg.popular && (
                            <span className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              selectedPackage === pkg.id ? "bg-[#d3ff5f] text-[#262626]" : "bg-[#ef5da8]/10 text-[#ef5da8]"
                            }`}>
                              {isArabic ? "الأكثر طلباً" : "Popular"}
                            </span>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-bold text-[15px]">{pkg.title}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-black text-[22px]">{pkg.price}</span>
                              <span className={`text-[11px] font-medium ${selectedPackage === pkg.id ? "text-white/50" : "text-[#262626]/35"}`}>
                                {pkg.period}
                              </span>
                            </div>
                          </div>
                          <p className={`text-[13px] mt-1 font-medium ${selectedPackage === pkg.id ? "text-white/50" : "text-[#262626]/40"}`}>
                            {pkg.desc}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={canProceedStep4 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep4 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep4 && handleNext(5)}
                      disabled={!canProceedStep4}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep4
                          ? "bg-[#d3ff5f] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default + UAE Curriculum: Step 5 = Contact */}
                {showProgramSelection && selectedProgram === "uae-curriculum" && step === 5 && (
                  <motion.div
                    key="step4"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "خطوة أخيرة — بيانات التواصل" : "Last step — your contact info"}
                    </p>

                    <div className="flex flex-col gap-3">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isArabic ? "اسم ولي الأمر" : "Parent's name"}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-0 text-[#262626] text-[15px] font-medium placeholder:text-[#262626]/30 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-shadow"
                      />
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isArabic ? "رقم الواتساب" : "WhatsApp number"}
                        className="w-full px-5 py-4 rounded-2xl bg-white border-0 text-[#262626] text-[15px] font-medium placeholder:text-[#262626]/30 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-shadow"
                        dir="ltr"
                      />
                    </div>

                    {/* Summary */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="px-3 py-1.5 rounded-full bg-[#d3ff5f]/30 text-[#262626] text-[12px] font-bold">
                        {isArabic ? `الصف ${selectedGrade}` : `Grade ${selectedGrade}`}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[#ef5da8]/10 text-[#262626] text-[12px] font-bold">
                        {currentSubjects.find(s => s.id === selectedSubject)?.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[#d3ff5f]/30 text-[#262626] text-[12px] font-bold">
                        {currentPackages.find(p => p.id === selectedPackage)?.title}
                      </span>
                    </div>

                    <motion.button
                      whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canSubmit ? { scale: 0.98 } : {}}
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canSubmit
                          ? "bg-[#ef5da8] text-white shadow-lg shadow-[#ef5da8]/30 hover:shadow-xl hover:shadow-[#ef5da8]/40"
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "احجز الحصة المجانية" : "Book Free Class"}
                    </motion.button>

                    <p className="text-center text-[12px] text-[#262626]/40 mt-3 font-medium">
                      {isArabic ? "هنتواصل معاك خلال ساعات قليلة" : "We'll contact you within a few hours"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Back button — shown on steps 2-4 */}
              {step > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setStep(step - 1)}
                  className="mt-3 w-full py-2 text-center text-[13px] font-semibold text-[#262626]/40 hover:text-[#ef5da8] transition-colors"
                >
                  {isArabic ? "← رجوع" : "← Back"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
