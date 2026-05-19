"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type GeideanStatus = "success" | "failed" | "cancelled";

const STATUS_CONFIG: Record<GeideanStatus, {
  icon: React.ReactNode;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
}> = {
  success: {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Payment Successful",
    titleAr: "تمت عملية الدفع بنجاح",
    description: "Your payment has been processed successfully. Your wallet will be credited instantly.",
    descriptionAr: "تمت معالجة الدفع بنجاح. سيتم إضافة الرصيد إلى محفظتك فوراً.",
    gradient: "from-emerald-400 to-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accentColor: "#10B981",
  },
  failed: {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    title: "Payment Failed",
    titleAr: "فشلت عملية الدفع",
    description: "Your payment could not be processed. Please try again or use a different payment method.",
    descriptionAr: "لم يتم إتمام عملية الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع مختلفة.",
    gradient: "from-red-400 to-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accentColor: "#EF4444",
  },
  cancelled: {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Payment Cancelled",
    titleAr: "تم إلغاء عملية الدفع",
    description: "You cancelled the payment. No amount has been charged from your account.",
    descriptionAr: "تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك.",
    gradient: "from-amber-400 to-amber-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    accentColor: "#F59E0B",
  },
};

function ReturnInner() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status")?.toLowerCase() || "";
  const trx = searchParams.get("merchantReferenceId") || "";

  const status: GeideanStatus =
    rawStatus === "success" ? "success" :
    rawStatus === "cancelled" ? "cancelled" :
    "failed";

  const config = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden font-[family-name:var(--font-tajawal)]">
      {/* Subtle background glow matching status */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none" 
        style={{ background: `radial-gradient(circle, ${config.accentColor} 0%, transparent 70%)` }} 
      />

      <div className="relative w-full max-w-[420px] bg-white rounded-[28px] border border-[#f0f0f0] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top accent line */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`} />

        <div className="px-8 pt-10 pb-8 text-center">
          {/* Status Icon */}
          <div className={`w-20 h-20 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/50`}>
            {config.icon}
          </div>

          {/* Titles */}
          <h1 className="text-[26px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">
            {config.titleAr}
          </h1>
          <p className="text-[15px] font-semibold mb-6 tracking-wide uppercase font-[family-name:var(--font-playfair)] italic" style={{ color: config.accentColor }}>
            {config.title}
          </p>

          {/* Descriptions */}
          <p className="text-[15px] leading-relaxed text-[#666] mb-8" dir="rtl">
            {config.descriptionAr}
          </p>

          {/* Transaction ref */}
          {trx && (
            <div className="bg-[#f9f9f9] rounded-2xl p-4 mb-8 border border-[#eaeaea] flex items-center justify-between" dir="ltr">
              <span className="text-[12px] text-[#888] font-bold uppercase tracking-wider font-[family-name:var(--font-playfair)]">
                TRX Ref
              </span>
              <span className="text-[14px] text-[#1a1a1a] font-bold font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-[#f0f0f0]">
                {trx}
              </span>
            </div>
          )}

          {/* Info note */}
          <div className="bg-[#C9A84C]/5 rounded-2xl p-5 border border-[#C9A84C]/20" dir="rtl">
            <p className="text-[14px] leading-relaxed text-[#C9A84C] m-0 font-bold">
              يمكنك إغلاق هذه الصفحة والعودة إلى التطبيق. سيتم تحديث حالة الدفع تلقائياً.
            </p>
            <p className="text-[12px] leading-relaxed text-[#C9A84C]/70 mt-3 font-[family-name:var(--font-playfair)] italic" dir="ltr">
              You can close this page and return to the app. Payment status will update automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#f5f5f5] bg-[#fafafa] p-4 text-center">
          <p className="text-[11px] text-[#aaa] m-0 font-bold tracking-[0.15em] font-[family-name:var(--font-playfair)]">
            GOLDEN CIRCLE GOLD × GEIDEA
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GeideaReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#eee] border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    }>
      <ReturnInner />
    </Suspense>
  );
}
