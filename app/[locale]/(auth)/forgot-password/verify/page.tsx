"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../../i18n/LangContext";
import Navbar from "../../../../components/Navbar";
import { verifyPasswordCode } from "../../../../../lib/api";

export default function VerifyCodePage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("fp_email");
    if (stored) setEmail(stored);
  }, []);

  const tr = {
    title: isRTL ? "تحقق من الرمز" : "Verify Code",
    subtitle: isRTL ? "الخطوة 2 من 3" : "Step 2 of 3",
    desc: isRTL ? "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني أو هاتفك" : "Enter the verification code sent to your email or phone",
    emailLabel: isRTL ? "البريد الإلكتروني" : "Email",
    codeLabel: isRTL ? "رمز التحقق" : "Verification code",
    submit: isRTL ? "تحقق" : "Verify",
    resend: isRTL ? "إعادة إرسال الرمز" : "Resend code",
    back: isRTL ? "العودة" : "Go back",
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyPasswordCode({ code: code.join(""), email, id: sessionStorage.getItem("fp_user_id") }, locale);
      if ("success" in res && res.success === false) {
        setError(res.message || "Error");
        return;
      }
      const envelope = res as { code?: number; message?: string; data?: any };
      if (envelope.code === 422) {
        setError(envelope.message || "Invalid data");
        return;
      }
      sessionStorage.setItem("fp_code", code.join(""));
      router.push(`/${locale}/forgot-password/change`);
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
          <div className="flex gap-2 mb-8">
            <div className="flex-1 h-1 rounded-full bg-[#C9A84C]" />
            <div className="flex-1 h-1 rounded-full bg-[#C9A84C]" />
            <div className="flex-1 h-1 rounded-full bg-[#eee]" />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/10 to-[#E8C96A]/10 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>

          <p className="text-[12px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2">{tr.subtitle}</p>
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1a1a1a] tracking-tight leading-none mb-3">{tr.title}</h1>
          <p className="text-[14px] text-[#999] mb-8 leading-relaxed">{tr.desc}</p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.emailLabel}</label>
              <div className={inputCls}><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" dir="ltr" required /></div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.codeLabel}</label>
              <div className="flex gap-3 justify-center" dir="ltr">
                {code.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleCodeChange(i, e.target.value)} className="w-12 h-14 text-center text-[20px] font-bold text-[#1a1a1a] bg-[#F7F7F8] rounded-xl border border-transparent focus:border-[#E9C237]/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] outline-none transition-all duration-200" />
                ))}
              </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99]" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
              {loading ? (isRTL ? "جارٍ التحقق..." : "Verifying...") : tr.submit}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-[13px] text-[#C9A84C] font-semibold hover:text-[#B89A3A] transition-colors">{tr.resend}</button>
          </div>
          <div className="mt-4 text-center">
            <Link href={`/${lang}/forgot-password`} className="text-[14px] text-[#999] hover:text-[#C9A84C] transition-colors font-medium inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? "rotate-180" : ""}><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              {tr.back}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
