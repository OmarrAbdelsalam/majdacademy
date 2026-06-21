"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../../i18n/LangContext";
import AcademyNavbar from "../../../../components/layout/AcademyNavbar";
import { changePassword } from "../../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ChangePasswordPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [fpCode, setFpCode] = useState("");

  useEffect(() => {
    setUserId(sessionStorage.getItem("fp_user_id") ?? "");
    setFpCode(sessionStorage.getItem("fp_code") ?? "");
  }, []);

  const tr = {
    title: isRTL ? "كلمة مرور جديدة" : "New Password",
    subtitle: isRTL ? "الخطوة 3 من 3" : "Step 3 of 3",
    desc: isRTL ? "اختر كلمة مرور قوية لحسابك" : "Choose a strong password for your account",
    password: isRTL ? "كلمة المرور الجديدة" : "New password",
    confirm: isRTL ? "تأكيد كلمة المرور" : "Confirm password",
    submit: isRTL ? "تغيير كلمة المرور" : "Change password",
    loading: isRTL ? "جارٍ التغيير..." : "Changing...",
    back: isRTL ? "العودة" : "Go back",
    hint: isRTL ? "6 أحرف على الأقل" : "At least 6 characters",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError(isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await changePassword({ id: userId, code: fpCode, password }, locale);
      if ("success" in res && res.success === false) {
        setError(res.message || "Error");
        return;
      }
      const envelope = res as { code?: number; message?: string; data?: any };
      if (envelope.code === 422) {
        setError(envelope.message || "Invalid data");
        return;
      }
      sessionStorage.removeItem("fp_user_id");
      sessionStorage.removeItem("fp_email");
      sessionStorage.removeItem("fp_code");
      setSuccess(envelope.message || (isRTL ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully"));
      setTimeout(() => router.push(`/${locale}/login`), 1500);
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
            <div className="flex-1 h-1.5 rounded-full bg-[#ef5da8]" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-[32px] bg-[#eefbf3] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.password}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls + " pr-14"}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 right-5 text-[rgba(38,38,38,0.4)] hover:text-[#262626] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPass ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <p className="text-[11px] text-[rgba(38,38,38,0.4)] px-2 mt-1">{tr.hint}</p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.confirm}
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
                required
                minLength={6}
              />
            </div>

            {/* Error / Success */}
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
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="px-5 py-3.5 rounded-[32px] bg-[#eefbf3] border border-green-100 text-green-700 text-[13px] font-bold"
                >
                  {success}
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
              href={`/${lang}/forgot-password/verify`}
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
