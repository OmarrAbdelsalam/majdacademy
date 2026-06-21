"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../../i18n/LangContext";
import AcademyNavbar from "../../../../components/layout/AcademyNavbar";
import { verifyPasswordCode } from "../../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

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
    loading: isRTL ? "جارٍ التحقق..." : "Verifying...",
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
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

  const inputCls =
    "w-full bg-[#f8f9fa] rounded-[32px] px-6 py-4 border border-transparent focus:border-[#ef5da8]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,93,168,0.08)] transition-all duration-200 text-[15px] font-medium text-[#262626] outline-none placeholder:text-[rgba(38,38,38,0.4)]";

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const } },
  };

  return (
    <>
      <AcademyNavbar />
      <div
        className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 pt-28 pb-12"
        dir={isRTL ? "rtl" : "ltr"}
        
      >
        <motion.div
          className="w-full max-w-[440px]"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            <div className="flex-1 h-1.5 rounded-full bg-[#ef5da8]" />
            <div className="flex-1 h-1.5 rounded-full bg-[#ef5da8]" />
            <div className="flex-1 h-1.5 rounded-full bg-[rgba(38,38,38,0.05)]" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-[32px] bg-[#fef0f8] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef5da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          {/* Header */}
          <p className="text-[13px] font-bold text-[#ef5da8] mb-2">{tr.subtitle}</p>
          <h1
            className="text-[#262626] font-extrabold leading-[120%] mb-3"
            style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
          >
            {tr.title}
          </h1>
          <p className="text-[15px] font-medium text-[rgba(38,38,38,0.6)] leading-[26px] mb-8">
            {tr.desc}
          </p>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={inputCls}
                dir="ltr"
                required
              />
            </div>

            {/* OTP Code */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.codeLabel}
              </label>
              <div className="flex gap-3 justify-center" dir="ltr">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-[20px] font-bold text-[#262626] bg-[#f8f9fa] rounded-2xl border border-transparent focus:border-[#ef5da8]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(239,93,168,0.08)] outline-none transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="px-5 py-3.5 rounded-[32px] bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
            >
              {loading ? tr.loading : tr.submit}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <button className="text-[13px] font-bold text-[#ef5da8] hover:text-[#262626] transition-colors">
              {tr.resend}
            </button>
          </div>

          {/* Back link */}
          <div className="mt-4 text-center">
            <Link
              href={`/${lang}/forgot-password`}
              className="text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? "rotate-180" : ""}>
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {tr.back}
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
