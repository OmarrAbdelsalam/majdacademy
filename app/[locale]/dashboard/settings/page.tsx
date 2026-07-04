"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#ef5da8] font-bold">جاري التحميل...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const successParam = searchParams.get("success");
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  const showToast = (title: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const defaultHours = {
    0: { start: "09:00", end: "17:00", active: false },
    1: { start: "09:00", end: "17:00", active: true },
    2: { start: "09:00", end: "17:00", active: true },
    3: { start: "09:00", end: "17:00", active: true },
    4: { start: "09:00", end: "17:00", active: true },
    5: { start: "09:00", end: "17:00", active: false },
    6: { start: "09:00", end: "17:00", active: false },
  };

  const [workingHours, setWorkingHours] = useState<any>(defaultHours);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.working_hours && Object.keys(data.settings.working_hours).length > 0) {
            const merged = { ...defaultHours };
            for (const key in data.settings.working_hours) {
              merged[key as unknown as keyof typeof defaultHours] = {
                ...defaultHours[key as unknown as keyof typeof defaultHours],
                ...data.settings.working_hours[key],
                active: true,
              };
            }
            setWorkingHours(merged);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const hoursToSave: any = {};
    for (const [day, config] of Object.entries(workingHours) as any) {
      if (config.active) {
        hoursToSave[day] = { start: config.start, end: config.end };
      }
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workingHours: hoursToSave, timezone: 'Asia/Dubai' }),
      });
      showToast('تم حفظ الإعدادات بنجاح');
    } catch (e) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const daysAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  if (isLoading) return <SettingsSkeleton />;

  const isConnected = !!settings?.google_access_token;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-[#262626] font-extrabold text-2xl md:text-3xl leading-[120%] mb-2">
          إعدادات الحجوزات
        </h1>
        <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] leading-[24px]">
          قم بربط تقويم جوجل الخاص بك وحدد أوقات عملك المتاحة للحجوزات.
        </p>
      </div>

      {successParam === "google_connected" && (
        <div className="bg-[#fef0f8] text-[#ef5da8] p-5 rounded-[32px] flex items-center gap-3 shadow-sm border border-[#ef5da8]/20">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-bold text-[15px]">تم ربط حساب جوجل بنجاح!</span>
        </div>
      )}

      {errorParam && (
        <div className="bg-red-50 text-red-600 p-5 rounded-[32px] flex items-center gap-3 shadow-sm border border-red-100">
          <AlertCircle className="w-6 h-6" />
          <span className="font-bold text-[15px]">حدث خطأ أثناء محاولة ربط الحساب. يرجى المحاولة مرة أخرى.</span>
        </div>
      )}

      {/* Google Calendar Connection */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[20px] bg-[#fef0f8] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#ef5da8]" />
          </div>
          <h2 className="text-lg font-extrabold text-[#262626]">
            ربط تقويم جوجل (Google Calendar)
          </h2>
        </div>
        
        {isConnected ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[#f8f9fa] p-5 rounded-[24px] gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 bg-[#fef0f8] rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#ef5da8]" />
              </div>
              <div>
                <p className="font-extrabold text-[#262626] text-[16px] mb-0.5">متصل بنجاح</p>
                <p className="text-[13px] text-[rgba(38,38,38,0.6)] font-medium">الحجوزات ستظهر مباشرة في التقويم الخاص بك.</p>
              </div>
            </div>
            <a href="/api/oauth/google" className="w-full md:w-auto text-center text-[13px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-[60px] hover:bg-[#262626] hover:text-white transition-all duration-200">
              تحديث الربط
            </a>
          </div>
        ) : (
          <div className="bg-[#f8f9fa] p-6 rounded-[24px] text-center space-y-4">
            <p className="text-[14px] text-[rgba(38,38,38,0.6)] font-medium leading-[24px] max-w-xl mx-auto">
              يجب ربط حساب جوجل الخاص بك ليتمكن الطلاب من الحجز، ولضمان عدم التعارض مع مواعيدك الأخرى.
            </p>
            <a 
              href="/api/oauth/google" 
              className="inline-flex items-center justify-center rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-200"
              style={{ padding: "10px 20px", fontSize: "14px", fontWeight: 500 }}
            >
              الربط مع تقويم جوجل
            </a>
          </div>
        )}
      </section>

      {/* Working Hours */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[20px] bg-[#fef0f8] flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#ef5da8]" />
          </div>
          <h2 className="text-lg font-extrabold text-[#262626]">
            أوقات العمل المتاحة
          </h2>
        </div>
        <p className="text-[14px] text-[rgba(38,38,38,0.6)] font-medium mb-6">
          حدد الأيام والساعات التي يمكن للطلاب حجز حصص تجريبية فيها. (مدة الحصة ساعة واحدة)
        </p>

        <div className="space-y-4">
          {Object.entries(workingHours).map(([dayIdx, config]: any) => (
            <div 
              key={dayIdx} 
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[24px] transition-all duration-300 border ${
                config.active 
                  ? 'bg-white border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
                  : 'bg-[#f8f9fa] border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-32">
                <button 
                  type="button"
                  onClick={() => setWorkingHours({...workingHours, [dayIdx]: { ...config, active: !config.active }})}
                  className={`relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-[32px] border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.active ? 'bg-[#ef5da8]' : 'bg-[rgba(38,38,38,0.2)]'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.active ? '-translate-x-[20px]' : 'translate-x-0'}`} />
                </button>
                <span className={`font-extrabold text-[15px] ${config.active ? 'text-[#262626]' : 'text-[rgba(38,38,38,0.6)]'}`}>
                  {daysAr[dayIdx]}
                </span>
              </div>

              <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-opacity duration-300 ${!config.active ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                  <span className="text-[13px] font-bold text-[rgba(38,38,38,0.4)] w-8">من</span>
                  <CustomTimePicker 
                    value={config.start}
                    onChange={(val) => setWorkingHours({...workingHours, [dayIdx]: { ...config, start: val }})}
                  />
                </div>
                
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                  <span className="text-[13px] font-bold text-[rgba(38,38,38,0.4)] w-8">إلى</span>
                  <CustomTimePicker 
                    value={config.end}
                    onChange={(val) => setWorkingHours({...workingHours, [dayIdx]: { ...config, end: val }})}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setWorkingHours({...workingHours, [dayIdx]: { ...config, start: "00:00", end: "24:00" }});
                    showToast(`تم تفعيل 24 ساعة ليوم ${daysAr[dayIdx]}`);
                  }}
                  className="text-[12px] font-bold bg-[#ef5da8]/10 text-[#ef5da8] px-3 py-2 rounded-full hover:bg-[#ef5da8]/20 transition-colors whitespace-nowrap self-end sm:self-auto w-full sm:w-auto text-center"
                >
                  متاح 24 ساعة
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ padding: "12px 32px", fontSize: "15px", fontWeight: 500 }}
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-[60px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border ${
              toastMessage.type === 'success' 
                ? 'bg-white border-green-100' 
                : 'bg-white border-red-100'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-[#ef5da8]" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <span className="font-bold text-[16px] text-[#262626] whitespace-nowrap">
              {toastMessage.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-gray-100 rounded-lg w-full max-w-md animate-pulse"></div>
      </div>
      
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[20px] bg-gray-200 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>
        <div className="bg-[#f8f9fa] p-6 rounded-[24px] h-32 animate-pulse border border-gray-100"></div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[20px] bg-gray-200 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>
        <div className="h-5 bg-gray-100 rounded-lg w-full max-w-md mb-6 animate-pulse"></div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-white h-[76px] rounded-[24px] animate-pulse border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CustomTimePicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayTime = (time24: string) => {
    if (!time24) return "09:00 AM";
    if (time24 === "24:00") return "12:00 AM";
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const h = i.toString().padStart(2, '0');
        const m = j.toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    options.push("24:00");
    return options;
  };

  const options = generateTimeOptions();

  return (
    <div className="relative flex-1 sm:flex-none w-full sm:w-32" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#f8f9fa] rounded-[24px] px-3 py-2.5 border border-transparent focus:border-[#ef5da8]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,93,168,0.08)] transition-all duration-200 text-[14px] font-medium text-[#262626] outline-none w-full text-center flex items-center justify-center hover:bg-gray-50"
        dir="ltr"
      >
        <span>{formatDisplayTime(value)}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto w-full sm:w-40 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[240px] overflow-y-auto z-50 py-2 custom-scrollbar"
          >
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-center px-4 py-2.5 text-sm font-bold transition-colors ${
                  value === opt 
                    ? "bg-[#fdf2f8] text-[#ef5da8]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#ef5da8]"
                }`}
              >
                {formatDisplayTime(opt)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
