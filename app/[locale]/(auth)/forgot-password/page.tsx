"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import AcademyNavbar from "../../../components/layout/AcademyNavbar";
import { requestPasswordReset } from "../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

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
    label: isRTL ? "البريد الإلكتروني أو رقم الهاتف" : "Email or phone number",
    submit: isRTL ? "إرسال رمز التحقق" : "Send verification code",
    loading: isRTL ? "جارٍ الإرسال..." : "Sending...",
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
        style={{ fontFamily: "'Baloo Bhaijaan 2', 'Cairo', sans-serif" }}
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
            <div className="flex-1 h-1.5 rounded-full bg-[rgba(38,38,38,0.05)]" />
            <div className="flex-1 h-1.5 rounded-full bg-[rgba(38,38,38,0.05)]" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-[32px] bg-[#fef0f8] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef5da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
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
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.label}
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder={isRTL ? "example@email.com أو 01xxxxxxxxx" : "example@email.com or 01xxxxxxxxx"}
                className={inputCls}
                dir="ltr"
                required
              />
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

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href={`/${lang}/login`}
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
