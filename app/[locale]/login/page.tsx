"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useLang } from "../../i18n/LangContext";
import AcademyNavbar from "../../components/AcademyNavbar";
import { login, verifyOtp, initCsrf } from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

function setCookieToken(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `gct_token=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}`;
}

function getTokenCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("gct_token="));
  return match ? decodeURIComponent(match.slice("gct_token=".length)) : undefined;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams?.get("returnTo");
  const cleanReturnTo = rawReturnTo ? (rawReturnTo.startsWith("/") ? rawReturnTo : `/${rawReturnTo}`) : null;
  const redirectPath = cleanReturnTo
    ? cleanReturnTo.startsWith(`/${locale}`) ? cleanReturnTo : `/${locale}${cleanReturnTo}`
    : `/${locale}/dashboard`;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP flow
  const [otpScreen, setOtpScreen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");

  const tr = {
    title: isRTL ? "تسجيل الدخول" : "Log in",
    subtitle: isRTL ? "مرحباً بعودتك في أكاديمية مَجْد" : "Welcome back to Majd Academy",
    emailLabel: isRTL ? "البريد الإلكتروني أو رقم الهاتف" : "Email or phone number",
    passwordLabel: isRTL ? "كلمة المرور" : "Password",
    forgot: isRTL ? "نسيت كلمة المرور؟" : "Forgot password?",
    submit: isRTL ? "تسجيل الدخول" : "Log in",
    loading: isRTL ? "جارٍ التحميل..." : "Loading...",
    noAccount: isRTL ? "ما عندك حساب؟" : "Don't have an account?",
    register: isRTL ? "سجّل الآن" : "Sign up",
    otpTitle: isRTL ? "أدخل رمز التحقق" : "Enter verification code",
    otpDesc: isRTL ? "أرسلنا رمز التحقق على بريدك أو هاتفك" : "We sent a verification code to your email or phone",
    otpLabel: isRTL ? "رمز التحقق" : "Verification code",
    verify: isRTL ? "تحقق" : "Verify",
    back: isRTL ? "العودة" : "Back",
  };

  useEffect(() => {
    if (getTokenCookie()) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) { setError(isRTL ? "الحقل مطلوب" : "Field is required"); return; }
    if (!password) { setError(isRTL ? "كلمة المرور مطلوبة" : "Password is required"); return; }
    if (password.length < 6) { setError(isRTL ? "كلمة المرور قصيرة جداً" : "Password is too short"); return; }
    setLoading(true);
    try {
      await initCsrf();
      const res = await login({ user: phone, password }, locale);
      if ("success" in res && res.success === false) { setError(res.message ?? null); return; }
      const envelope = res as { code: number; data: Record<string, unknown>; message: string };
      if (envelope.code === 422) { setError(envelope.message); return; }
      const data = envelope.data;
      if (data?.access_token) {
        setCookieToken(data.access_token as string);
        router.push(redirectPath);
      } else if (data?.user_id) {
        setUserId(data.user_id as number);
        setOtpScreen(true);
      } else {
        setError(envelope.message || (isRTL ? "حدث خطأ غير متوقع" : "Unexpected error"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) { setError(isRTL ? "رمز التحقق مطلوب" : "OTP code is required"); return; }
    if (otp.length < 4) { setError(isRTL ? "رمز التحقق غير صحيح" : "Invalid OTP code"); return; }
    setLoading(true);
    try {
      const res = await verifyOtp({ id: userId, code: otp }, locale);
      if ("success" in res && res.success === false) { setError(res.message ?? null); return; }
      const envelope = res as { code: number; data: Record<string, unknown>; message: string };
      if (envelope.code === 422) { setError(envelope.message); return; }
      const data = envelope.data;
      if (data?.access_token) {
        setCookieToken(data.access_token as string);
        router.push(redirectPath);
      } else {
        setError(envelope.message || (isRTL ? "رمز غير صحيح" : "Invalid code"));
      }
    } finally {
      setLoading(false);
    }
  }

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
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href={`/${lang}`}>
              <img src="/majdlogo.png" alt="مَجْد" className="h-12 w-auto" />
            </Link>
          </div>

          {!otpScreen ? (
            <>
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
              <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {tr.emailLabel}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isRTL ? "example@email.com أو 01xxxxxxxxx" : "example@email.com or 01xxxxxxxxx"}
                    className={inputCls}
                    dir="ltr"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {tr.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputCls + " pr-14"}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 right-5 text-[rgba(38,38,38,0.4)] hover:text-[#262626] transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {showPassword ? (
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
                  <div className="flex justify-end px-2 mt-1">
                    <Link
                      href={`/${lang}/forgot-password`}
                      className="text-[13px] font-medium text-[#ef5da8] hover:text-[#262626] transition-colors"
                    >
                      {tr.forgot}
                    </Link>
                  </div>
                </div>

                {/* Error */}
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

              {/* Register link */}
              <p className="text-center text-[15px] text-[rgba(38,38,38,0.6)] font-medium">
                {tr.noAccount}{" "}
                <Link
                  href={rawReturnTo ? `/${lang}/register?returnTo=${encodeURIComponent(rawReturnTo)}` : `/${lang}/register`}
                  className="text-[#ef5da8] font-bold hover:text-[#262626] transition-colors"
                >
                  {tr.register}
                </Link>
              </p>
            </>
          ) : (
            /* OTP Screen */
            <>
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-[32px] bg-[#fef0f8] flex items-center justify-center mx-auto mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef5da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <h1
                  className="text-[#262626] font-extrabold leading-[120%] mb-3"
                  style={{ fontSize: "clamp(24px, 4vw, 32px)" }}
                >
                  {tr.otpTitle}
                </h1>
                <p className="text-[15px] font-medium text-[rgba(38,38,38,0.6)] leading-[26px]">
                  {tr.otpDesc}
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleOtpSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[rgba(38,38,38,0.6)] px-2">
                    {tr.otpLabel}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="------"
                    className={inputCls + " text-center tracking-[0.4em] font-bold text-lg"}
                    dir="ltr"
                    inputMode="numeric"
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
                  {loading ? tr.loading : tr.verify}
                </button>

                <button
                  type="button"
                  onClick={() => { setOtpScreen(false); setError(null); setOtp(""); }}
                  className="text-[14px] font-bold text-[#262626] bg-[#262626]/5 px-5 py-2.5 rounded-full hover:bg-[#262626] hover:text-white transition-all duration-200 mx-auto"
                >
                  ← {tr.back}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
