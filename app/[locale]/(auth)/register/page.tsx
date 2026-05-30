"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import AcademyNavbar from "../../../components/AcademyNavbar";
import { register } from "../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get("returnTo");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const tr = {
    title: isRTL ? "إنشاء حساب" : "Create Account",
    subtitle: isRTL ? "ابدأ رحلتك التعليمية مع أكاديمية مَجْد" : "Start your learning journey with Majd Academy",
    firstname: isRTL ? "الاسم الأول" : "First name",
    lastname: isRTL ? "اسم العائلة" : "Last name",
    email: isRTL ? "البريد الإلكتروني" : "Email",
    mobile: isRTL ? "رقم الهاتف" : "Phone number",
    password: isRTL ? "كلمة المرور" : "Password",
    passwordHint: isRTL ? "6 أحرف على الأقل" : "At least 6 characters",
    submit: isRTL ? "سجّل الآن" : "Sign up",
    loading: isRTL ? "جارٍ التسجيل..." : "Signing up...",
    haveAccount: isRTL ? "عندك حساب بالفعل؟" : "Already have an account?",
    login: isRTL ? "سجّل دخول" : "Log in",
    optional: isRTL ? "(اختياري)" : "(optional)",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError(isRTL ? "البريد الإلكتروني مطلوب" : "Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email address"); return; }
    if (!mobile.trim()) { setError(isRTL ? "رقم الهاتف مطلوب" : "Phone number is required"); return; }
    if (!/^01[0-9]{9}$/.test(mobile.replace(/\s/g, ""))) { setError(isRTL ? "رقم الهاتف غير صحيح (مثال: 01xxxxxxxxx)" : "Invalid phone number (e.g. 01xxxxxxxxx)"); return; }
    if (!password) { setError(isRTL ? "كلمة المرور مطلوبة" : "Password is required"); return; }
    if (password.length < 6) { setError(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters"); return; }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await register({ email, mobile, password, firstname, lastname }, locale);
      if ("success" in res && res.success === false) {
        setError(res.message || (isRTL ? "حدث خطأ غير متوقع" : "Unexpected error"));
        return;
      }
      const envelope = res as { code?: number; message?: string; data?: any };
      if (envelope.code === 422) { setError(envelope.message || (isRTL ? "بيانات غير صالحة" : "Invalid data")); return; }
      if (envelope.code === 200) {
        setSuccess(envelope.message || (isRTL ? "تم التسجيل بنجاح" : "Registered successfully"));
        setTimeout(() => router.push(returnTo ? `/${locale}/login?returnTo=${encodeURIComponent(returnTo)}` : `/${locale}/login`), 1500);
      } else {
        setError(envelope.message || (isRTL ? "حدث خطأ غير متوقع" : "Unexpected error"));
      }
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
          className="w-full max-w-[480px]"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href={`/${lang}`}>
              <img src="/majdlogo.png" alt="مَجْد" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1
              className="text-[#262626] font-extrabold leading-[120%] mb-3"
              style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
            >
              {tr.title}
            </h1>
            <p className="text-[15px] font-medium text-[rgba(38,38,38,0.6)] leading-[26px]">
              {tr.subtitle}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                  {tr.firstname} <span className="text-[rgba(38,38,38,0.4)] font-medium">{tr.optional}</span>
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder={isRTL ? "أحمد" : "Ahmed"}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                  {tr.lastname} <span className="text-[rgba(38,38,38,0.4)] font-medium">{tr.optional}</span>
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder={isRTL ? "محمد" : "Mohamed"}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.email} <span className="text-[#ef5da8]">*</span>
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

            {/* Mobile */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.mobile} <span className="text-[#ef5da8]">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01xxxxxxxxx"
                className={inputCls}
                dir="ltr"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                {tr.password} <span className="text-[#ef5da8]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls + " pr-14"}
                  dir="ltr"
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
              <p className="text-[11px] text-[rgba(38,38,38,0.4)] px-2 mt-1">{tr.passwordHint}</p>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[60px] bg-[#262626] text-white hover:bg-[#3a3a3a] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ padding: "20px 40px", fontSize: "18px", fontWeight: 500 }}
            >
              {loading ? tr.loading : tr.submit}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-[rgba(38,38,38,0.05)]" />
            <span className="text-[13px] font-bold text-[rgba(38,38,38,0.4)]">
              {isRTL ? "أو" : "or"}
            </span>
            <div className="flex-1 h-[1px] bg-[rgba(38,38,38,0.05)]" />
          </div>

          {/* Login link */}
          <p className="text-center text-[15px] text-[rgba(38,38,38,0.6)] font-medium">
            {tr.haveAccount}{" "}
            <Link
              href={returnTo ? `/${lang}/login?returnTo=${encodeURIComponent(returnTo)}` : `/${lang}/login`}
              className="text-[#ef5da8] font-bold hover:text-[#262626] transition-colors"
            >
              {tr.login}
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
