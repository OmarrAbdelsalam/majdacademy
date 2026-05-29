"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useLang } from "../../i18n/LangContext";
import { login, verifyOtp, initCsrf } from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

function setCookieToken(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `gct_token=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}`;
}

function getTokenCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("gct_token="));
  return match ? decodeURIComponent(match.slice("gct_token=".length)) : undefined;
}

/* ─── Animated Character ─── */
function Character({
  focusedField,
  lookingAtLogo,
  smoothPupil,
}: {
  focusedField: "none" | "email" | "password";
  lookingAtLogo: boolean;
  smoothPupil: { lx: number; ly: number; rx: number; ry: number };
}) {
  const hiding = focusedField === "password";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end pb-8 sm:pb-12">

      {/* ── Left Leg ── */}
      <svg className="absolute -bottom-[50px] left-[30%] sm:left-[35%] w-14 h-14 overflow-visible z-10" viewBox="0 0 60 60" fill="none">
        <path d="M 42 0 Q 32 30 15 48" stroke="#22122c" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="12" cy="50" rx="10" ry="5" fill="#22122c" />
      </svg>

      {/* ── Right Leg ── */}
      <svg className="absolute -bottom-[50px] right-[30%] sm:right-[35%] w-14 h-14 overflow-visible z-10" viewBox="0 0 60 60" fill="none">
        <path d="M 18 0 Q 28 30 45 48" stroke="#22122c" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="48" cy="50" rx="10" ry="5" fill="#22122c" />
      </svg>

      {/* ── Face + Arms (same container so arms are relative to face) ── */}
      <div className="relative flex flex-col items-center z-30">
        
        {/* ── Left Hand (positioned relative to face) ── */}
        <motion.div
          className="absolute z-40"
          style={{ top: -10, left: -52 }}
          animate={hiding
            ? { y: 6, x: 20, rotate: 25 }
            : { y: 0, x: 0, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 150, damping: 16 }}
        >
          <svg width="60" height="90" viewBox="0 0 60 90" fill="none" className="overflow-visible">
            {/* Arm */}
            <path d="M 55 85 Q 40 55 30 35 Q 22 18 18 6" stroke="#22122c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            {/* Hand palm */}
            <circle cx="18" cy="5" r="7" fill="#7B56C5" stroke="#22122c" strokeWidth="3" />
            {/* Fingers */}
            <line x1="11" y1="1" x2="6" y2="-6" stroke="#22122c" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="16" y1="-3" x2="13" y2="-12" stroke="#22122c" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="22" y1="-3" x2="23" y2="-12" stroke="#22122c" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* ── Right Hand (positioned relative to face) ── */}
        <motion.div
          className="absolute z-40"
          style={{ top: -10, right: -52 }}
          animate={hiding
            ? { y: 6, x: -20, rotate: -25 }
            : { y: 0, x: 0, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 150, damping: 16 }}
        >
          <svg width="60" height="90" viewBox="0 0 60 90" fill="none" className="overflow-visible">
            {/* Arm */}
            <path d="M 5 85 Q 20 55 30 35 Q 38 18 42 6" stroke="#22122c" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            {/* Hand palm */}
            <circle cx="42" cy="5" r="7" fill="#7B56C5" stroke="#22122c" strokeWidth="3" />
            {/* Fingers */}
            <line x1="49" y1="1" x2="54" y2="-6" stroke="#22122c" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="44" y1="-3" x2="47" y2="-12" stroke="#22122c" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="38" y1="-3" x2="37" y2="-12" stroke="#22122c" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Eyes Row */}
        <div className="flex gap-2 sm:gap-3 mb-2.5">
          {/* Left Eye */}
          <motion.div
            className="w-14 h-16 sm:w-16 sm:h-20 bg-white rounded-[50%] flex items-center justify-center relative overflow-hidden shadow-sm"
            animate={hiding
              ? { scaleY: 0.08, scaleX: 1.1 }
              : { scaleY: 1, scaleX: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="w-6 h-6 sm:w-7 sm:h-7 bg-[#22122c] rounded-full"
              animate={{
                x: smoothPupil.lx,
                y: smoothPupil.ly,
                opacity: hiding ? 0 : 1,
              }}
              transition={{ opacity: { duration: 0.15 } }}
            />
          </motion.div>
          {/* Right Eye */}
          <motion.div
            className="w-14 h-16 sm:w-16 sm:h-20 bg-white rounded-[50%] flex items-center justify-center relative overflow-hidden shadow-sm"
            animate={hiding
              ? { scaleY: 0.08, scaleX: 1.1 }
              : { scaleY: 1, scaleX: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="w-6 h-6 sm:w-7 sm:h-7 bg-[#22122c] rounded-full"
              animate={{
                x: smoothPupil.rx,
                y: smoothPupil.ry,
                opacity: hiding ? 0 : 1,
              }}
              transition={{ opacity: { duration: 0.15 } }}
            />
          </motion.div>
        </div>

        {/* Smile */}
        <motion.svg
          width="36" height="18" viewBox="0 0 40 20" fill="none" stroke="#22122c" strokeWidth="5" strokeLinecap="round"
          animate={hiding ? { y: -2, scale: 0.9 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <path d={hiding ? "M 8 5 Q 20 20 32 5" : "M 5 5 Q 20 22 35 5"} />
        </motion.svg>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LoginPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams?.get("returnTo");
  const cleanReturnTo = rawReturnTo ? (rawReturnTo.startsWith('/') ? rawReturnTo : `/${rawReturnTo}`) : null;
  const redirectPath = cleanReturnTo
    ? (cleanReturnTo.startsWith(`/${locale}`) ? cleanReturnTo : `/${locale}${cleanReturnTo}`)
    : `/${locale}/dashboard`;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);

  // OTP flow state
  const [otpScreen, setOtpScreen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");

  // Interactive Character States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<"none" | "email" | "password">("none");
  const [lookingAtLogo, setLookingAtLogo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smoothed pupil position
  const [smoothPupil, setSmoothPupil] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const animRef = useRef<number>(0);

  // Redirect if already logged in
  useEffect(() => {
    if (getTokenCookie()) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Compute raw pupil offset for one eye
  const getRawPupil = (eyeXOffset: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();

    const eyeCenterY = rect.bottom - 40;
    const eyeCenterX = rect.left + rect.width / 2 + eyeXOffset;

    let targetX = mousePos.x;
    let targetY = mousePos.y;

    if (lookingAtLogo) {
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height * 0.45;
    } else if (focusedField === "email") {
      targetX = eyeCenterX;
      targetY = eyeCenterY + 300;
    } else if (focusedField === "password") {
      targetX = eyeCenterX;
      targetY = eyeCenterY;
    } else if (targetX === 0 && targetY === 0) {
      targetX = eyeCenterX;
      targetY = eyeCenterY;
    }

    const angle = Math.atan2(targetY - eyeCenterY, targetX - eyeCenterX);
    const distance = Math.hypot(targetY - eyeCenterY, targetX - eyeCenterX);

    const maxMove = 7;
    const move = Math.min(maxMove, distance / 20);

    return {
      x: Math.cos(angle) * move,
      y: Math.sin(angle) * move,
    };
  };

  // Smooth animation loop for pupils
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smoothness = 0.07;

    const animate = () => {
      const left = getRawPupil(isRTL ? 32 : -32);
      const right = getRawPupil(isRTL ? -32 : 32);

      setSmoothPupil((prev) => ({
        lx: lerp(prev.lx, left.x, smoothness),
        ly: lerp(prev.ly, left.y, smoothness),
        rx: lerp(prev.rx, right.x, smoothness),
        ry: lerp(prev.ry, right.y, smoothness),
      }));

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePos, focusedField, lookingAtLogo, isRTL]);

  // Trigger shake on error
  useEffect(() => {
    if (error) {
      setShakeError(true);
      const t = setTimeout(() => setShakeError(false), 500);
      return () => clearTimeout(t);
    }
  }, [error]);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) { setError(isRTL ? "الحقل مطلوب" : "Field is required"); return; }
    if (!password) { setError(isRTL ? "كلمة المرور مطلوبة" : "Password is required"); return; }
    if (password.length < 6) { setError(isRTL ? "كلمة المرور قصيرة جداً" : "Password is too short"); return; }
    setLoading(true);
    try {
      await initCsrf();
      const body = { user: phone, password };
      const res = await login(body, locale);
      if ("success" in res && res.success === false) {
        setError(res.message ?? null);
        return;
      }
      const envelope = res as { code: number; data: Record<string, unknown>; message: string };
      if (envelope.code === 422) {
        setError(envelope.message);
        return;
      }
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
      if ("success" in res && res.success === false) {
        setError(res.message ?? null);
        return;
      }
      const envelope = res as { code: number; data: Record<string, unknown>; message: string };
      if (envelope.code === 422) {
        setError(envelope.message);
        return;
      }
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

  return (
    <div className="min-h-[100dvh] bg-[#EBE5D9] flex flex-col items-center relative overflow-hidden font-sans select-none" dir={isRTL ? "rtl" : "ltr"}>

      {/* Keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
        .shake-anim { animation: shake 0.45s ease-in-out; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

      {/* ── The Giant Character Blob ── */}
      <div
        ref={containerRef}
        className="relative w-[180vw] sm:w-[700px] aspect-square bg-[#7B56C5] rounded-[50%] mt-[-95vw] sm:mt-[-350px] shrink-0 z-0"
      >
        {/* Text Content inside the Blob */}
        <div className="absolute bottom-[25%] sm:bottom-[34%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-full z-40">
          <Link href={`/${lang}`}>
            <h1 className="text-white text-[42px] sm:text-6xl font-black tracking-tight mb-1 hover:scale-105 transition-transform cursor-pointer" style={{ fontFamily: 'var(--font-tajawal)' }}>
              أكاديمية مَجْد
            </h1>
          </Link>
          <p className="text-white/90 text-[14px] sm:text-[17px] font-semibold tracking-wide">تعلم بمتعة وسهولة</p>
        </div>

        {/* Character Component */}
        <Character
          focusedField={focusedField}
          lookingAtLogo={lookingAtLogo}
          smoothPupil={smoothPupil}
        />
      </div>

      {/* Shadow */}
      <div className="w-[160px] h-[20px] bg-[#D4CEDB] rounded-[50%] mt-12 opacity-70 z-0 mix-blend-multiply"></div>

      {/* ── Form Section ── */}
      <div className="w-full max-w-[340px] z-10 flex flex-col gap-4 mt-4 pb-12 px-2">
        {!otpScreen ? (
          <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
            <h2 className="text-center text-[#524482] text-xl font-black mb-1">
              {isRTL ? "مرحباً بعودتك!" : "Welcome back!"}
            </h2>

            {/* Email/Phone Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#777] px-2">
                {isRTL ? "البريد الإلكتروني أو رقم الهاتف" : "E-mail"}
              </label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-[#bbb] pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <polyline points="22,7 12,14 2,7" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("none")}
                  className="w-full bg-transparent border-[1.5px] border-[#CCC4D2] rounded-[18px] pl-11 pr-4 py-[14px] outline-none focus:border-[#7B56C5] focus:bg-white/40 transition-all text-[15px] font-medium text-[#22122c] placeholder:text-[#bbb]"
                  placeholder="you@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#777] px-2">
                {isRTL ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-[#bbb] pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="3" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("none")}
                  className="w-full bg-transparent border-[1.5px] border-[#CCC4D2] rounded-[18px] pl-11 pr-12 py-[14px] outline-none focus:border-[#7B56C5] focus:bg-white/40 transition-all text-[15px] font-medium tracking-widest text-[#22122c] placeholder:text-[#bbb]"
                  placeholder="••••••••"
                  dir="ltr"
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 -translate-y-1/2 right-3.5 text-[#aaa] hover:text-[#524482] transition-colors p-1"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-start px-2 mt-1">
                <Link href={`/${lang}/forgot-password`} className="text-[12px] font-medium text-[#777] underline underline-offset-2 hover:text-[#524482] transition-colors">
                  {isRTL ? "نسيت كلمة المرور؟" : "Forgot your password?"}
                </Link>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mt-1 ${shakeError ? "shake-anim" : ""}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-[13px] text-red-600 font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onMouseDown={() => setLookingAtLogo(true)}
              onMouseUp={() => setLookingAtLogo(false)}
              onMouseLeave={() => setLookingAtLogo(false)}
              onTouchStart={() => setLookingAtLogo(true)}
              onTouchEnd={() => setLookingAtLogo(false)}
              className="w-full bg-[#524482] text-white font-bold text-[17px] rounded-2xl py-3.5 mt-2 hover:bg-[#43366c] transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full spinner" />
                  <span>{isRTL ? "جارٍ التحميل..." : "Loading..."}</span>
                </>
              ) : (isRTL ? "تسجيل الدخول" : "Sign in")}
            </button>

            {/* Register Link */}
            <div className="flex justify-center items-center gap-1.5 mt-4 text-[12px] font-medium text-[#777]">
              <span>{isRTL ? "لا يوجد لديك حساب ؟" : "Don't have an account?"}</span>
              <Link href={rawReturnTo ? `/${lang}/register?returnTo=${encodeURIComponent(rawReturnTo)}` : `/${lang}/register`} className="underline underline-offset-2 text-[#524482] font-bold hover:text-[#7B56C5] transition-colors">
                {isRTL ? "سجل الآن" : "Sign up"}
              </Link>
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
            <h2 className="text-2xl font-black text-center text-[#22122c] mb-2">{isRTL ? "أدخل رمز التحقق" : "Enter Verification"}</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#555] px-1">{isRTL ? "رمز OTP" : "OTP Code"}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("none")}
                className="w-full bg-transparent border-2 border-[#D4CFC6] rounded-2xl px-4 py-3.5 outline-none focus:border-[#7B56C5] transition-colors text-center tracking-[0.5em] font-black text-lg text-[#22122c]"
                placeholder="------"
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
                  className={`flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mt-1 ${shakeError ? "shake-anim" : ""}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-[13px] text-red-600 font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              onMouseDown={() => setLookingAtLogo(true)}
              onMouseUp={() => setLookingAtLogo(false)}
              onMouseLeave={() => setLookingAtLogo(false)}
              onTouchStart={() => setLookingAtLogo(true)}
              onTouchEnd={() => setLookingAtLogo(false)}
              className="w-full bg-[#524482] text-white font-bold text-[17px] rounded-2xl py-3.5 mt-2 hover:bg-[#43366c] transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full spinner" />
                  <span>{isRTL ? "جارٍ التحميل..." : "Loading..."}</span>
                </>
              ) : (isRTL ? "تحقق" : "Verify")}
            </button>

            <button
              type="button"
              onClick={() => { setOtpScreen(false); setError(null); setOtp(""); }}
              className="text-[13px] text-[#888] hover:text-[#524482] transition-colors text-center mt-3 font-bold"
            >
              {isRTL ? "← العودة" : "← Back"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
