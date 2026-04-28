"use client";
import { useLang } from "../i18n/LangContext";

interface MaintenanceScreenProps {
  visible: boolean;
}

export default function MaintenanceScreen({ visible }: MaintenanceScreenProps) {
  const { isRTL } = useLang();

  if (!visible) return null;

  const tr = {
    title: isRTL ? "صيانة مؤقتة" : "Under Maintenance",
    desc: isRTL
      ? "نعمل على تحسين خدماتنا. يرجى المحاولة مرة أخرى بعد قليل."
      : "We're improving our services. Please try again shortly.",
    retry: isRTL ? "إعادة المحاولة" : "Try Again",
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center px-8 max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#C9A84C]/10 to-[#E8C96A]/10 flex items-center justify-center mx-auto mb-8">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight mb-4">
          {tr.title}
        </h1>
        <p className="text-[15px] text-[#999] leading-relaxed mb-10">
          {tr.desc}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
            color: 'white',
          }}
        >
          {tr.retry}
        </button>

        {/* Decorative */}
        <p className="mt-12 text-[11px] text-[#ddd] font-bold tracking-[0.2em] uppercase">Golden Circle Trading</p>
      </div>
    </div>
  );
}
