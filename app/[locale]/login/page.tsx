"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useLang } from "../../i18n/LangContext";
import Navbar from "../../components/Navbar";
import { login, verifyOtp, initCsrf } from "../../../lib/api";

function setCookieToken(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `gct_token=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}`;
}

function getTokenCookie(): string | undefined {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("gct_token="));
  return match ? decodeURIComponent(match.slice("gct_token=".length)) : undefined;
}

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
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("otp");

  // OTP flow state
  const [otpScreen, setOtpScreen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (getTokenCookie()) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  const tr = {
    title: isRTL ? "تسجيل الدخول" : "Log in",
    subtitle: isRTL ? "أهلاً بعودتك" : "Welcome back",
    phone: isRTL ? "رقم الهاتف" : "Phone number",
    password: isRTL ? "كلمة المرور" : "Password",
    forgot: isRTL ? "نسيت كلمة المرور؟" : "Forgot password?",
    submit: isRTL ? "دخول" : "Log in",
    noAccount: isRTL ? "ليس لديك حساب ؟" : "Don't have an account?",
    register: isRTL ? "سجّل الآن" : "Sign up",
    tagline: isRTL ? "اشتري الذهب والفضة بأمان وسهولة" : "Buy gold & silver with confidence",
    secured: isRTL ? "منصة مرخّصة ومؤمنة" : "Licensed & secured platform",
    otpTitle: isRTL ? "أدخل رمز التحقق" : "Enter verification code",
    otpLabel: isRTL ? "رمز OTP" : "OTP code",
    otpSubmit: isRTL ? "تحقق" : "Verify",
    loading: isRTL ? "جارٍ التحميل..." : "Loading...",
    switchToOtp: isRTL ? "تسجيل الدخول برمز OTP" : "Log in with OTP",
    switchToPassword: isRTL ? "تسجيل الدخول بكلمة المرور" : "Log in with password",
    sendOtp: isRTL ? "إرسال رمز OTP" : "Send OTP",
  };

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // client validation
    if (!phone.trim()) { setError(isRTL ? "رقم الهاتف مطلوب" : "Phone number is required"); return; }
    if (loginMode === "password" && !password) { setError(isRTL ? "كلمة المرور مطلوبة" : "Password is required"); return; }
    if (loginMode === "password" && password.length < 6) { setError(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      // Fetch CSRF cookie before login
      await initCsrf();

      const body = loginMode === "password"
        ? { user: phone, password }
        : { user: phone };
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
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col lg:flex-row" dir={isRTL ? "rtl" : "ltr"}>

      {/* Gold Branding Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center pt-[100px]"
        style={{ background: "linear-gradient(145deg, #D4A82A 0%, #C9A84C 25%, #E8C96A 50%, #D4A82A 75%, #B8860B 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <Image src="/logo.png" alt="Golden Circle" width={280} height={120} className="w-[160px] h-auto object-contain mb-8 drop-shadow-lg" />
          <h2 className="text-[28px] xl:text-[34px] font-extrabold text-white leading-[1.2] tracking-tight mb-4 drop-shadow-sm">{tr.tagline}</h2>
          <p className="text-[15px] text-white/70 font-medium leading-relaxed mb-10">{tr.secured}</p>
          <div className="flex items-center gap-6">
            {[
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: isRTL ? "مرخّصة" : "Licensed" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: isRTL ? "مؤمنة" : "Secured" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: isRTL ? "فورية" : "Instant" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-8 text-white/[0.06] text-[11px] font-bold tracking-[0.3em] uppercase">Golden Circle Gold</div>
      </div>

      {/* White Form Panel */}
      <div className="flex-1 bg-white flex flex-col pt-32 md:pt-32">
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-10 lg:py-10">
          <div className="w-full max-w-[420px]">

            {!otpScreen ? (
              <>
                <div className="mb-10">
                  <p className="text-[12px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2">{tr.subtitle}</p>
                  <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">{tr.title}</h1>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleLoginSubmit}>
                  {/* Phone field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#888]">{tr.phone}</label>
                    <div className="flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                        </svg>
                      </div>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" dir="ltr" />
                    </div>
                  </div>

                  {/* Password field — only in password mode */}
                  {loginMode === "password" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[13px] font-semibold text-[#888]">{tr.password}</label>
                        <Link href={`/${lang}/forgot-password`} className="text-[12px] text-[#C9A84C] font-semibold hover:text-[#B89A3A] transition-colors">{tr.forgot}</Link>
                      </div>
                      <div className="flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        </div>
                        <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="text-[#ccc] hover:text-[#888] transition-colors shrink-0">
                          {showPass ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-[13px] text-red-500 font-medium -mt-2">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)", color: "white" }}
                  >
                    {loading ? tr.loading : loginMode === "otp" ? tr.sendOtp : tr.submit}
                  </button>

                  {/* Toggle login mode */}
                  <button
                    type="button"
                    onClick={() => { setLoginMode(m => m === "password" ? "otp" : "password"); setError(null); setPassword(""); }}
                    className="text-[13px] text-[#C9A84C] font-semibold hover:text-[#B89A3A] transition-colors text-center"
                  >
                    {loginMode === "password" ? tr.switchToOtp : tr.switchToPassword}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-[1px] bg-[#f0f0f0]" />
                  <span className="text-[11px] font-semibold text-[#ccc] uppercase tracking-wider">{isRTL ? "أو" : "or"}</span>
                  <div className="flex-1 h-[1px] bg-[#f0f0f0]" />
                </div>

                <p className="text-center text-[14px] text-[#999]">
                  {tr.noAccount}{" "}
                  <Link href={rawReturnTo ? `/${lang}/register?returnTo=${encodeURIComponent(rawReturnTo)}` : `/${lang}/register`} className="text-[#1a1a1a] font-bold hover:text-[#C9A84C] transition-colors">{tr.register}</Link>
                </p>
              </>
            ) : (
              <>
                <div className="mb-10">
                  <p className="text-[12px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2">{isRTL ? "التحقق" : "Verification"}</p>
                  <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">{tr.otpTitle}</h1>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleOtpSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#888]">{tr.otpLabel}</label>
                    <div className="flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="------"
                        className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium tracking-widest text-center"
                        dir="ltr"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                    </div>
                  </div>

                  {error && <p className="text-[13px] text-red-500 font-medium -mt-2">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)", color: "white" }}
                  >
                    {loading ? tr.loading : tr.otpSubmit}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpScreen(false); setError(null); setOtp(""); }}
                    className="text-[13px] text-[#999] hover:text-[#666] transition-colors text-center"
                  >
                    {isRTL ? "← العودة" : "← Back"}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>

        <div className="px-10 py-5 flex items-center justify-center">
          <p className="text-[11px] text-[#ccc]">&copy; {new Date().getFullYear()} Golden Circle Gold</p>
        </div>
      </div>
    </div>
    </>
  );
}
