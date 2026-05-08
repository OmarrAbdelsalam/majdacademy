"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../i18n/LangContext";
import Navbar from "../../../components/Navbar";
import { register } from "../../../../lib/api";

export default function RegisterPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || lang;
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
    subtitle: isRTL ? "ابدأ رحلتك في شراء الذهب" : "Start buying gold today",
    firstname: isRTL ? "الاسم الأول (اختياري)" : "First name (optional)",
    lastname: isRTL ? "اسم العائلة (اختياري)" : "Last name (optional)",
    email: isRTL ? "البريد الإلكتروني" : "Email",
    mobile: isRTL ? "رقم الهاتف" : "Phone number",
    password: isRTL ? "كلمة المرور" : "Password",
    passwordHint: isRTL ? "6 أحرف على الأقل" : "At least 6 characters",
    submit: isRTL ? "سجّل الآن" : "Sign up",
    haveAccount: isRTL ? "عندك حساب بالفعل؟" : "Already have an account?",
    login: isRTL ? "سجّل دخول" : "Log in",
    tagline: isRTL ? "اشتري الذهب والفضة بأمان وسهولة" : "Buy gold & silver with confidence",
    secured: isRTL ? "منصة مرخّصة ومؤمنة" : "Licensed & secured platform",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // client validation
    if (!email.trim()) { setError(isRTL ? "البريد الإلكتروني مطلوب" : "Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email address"); return; }
    if (!mobile.trim()) { setError(isRTL ? "رقم الهاتف مطلوب" : "Phone number is required"); return; }
    if (!/^01[0-9]{9}$/.test(mobile.replace(/\s/g, ""))) { setError(isRTL ? "رقم الهاتف غير صحيح (مثال: 01xxxxxxxxx)" : "Invalid phone number (e.g. 01xxxxxxxxx)"); return; }
    if (!password) { setError(isRTL ? "كلمة المرور مطلوبة" : "Password is required"); return; }
    if (password.length < 6) {
      setError(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
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
      if (envelope.code === 422) {
        setError(envelope.message || (isRTL ? "بيانات غير صالحة" : "Invalid data"));
        return;
      }
      if (envelope.code === 200) {
        setSuccess(envelope.message || (isRTL ? "تم التسجيل بنجاح" : "Registered successfully"));
        setTimeout(() => router.push(`/${locale}/login`), 1500);
      } else {
        setError(envelope.message || (isRTL ? "حدث خطأ غير متوقع" : "Unexpected error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-3.5 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";
  const inputInner = "flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium";

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col lg:flex-row" dir={isRTL ? "rtl" : "ltr"}>
        {/* Gold Branding Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center pt-[100px]" style={{ background: 'linear-gradient(145deg, #D4A82A 0%, #C9A84C 25%, #E8C96A 50%, #D4A82A 75%, #B8860B 100%)' }}>
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
            <Image src="/logo.png" alt="Golden Circle" width={280} height={120} className="w-[160px] h-auto object-contain mb-8 drop-shadow-lg" />
            <h2 className="text-[28px] xl:text-[34px] font-extrabold text-white leading-[1.2] tracking-tight mb-4 drop-shadow-sm">{tr.tagline}</h2>
            <p className="text-[15px] text-white/70 font-medium leading-relaxed">{tr.secured}</p>
          </div>
          <div className="absolute bottom-8 left-8 text-white/[0.06] text-[11px] font-bold tracking-[0.3em] uppercase">Golden Circle Trading</div>
        </div>

        {/* Form Panel */}
        <div className="flex-1 bg-white flex flex-col pt-32 md:pt-32">
          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-10 lg:py-10">
            <div className="w-full max-w-[420px]">
              <div className="mb-8">
                <p className="text-[12px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2">{tr.subtitle}</p>
                <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">{tr.title}</h1>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Name row */}
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#888]">{tr.firstname}</label>
                    <div className={inputCls}><input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} placeholder={isRTL ? "أحمد" : "Ahmed"} className={inputInner} /></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#888]">{tr.lastname}</label>
                    <div className={inputCls}><input type="text" value={lastname} onChange={e => setLastname(e.target.value)} placeholder={isRTL ? "محمد" : "Mohamed"} className={inputInner} /></div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.email} <span className="text-red-400">*</span></label>
                  <div className={inputCls}><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" className={inputInner} dir="ltr" required /></div>
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.mobile} <span className="text-red-400">*</span></label>
                  <div className={inputCls}><input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="01xxxxxxxxx" className={inputInner} dir="ltr" required /></div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.password} <span className="text-red-400">*</span></label>
                  <div className={inputCls}>
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputInner} required minLength={6} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-[#ccc] hover:text-[#888] transition-colors shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                      </svg>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#bbb] mt-1">{tr.passwordHint}</p>
                </div>

                {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}
                {success && <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-[13px] font-medium">{success}</div>}

                <button type="submit" disabled={loading} className="w-full py-4 mt-1 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
                  {loading ? (isRTL ? "جارٍ التسجيل..." : "Signing up...") : tr.submit}
                </button>
              </form>

              <div className="flex items-center gap-4 my-8"><div className="flex-1 h-[1px] bg-[#f0f0f0]" /><span className="text-[11px] font-semibold text-[#ccc] uppercase tracking-wider">{isRTL ? "أو" : "or"}</span><div className="flex-1 h-[1px] bg-[#f0f0f0]" /></div>
              <p className="text-center text-[14px] text-[#999]">{tr.haveAccount}{" "}<Link href={`/${lang}/login`} className="text-[#1a1a1a] font-bold hover:text-[#C9A84C] transition-colors">{tr.login}</Link></p>
            </div>
          </div>
          <div className="px-10 py-5 flex items-center justify-center"><p className="text-[11px] text-[#ccc]">&copy; {new Date().getFullYear()} Golden Circle Trading</p></div>
        </div>
      </div>
    </>
  );
}
