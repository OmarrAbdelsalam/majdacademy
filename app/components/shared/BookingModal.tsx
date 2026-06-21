"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLandingContent } from "../landing/useLandingContent";
import { useCountry, usePricing } from "../../i18n/CountryContext";
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
    { id: "comprehensive", title: "الباقة الشاملة", price: "1600", period: "درهم/شهرياً", desc: "10 حصص", popular: true },
    { id: "basic", title: "الباقة الأساسية", price: "1000", period: "درهم/شهرياً", desc: "6 حصص", popular: false },
  ],
  en: [
    { id: "comprehensive", title: "Comprehensive", price: "1600", period: "AED/month", desc: "10 sessions", popular: true },
    { id: "basic", title: "Basic", price: "1000", period: "AED/month", desc: "6 sessions", popular: false },
  ],
};

export default function BookingModal({ isOpen, onClose, variant = "default" }: BookingModalProps) {
  const content = useLandingContent();
  const isArabic = content.hero.cta === "احجز حصة مجانية";
  const { activeCountry } = useCountry();
  const { formatPrice } = usePricing();

  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedHourBlock, setSelectedHourBlock] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  const isLearnArabic = variant === "learn-arabic";

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedGrade(null);
        setSelectedSubject(null);
        setSelectedPackage(null);
        setSelectedLevel(null);
        setSelectedDay(null);
        setSelectedHourBlock(null);
        setName("");
        setPhone("");
        setIsSuccess(false);
        setWhatsappLink("");
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
  const currentPackages = (isArabic ? packages.ar : packages.en).map(pkg => {
    const { price, currency, icon } = formatPrice(pkg.price);
    const periodContent = (
      <span className="inline-flex items-center gap-1">
        {icon ? (
          <img src={icon} alt={currency} className="w-5 h-5 object-contain mix-blend-multiply dark:invert" />
        ) : (
          <span>{currency}</span>
        )}
        <span>{isArabic ? "/شهرياً" : "/month"}</span>
      </span>
    );
    return {
      ...pkg,
      price,
      period: periodContent
    };
  });

  // Learn Arabic specific content
  const learnArabicLevels = {
    ar: [
      { id: "beginner", label: "مبتدئ — لا يعرف الحروف" },
      { id: "elementary", label: "يعرف الحروف — يحتاج لتعلم القراءة والكتابة" },
      { id: "intermediate", label: "يقرأ ويكتب — يحتاج لتعلم المحادثة والقواعد" },
      { id: "adult", label: "شخص بالغ يرغب في التعلم من الصفر" },
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
      { id: "level-based", title: "باقة المستوى", price: "2000", period: "درهم/للمستوى", desc: "محادثة وقراءة وكتابة", popular: true },
    ],
    en: [
      { id: "level-based", title: "Level Package", price: "2000", period: "AED/level", desc: "Conversation, Reading, and Writing", popular: true },
    ],
  };

  const currentLearnArabicLevels = isArabic ? learnArabicLevels.ar : learnArabicLevels.en;
  // User explicitly said do NOT modify anything in Learn Arabic. So we leave it as is.
  const currentLearnArabicPackages = isArabic ? learnArabicPackages.ar : learnArabicPackages.en;

  // Time Blocks
  const daysList = [
    { id: "friday", dayAr: "الجمعة", dayEn: "Friday", blocks: [
      { id: "f1", startDubai: 16, endDubai: 21 },
    ] },
    { id: "saturday", dayAr: "السبت", dayEn: "Saturday", blocks: [
      { id: "s1", startDubai: 9, endDubai: 13 },
      { id: "s2", startDubai: 13, endDubai: 17 },
      { id: "s3", startDubai: 17, endDubai: 21 },
    ] },
    { id: "sunday", dayAr: "الأحد", dayEn: "Sunday", blocks: [
      { id: "su1", startDubai: 9, endDubai: 13 },
      { id: "su2", startDubai: 13, endDubai: 17 },
      { id: "su3", startDubai: 17, endDubai: 21 },
    ] },
    { id: "monday", dayAr: "الاثنين", dayEn: "Monday", blocks: [
      { id: "m1", startDubai: 18, endDubai: 21 },
    ] },
    { id: "tuesday", dayAr: "الثلاثاء", dayEn: "Tuesday", blocks: [
      { id: "t1", startDubai: 18, endDubai: 21 },
    ] },
    { id: "wednesday", dayAr: "الأربعاء", dayEn: "Wednesday", blocks: [
      { id: "w1", startDubai: 18, endDubai: 21 },
    ] },
    { id: "thursday", dayAr: "الخميس", dayEn: "Thursday", blocks: [
      { id: "th1", startDubai: 18, endDubai: 21 },
    ] },
  ];

  const formatTime = (hour24: number, isArabic: boolean) => {
    const periodAr = hour24 >= 12 ? "م" : "ص";
    const periodEn = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return isArabic ? `${hour12} ${periodAr}` : `${hour12} ${periodEn}`;
  };

  const getLocalTimeRange = (start: number, end: number, offset: number, isArabic: boolean) => {
    const localStart = start + offset;
    const localEnd = end + offset;
    return `${formatTime(localStart, isArabic)} - ${formatTime(localEnd, isArabic)}`;
  };

  const getPeriodLabel = (startHour: number) => {
    const hour = (startHour + 24) % 24;
    if (hour >= 5 && hour < 12) return { ar: "فترة صباحية", en: "Morning Period" };
    if (hour >= 12 && hour < 17) return { ar: "فترة الظهيرة", en: "Afternoon Period" };
    return { ar: "فترة مسائية", en: "Evening Period" };
  };

  const selectedDayData = daysList.find(d => d.id === selectedDay);
  const groupedBlocks = selectedDayData?.blocks.reduce((acc, block) => {
    const localStart = block.startDubai + (activeCountry.timeOffset || 0);
    const period = getPeriodLabel(localStart);
    const key = period.en;
    if (!acc[key]) acc[key] = { labelAr: period.ar, labelEn: period.en, blocks: [] };
    acc[key].blocks.push(block);
    return acc;
  }, {} as Record<string, { labelAr: string; labelEn: string; blocks: typeof selectedDayData.blocks }>);

  // For learn-arabic: step 1 = level, step 2 = package, step 3 = time, step 4 = contact
  // For default: step 1 = grade, step 2 = subject, step 3 = package, step 4 = time, step 5 = contact
  const totalSteps = isLearnArabic ? 4 : 5;

  const canProceedStep1 = isLearnArabic ? selectedLevel !== null : selectedGrade !== null;
  const canProceedStep2 = isLearnArabic ? selectedPackage !== null : selectedSubject !== null;
  const canProceedStep3 = isLearnArabic ? selectedHourBlock !== null : selectedPackage !== null;
  const canProceedStep4 = isLearnArabic ? false : selectedHourBlock !== null;
  const canSubmit = name.trim().length > 0 && phone.trim().length >= 9;

  const handleNext = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let message: string;
    const dayData = daysList.find(d => d.id === selectedDay);
    const hourBlock = dayData?.blocks.find(b => b.id === selectedHourBlock);
    let timeText = "";
    
    if (dayData && hourBlock) {
      const dubaiTimeStr = getLocalTimeRange(hourBlock.startDubai, hourBlock.endDubai, 0, isArabic);
      const localTimeStr = getLocalTimeRange(hourBlock.startDubai, hourBlock.endDubai, activeCountry.timeOffset || 0, isArabic);
      const dayName = isArabic ? dayData.dayAr : dayData.dayEn;
      
      timeText = isArabic 
        ? `${dayName} (${localTimeStr} بتوقيت ${activeCountry.labelAr} / ${dubaiTimeStr} بتوقيت دبي)`
        : `${dayName} (${localTimeStr} ${activeCountry.labelEn} time / ${dubaiTimeStr} Dubai time)`;
    }

    let formData: any = {
      date: new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }), // Log in Dubai time
      type: isLearnArabic ? "Learn Arabic" : "School Subjects",
      name,
      phone,
      country: activeCountry.labelEn,
      preferredTime: timeText,
    };

    if (isLearnArabic) {
      const levelText = currentLearnArabicLevels.find(l => l.id === selectedLevel)?.label || "";
      const packageObj = currentLearnArabicPackages.find(p => p.id === selectedPackage);
      const packageText = packageObj ? `${packageObj.title} (${packageObj.price} ${isArabic ? 'درهم' : 'AED'})` : "";
      
      formData.level = levelText;
      formData.package = packageText;
      formData.curriculum = isArabic ? activeCountry.labelAr : activeCountry.labelEn;

      message = isArabic
        ? `السلام عليكم، أودّ حجز حصة مجانية لتعلّم اللغة العربية.\n\nالاسم: ${name}\nالتواصل: ${phone}\nالبلد: ${formData.curriculum}\nالمستوى: ${levelText}\nالباقة المتوقعة: ${packageText}\nالموعد المفضّل: ${timeText}`
        : `Hello, I'd like to book a free Arabic learning class.\n\nName: ${name}\nContact: ${phone}\nCountry: ${formData.curriculum}\nLevel: ${levelText}\nExpected Package: ${packageText}\nPreferred Time: ${timeText}`;
    } else {
      const gradeText = isArabic ? `الصف ${selectedGrade}` : `Grade ${selectedGrade}`;
      const subjectText = currentSubjects.find(s => s.id === selectedSubject)?.label || "";
      const packageObj = currentPackages.find(p => p.id === selectedPackage);
      const packageText = packageObj ? `${packageObj.title} (${packageObj.price} ${isArabic ? 'درهم' : 'AED'})` : "";
      const curriculumText = isArabic ? activeCountry.labelAr : activeCountry.labelEn;
      
      formData.curriculum = curriculumText;
      formData.grade = `Grade ${selectedGrade}`;
      formData.subject = subjectText;
      formData.package = packageText;

      message = isArabic
        ? `السلام عليكم، أودّ حجز حصة مجانية لابني.\n\nالاسم: ${name}\nالتواصل: ${phone}\nالمنهج: ${curriculumText}\n${gradeText}\nالمادة: ${subjectText}\nالباقة المتوقعة: ${packageText}\nالموعد المفضّل: ${timeText}`
        : `Hello, I'd like to book a free class for my child.\n\nName: ${name}\nContact: ${phone}\nCurriculum: ${curriculumText}\n${gradeText}\nSubject: ${subjectText}\nExpected Package: ${packageText}\nPreferred Time: ${timeText}`;
    }

    // Attempt to book via Google Calendar API first
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name,
          studentEmail: phone + "@placeholder.com", // Using phone as a placeholder since email isn't in UI yet
          studentPhone: phone,
          childAge: isLearnArabic ? formData.level : formData.grade,
          selectedDay: selectedDay,
          blockStartHour: hourBlock?.startDubai,
          blockEndHour: hourBlock?.endDubai,
          courseType: formData.type,
          curriculum: formData.curriculum,
          grade: formData.grade,
          subject: formData.subject,
          packageName: formData.package,
          studentLevel: formData.level
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || (isArabic ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Error occurred. Please try again.'));
        setIsSubmitting(false);
        return;
      }
    } catch (e) {
      console.error("Booking API call failed", e);
      alert(isArabic ? 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' : 'Connection error. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Fallback/Continuation: Send data to Google Sheets
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      } catch (err) {
        console.error("Failed to submit to Google Sheets", err);
      }
    }

    const whatsappUrl = `https://wa.me/201098505924?text=${encodeURIComponent(message)}`;
    
    setWhatsappLink(whatsappUrl);
    setIsSuccess(true);
    setIsSubmitting(false);
    // We don't close the modal yet, the user will click the WhatsApp button in the success state
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
              
              {isSuccess ? (
                <motion.div
                  key="success-step"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-center justify-center text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </motion.div>
                  
                  <h3 className="text-2xl font-extrabold text-[#262626] mb-3">
                    {isArabic ? 'تم حفظ الحجز بنجاح!' : 'Booking saved successfully!'}
                  </h3>
                  
                  <p className="text-[15px] font-medium text-[rgba(38,38,38,0.6)] mb-8">
                    {isArabic 
                      ? 'خطوة واحدة متبقية لإتمام الحجز بالكامل وتأكيد الموعد.'
                      : 'One last step to confirm your booking completely.'}
                  </p>
                  
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#25D366] text-white font-bold text-[16px] shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.0003 2.00018C6.47715 2.00018 2 6.47733 2 12.0005C2 13.9161 2.54133 15.7061 3.47952 17.2094L2.00427 22.0002L6.90317 20.5316C8.35165 21.3658 10.108 21.8493 12.0003 21.8493C17.5234 21.8493 22.0006 17.3722 22.0006 11.849C22.0006 6.32587 17.5234 2.00018 12.0003 2.00018ZM17.1856 16.2736C16.9697 16.8837 15.932 17.3722 15.2891 17.4727C14.8194 17.5458 14.1287 17.6554 11.6669 16.636C8.51357 15.3308 6.46747 12.1288 6.30906 11.9187C6.15065 11.7085 5.0005 10.1804 5.0005 8.59972C5.0005 7.01901 5.80936 6.24237 6.13289 5.91851C6.42048 5.6311 6.88851 5.50022 7.32049 5.50022C7.46445 5.50022 7.59404 5.50753 7.70923 5.51484C8.04033 5.53676 8.20593 5.55869 8.42186 6.07641C8.68097 6.69466 9.3144 8.23938 9.38638 8.39288C9.45835 8.54638 9.5591 8.76566 9.44391 8.99226C9.33592 9.21153 9.22792 9.32847 9.06951 9.51121C8.9111 9.69395 8.75988 9.84013 8.60147 10.0375C8.4575 10.2056 8.2919 10.3883 8.47188 10.6953C8.65185 11.0022 9.30002 12.062 10.2575 12.9103C11.4944 14.0063 12.4947 14.3571 12.8258 14.5033C13.1569 14.6495 13.5168 14.6202 13.7328 14.3863C13.9919 14.1086 14.3086 13.6335 14.6321 13.1584C14.8625 12.8222 15.136 12.7783 15.4236 12.888C15.7112 12.9976 17.2371 13.7505 17.5395 13.904C17.8419 14.0575 18.0434 14.1306 18.1154 14.2548C18.1874 14.379 18.1874 15.0003 17.1856 16.2736Z" />
                    </svg>
                    {isArabic ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'}
                  </a>
                  
                  <button
                    onClick={onClose}
                    className="mt-4 text-[14px] text-[rgba(38,38,38,0.4)] font-medium hover:text-[#262626] transition-colors"
                  >
                    {isArabic ? 'إغلاق' : 'Close'}
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                <motion.h2
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[22px] font-black text-[#262626] leading-tight"
                  
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
                      backgroundColor: s <= step ? "#ef5da8" : "rgba(0,0,0,0.08)" }}
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
                      {isArabic ? "ما هو مستواه في اللغة العربية؟" : "What's their Arabic level?"}
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
                              className="w-5 h-5 rounded-full bg-[var(--color-highlight)] flex items-center justify-center"
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
                          ? "bg-[var(--color-highlight)] text-[#262626] "
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
                              selectedPackage === pkg.id ? "bg-[var(--color-highlight)] text-[#262626]" : "bg-[#ef5da8]/10 text-[#ef5da8]"
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
                          ? "bg-[var(--color-highlight)] text-[#262626] "
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
                      {isArabic ? "اختر اليوم" : "Select day"}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {daysList.map((day) => (
                        <motion.button
                          key={day.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setSelectedDay(day.id);
                            if (day.blocks.length === 1) {
                              setSelectedHourBlock(day.blocks[0].id);
                            } else {
                              setSelectedHourBlock(null);
                            }
                          }}
                          className={`w-full py-3 px-4 rounded-2xl text-[14px] font-bold transition-all duration-200 text-start ${
                            selectedDay === day.id
                              ? "bg-[#262626] text-white shadow-md"
                              : "bg-white text-[#262626] hover:bg-[#ef5da8]/10 border border-black/5"
                          }`}
                        >
                          {isArabic ? day.dayAr : day.dayEn}
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedDay && (
                        <motion.div
                          key="hours"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[15px] font-semibold text-[#262626] mb-1 border-t border-black/5 pt-4">
                            {isArabic ? "اختر الفترة الأنسب" : "Select preferred time period"}
                          </p>
                          <p className="text-[12px] text-[#262626]/60 mb-4 font-medium leading-relaxed">
                            {isArabic 
                              ? "سيتم تحديد موعد دقيق للحصة التجريبية خلال هذه الفترة." 
                              : "A specific time for the trial session will be scheduled within this period."}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            {groupedBlocks && Object.values(groupedBlocks).map((group, idx) => (
                              <div key={idx}>
                                <p className="text-[13px] text-[#262626]/50 mb-2 font-bold px-1">
                                  {isArabic ? group.labelAr : group.labelEn}
                                </p>
                                <div className="flex flex-col gap-2">
                                  {group.blocks.map((block) => {
                                    const localTime = getLocalTimeRange(block.startDubai, block.endDubai, activeCountry.timeOffset || 0, isArabic);
                                    return (
                                      <motion.button
                                        key={block.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedHourBlock(block.id)}
                                        className={`py-3 px-3 rounded-xl text-[13px] font-bold transition-all duration-200 text-center ${
                                          selectedHourBlock === block.id
                                            ? "bg-[#ef5da8] text-white shadow-md"
                                            : "bg-[var(--color-highlight)]/30 text-[#262626] hover:bg-[var(--color-highlight)]"
                                        }`}
                                      >
                                        {localTime}
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-center text-[#262626]/50 mt-3 font-medium">
                            {isArabic ? `الأوقات بتوقيت ${activeCountry.labelAr}` : `Times in ${activeCountry.labelEn} time`}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={canProceedStep3 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep3 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep3 && handleNext(4)}
                      disabled={!canProceedStep3}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep3
                          ? "bg-[var(--color-highlight)] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {variant === "learn-arabic" && step === 4 && (
                  <motion.div
                    key="la-step4"
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
                      <span className="px-3 py-1.5 rounded-full bg-[var(--color-highlight)]/30 text-[#262626] text-[12px] font-bold">
                        {currentLearnArabicPackages.find(p => p.id === selectedPackage)?.title}
                      </span>
                    </div>

                    <motion.button
                      whileHover={canSubmit && !isSubmitting ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
                      onClick={handleSubmit}
                      disabled={!canSubmit || isSubmitting}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canSubmit && !isSubmitting
                          ? "bg-[#ef5da8] text-white shadow-lg shadow-[#ef5da8]/30 hover:shadow-xl hover:shadow-[#ef5da8]/40"
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? (isArabic ? "جاري الحجز..." : "Booking...") : (isArabic ? "احجز الحصة المجانية" : "Book Free Class")}
                    </motion.button>

                    <p className="text-center text-[12px] text-[#262626]/40 mt-3 font-medium">
                      {isArabic ? "هنتواصل معاك خلال ساعات قليلة" : "We'll contact you within a few hours"}
                    </p>
                  </motion.div>
                )}

                {/* ===== DEFAULT VARIANT ===== */}
                {/* Default (Arabs): Step 1 = Grade */}
                {!isLearnArabic && step === 1 && (
                  <motion.div
                    key="step1"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "في أي صف دراسي يدرس الطالب؟" : "What grade is your child in?"}
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
                              : "bg-white text-[#262626] hover:bg-[var(--color-highlight)]/40"
                          }`}
                        >
                          {grade}
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
                          ? "bg-[var(--color-highlight)] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default (Arabs): Step 2 = Subject */}
                {!isLearnArabic && step === 2 && (
                  <motion.div
                    key="step2"
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
                              className="w-5 h-5 rounded-full bg-[var(--color-highlight)] flex items-center justify-center"
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
                      whileHover={canProceedStep2 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep2 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep2 && handleNext(3)}
                      disabled={!canProceedStep2}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep2
                          ? "bg-[var(--color-highlight)] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default (Arabs): Step 3 = Package */}
                {!isLearnArabic && step === 3 && (
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
                              selectedPackage === pkg.id ? "bg-[var(--color-highlight)] text-[#262626]" : "bg-[#ef5da8]/10 text-[#ef5da8]"
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
                      whileHover={canProceedStep3 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep3 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep3 && handleNext(4)}
                      disabled={!canProceedStep3}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep3
                          ? "bg-[var(--color-highlight)] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default (Arabs): Step 4 = Time */}
                {!isLearnArabic && !isSuccess && step === 4 && (
                  <motion.div
                    key="step4"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <p className="text-[15px] font-semibold text-[#262626] mb-4">
                      {isArabic ? "اختر اليوم" : "Select day"}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {daysList.map((day) => (
                        <motion.button
                          key={day.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setSelectedDay(day.id);
                            if (day.blocks.length === 1) {
                              setSelectedHourBlock(day.blocks[0].id);
                            } else {
                              setSelectedHourBlock(null);
                            }
                          }}
                          className={`w-full py-3 px-3 rounded-2xl text-[14px] font-bold transition-all duration-200 text-center ${
                            selectedDay === day.id
                              ? "bg-[#262626] text-white shadow-md"
                              : "bg-white text-[#262626] hover:bg-[#ef5da8]/10 border border-black/5"
                          }`}
                        >
                          {isArabic ? day.dayAr : day.dayEn}
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedDay && (
                        <motion.div
                          key="hours"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[15px] font-semibold text-[#262626] mb-1 border-t border-black/5 pt-4">
                            {isArabic ? "اختر الفترة الأنسب" : "Select preferred time period"}
                          </p>
                          <p className="text-[12px] text-[#262626]/60 mb-4 font-medium leading-relaxed">
                            {isArabic 
                              ? "سيتم تحديد موعد دقيق للحصة التجريبية خلال هذه الفترة." 
                              : "A specific time for the trial session will be scheduled within this period."}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            {groupedBlocks && Object.values(groupedBlocks).map((group, idx) => (
                              <div key={idx}>
                                <p className="text-[13px] text-[#262626]/50 mb-2 font-bold px-1">
                                  {isArabic ? group.labelAr : group.labelEn}
                                </p>
                                <div className="flex flex-col gap-2">
                                  {group.blocks.map((block) => {
                                    const localTime = getLocalTimeRange(block.startDubai, block.endDubai, activeCountry.timeOffset || 0, isArabic);
                                    return (
                                      <motion.button
                                        key={block.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedHourBlock(block.id)}
                                        className={`py-3 px-3 rounded-xl text-[13px] font-bold transition-all duration-200 text-center ${
                                          selectedHourBlock === block.id
                                            ? "bg-[#ef5da8] text-white shadow-md"
                                            : "bg-[var(--color-highlight)]/30 text-[#262626] hover:bg-[var(--color-highlight)]"
                                        }`}
                                      >
                                        {localTime}
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <p className="text-[11px] text-center text-[#262626]/50 mt-3 font-medium">
                            {isArabic ? `الأوقات بتوقيت ${activeCountry.labelAr}` : `Times in ${activeCountry.labelEn} time`}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={canProceedStep4 ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canProceedStep4 ? { scale: 0.98 } : {}}
                      onClick={() => canProceedStep4 && handleNext(5)}
                      disabled={!canProceedStep4}
                      className={`w-full mt-7 py-4 rounded-full font-bold text-[16px] transition-all duration-300 ${
                        canProceedStep4
                          ? "bg-[var(--color-highlight)] text-[#262626] "
                          : "bg-black/5 text-[#262626]/25 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next step"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Default (Arabs): Step 5 = Contact */}
                {!isLearnArabic && step === 5 && (
                  <motion.div
                    key="step5"
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
                      <span className="px-3 py-1.5 rounded-full bg-[var(--color-highlight)]/30 text-[#262626] text-[12px] font-bold">
                        {isArabic ? `الصف ${selectedGrade}` : `Grade ${selectedGrade}`}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[#ef5da8]/10 text-[#262626] text-[12px] font-bold">
                        {currentSubjects.find(s => s.id === selectedSubject)?.label}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[var(--color-highlight)]/30 text-[#262626] text-[12px] font-bold">
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
              </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
