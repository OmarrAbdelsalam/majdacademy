"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useLandingContent } from "./useLandingContent";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    { id: "comprehensive", title: "الباقة الشاملة", price: "600", period: "درهم/شهرياً", desc: "المادتين معاً · 8 حصص" },
    { id: "basic", title: "الباقة الأساسية", price: "400", period: "درهم/شهرياً", desc: "مادة واحدة · 4 حصص" },
  ],
  en: [
    { id: "comprehensive", title: "Comprehensive", price: "600", period: "AED/month", desc: "Both subjects · 8 sessions" },
    { id: "basic", title: "Basic", price: "400", period: "AED/month", desc: "One subject · 4 sessions" },
  ],
};

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const content = useLandingContent();
  const isArabic = content.hero.cta === "احجز حصة مجانية";

  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedGrade(null);
        setSelectedSubject(null);
        setSelectedPackage(null);
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

  const canProceedStep1 = selectedGrade !== null;
  const canProceedStep2 = selectedSubject !== null;
  const canProceedStep3 = selectedPackage !== null;
  const canSubmit = name.trim().length > 0 && phone.trim().length >= 9;

  const handleSubmit = () => {
    const gradeText = isArabic ? `الصف ${selectedGrade}` : `Grade ${selectedGrade}`;
    const subjectText = currentSubjects.find(s => s.id === selectedSubject)?.label || "";
    const packageText = currentPackages.find(p => p.id === selectedPackage)?.title || "";
    const message = isArabic
      ? `السلام عليكم، أبي أحجز حصة مجانية لولدي.\n\nالاسم: ${name}\nالتواصل: ${phone}\n${gradeText}\nالمادة: ${subjectText}\nالباقة المتوقعة: ${packageText}`
      : `Hello, I'd like to book a free class for my child.\n\nName: ${name}\nContact: ${phone}\n${gradeText}\nSubject: ${subjectText}\nExpected Package: ${packageText}`;

    const whatsappUrl = `https://wa.me/201098505924?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  const totalSteps = 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-[440px] rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Background — banner image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://cdn.kodland.org/main-site-v2/banner.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-7">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                {/* Steps */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full transition-all ${
                        s === step ? "w-6 bg-[#ef5da8]" : s < step ? "w-6 bg-[#ef5da8]/40" : "w-6 bg-[#262626]/15"
                      }`}
                    />
                  ))}
                </div>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#262626]/10 hover:bg-[#262626]/20 transition-colors"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step 1: Grade */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className="text-[24px] font-black text-[#262626] mb-1"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {isArabic ? "ولدك في أي صف؟" : "What grade?"}
                  </h2>
                  <p className="text-[13px] text-[#262626]/60 font-medium mb-6">
                    {isArabic ? "اختر الصف الدراسي" : "Select the grade level"}
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`py-2.5 rounded-xl text-[15px] font-bold transition-all ${
                          selectedGrade === grade
                            ? "bg-[#262626] text-white shadow-md"
                            : "bg-white/80 text-[#262626] hover:bg-white"
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => canProceedStep1 && setStep(2)}
                    disabled={!canProceedStep1}
                    className={`w-full mt-6 py-3.5 rounded-[60px] font-bold text-[15px] transition-all ${
                      canProceedStep1
                        ? "bg-[#262626] text-white hover:-translate-y-0.5 shadow-lg"
                        : "bg-[#262626]/20 text-[#262626]/40 cursor-not-allowed"
                    }`}
                  >
                    {isArabic ? "التالي" : "Next"}
                  </button>
                </motion.div>
              )}

              {/* Step 2: Subject */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className="text-[24px] font-black text-[#262626] mb-1"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {isArabic ? "يبي يدرس إيش؟" : "What subject?"}
                  </h2>
                  <p className="text-[13px] text-[#262626]/60 font-medium mb-6">
                    {isArabic ? "اختر المادة" : "Choose the subject"}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {currentSubjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => setSelectedSubject(subject.id)}
                        className={`w-full py-3.5 px-4 rounded-2xl text-start font-semibold text-[15px] transition-all flex items-center gap-3 ${
                          selectedSubject === subject.id
                            ? "bg-[#262626] text-white"
                            : "bg-white/80 text-[#262626] hover:bg-white"
                        }`}
                      >
                        <span className="flex-1">{subject.label}</span>
                        {selectedSubject === subject.id && (
                          <Check className="w-4 h-4" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2.5 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 rounded-[60px] font-bold text-[14px] bg-white/80 text-[#262626] hover:bg-white transition-all"
                    >
                      {isArabic ? "رجوع" : "Back"}
                    </button>
                    <button
                      onClick={() => canProceedStep2 && setStep(3)}
                      disabled={!canProceedStep2}
                      className={`flex-[2] py-3.5 rounded-[60px] font-bold text-[15px] transition-all ${
                        canProceedStep2
                          ? "bg-[#262626] text-white hover:-translate-y-0.5 shadow-lg"
                          : "bg-[#262626]/20 text-[#262626]/40 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Package */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className="text-[24px] font-black text-[#262626] mb-1"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {isArabic ? "أي باقة تناسبك؟" : "Which package?"}
                  </h2>
                  <p className="text-[13px] text-[#262626]/60 font-medium mb-6">
                    {isArabic ? "تقدر تغيّر بعدين، بس يساعدنا نجهز لك" : "You can change later, this helps us prepare"}
                  </p>

                  <div className="flex flex-col gap-3">
                    {currentPackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`w-full p-4 rounded-2xl text-start transition-all ${
                          selectedPackage === pkg.id
                            ? "bg-[#262626] text-white shadow-md"
                            : "bg-white/80 text-[#262626] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[15px]">{pkg.title}</span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-black text-[20px]">{pkg.price}</span>
                            <span className={`text-[11px] font-medium ${selectedPackage === pkg.id ? "text-white/70" : "text-[#262626]/50"}`}>
                              {pkg.period}
                            </span>
                          </div>
                        </div>
                        <p className={`text-[12px] mt-1 font-medium ${selectedPackage === pkg.id ? "text-white/70" : "text-[#262626]/50"}`}>
                          {pkg.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2.5 mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3.5 rounded-[60px] font-bold text-[14px] bg-white/80 text-[#262626] hover:bg-white transition-all"
                    >
                      {isArabic ? "رجوع" : "Back"}
                    </button>
                    <button
                      onClick={() => canProceedStep3 && setStep(4)}
                      disabled={!canProceedStep3}
                      className={`flex-[2] py-3.5 rounded-[60px] font-bold text-[15px] transition-all ${
                        canProceedStep3
                          ? "bg-[#262626] text-white hover:-translate-y-0.5 shadow-lg"
                          : "bg-[#262626]/20 text-[#262626]/40 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "التالي" : "Next"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Contact */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    className="text-[24px] font-black text-[#262626] mb-1"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    {isArabic ? "بيانات التواصل" : "Contact Info"}
                  </h2>
                  <p className="text-[13px] text-[#262626]/60 font-medium mb-6">
                    {isArabic ? "عشان ننسق الحصة المجانية" : "So we can schedule the free class"}
                  </p>

                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isArabic ? "اسم ولي الأمر" : "Parent's name"}
                      className="w-full px-4 py-3 rounded-xl bg-white/90 border-0 text-[#262626] text-[14px] font-medium placeholder:text-[#262626]/40 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/30"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isArabic ? "رقم الواتساب" : "WhatsApp number"}
                      className="w-full px-4 py-3 rounded-xl bg-white/90 border-0 text-[#262626] text-[14px] font-medium placeholder:text-[#262626]/40 focus:outline-none focus:ring-2 focus:ring-[#ef5da8]/30"
                      dir="ltr"
                    />
                  </div>

                  {/* Summary chips */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-[#262626]/10 text-[#262626] text-[12px] font-bold">
                      {isArabic ? `الصف ${selectedGrade}` : `Grade ${selectedGrade}`}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#262626]/10 text-[#262626] text-[12px] font-bold">
                      {currentSubjects.find(s => s.id === selectedSubject)?.label}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#262626]/10 text-[#262626] text-[12px] font-bold">
                      {currentPackages.find(p => p.id === selectedPackage)?.title}
                    </span>
                  </div>

                  <div className="flex gap-2.5 mt-6">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-3.5 rounded-[60px] font-bold text-[14px] bg-white/80 text-[#262626] hover:bg-white transition-all"
                    >
                      {isArabic ? "رجوع" : "Back"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className={`flex-[2] py-3.5 rounded-[60px] font-bold text-[15px] transition-all ${
                        canSubmit
                          ? "bg-[#ef5da8] text-white hover:-translate-y-0.5 shadow-lg shadow-[#ef5da8]/25"
                          : "bg-[#262626]/20 text-[#262626]/40 cursor-not-allowed"
                      }`}
                    >
                      {isArabic ? "احجز الحصة" : "Book Class"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
