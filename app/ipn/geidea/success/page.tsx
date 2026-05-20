"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden font-[family-name:var(--font-tajawal)]">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-[420px] bg-white rounded-[28px] border border-[#f0f0f0] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-300">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

        <div className="px-8 pt-10 pb-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/50">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          {/* Titles */}
          <h1 className="text-[26px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">
            تمت عملية الدفع بنجاح
          </h1>
          <p className="text-[15px] font-semibold mb-6 tracking-wide uppercase font-[family-name:var(--font-playfair)] italic text-emerald-500">
            Payment Successful
          </p>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-[#666] mb-8" dir="rtl">
            تمت معالجة الدفع بنجاح. سيتم إضافة الرصيد إلى محفظتك فوراً.
          </p>

          {/* Transaction ref */}
          {ref && (
            <div className="bg-[#f9f9f9] rounded-2xl p-4 mb-8 border border-[#eaeaea] flex items-center justify-between" dir="ltr">
              <span className="text-[12px] text-[#888] font-bold uppercase tracking-wider font-[family-name:var(--font-playfair)]">
                TRX Ref
              </span>
              <span className="text-[14px] text-[#1a1a1a] font-bold font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-[#f0f0f0]">
                {ref}
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

export default function GeideaSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#eee] border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
