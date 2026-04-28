"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import Navbar from "../../../components/Navbar";
import { requestPasswordReset } from "../../../../lib/api";

export default function ForgotPasswordPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tr = {
    title: isRTL ? "استعادة كلمة المرور" : "Reset Password",
    subtitle: isRTL ? "الخطوة 1 من 3" : "Step 1 of 3",
    desc: isRTL ? "أدخل بريدك الإلكتروني أو رقم هاتفك لاستعادة كلمة المرور" : "Enter your email or phone to reset your password",
    label: isRTL ? "البريد الإلكتروني أو رقم الهاتف" : "Email or Phone number",
    submit: isRTL ? "إرسال رمز التحقق" : "Send verification code",
    back: isRTL ? "العودة لتسجيل الدخول" : "Back to login",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await requestPasswordReset({ user }, locale);
      if ("success" in res && res.success === false) {
        setError(res.message || "Error");
        return;
      }
      const envelope = res as { code?: number; message?: string; data?: any };
      if (envelope.code === 422) {
        setError(envelope.message || "Invalid data");
        return;
      }
      sessionStorage.setItem("fp_user_id", String(envelope.data?.id ?? ""));
      sessionStorage.setItem("fp_email", user);
      router.push(`/${locale}/forgot-password/verify`);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center pt-24 pb-12 px-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-full max-w-[440px]">
          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            <div className="flex-1 h-1 rounded-full bg-[#C9A84C]" />
            <div className="flex-1 h-1 rounded-full bg-[#eee]" />
            <div className="flex-1 h-1 rounded-full bg-[#eee]" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/10 to-[#E8C96A]/10 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>

          <p className="text-[12px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2">{tr.subtitle}</p>
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1a1a1a] tracking-tight leading-none mb-3">{tr.title}</h1>
          <p className="text-[14px] text-[#999] mb-8 leading-relaxed">{tr.desc}</p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.label}</label>
              <div className={inputCls}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder={isRTL ? "example@email.com أو 01xxxxxxxxx" : "example@email.com or 01xxxxxxxxx"} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" dir="ltr" required />
              </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
              {loading ? (isRTL ? "جارٍ الإرسال..." : "Sending...") : tr.submit}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href={`/${lang}/login`} className="text-[14px] text-[#999] hover:text-[#C9A84C] transition-colors font-medium inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? "rotate-180" : ""}><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              {tr.back}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
