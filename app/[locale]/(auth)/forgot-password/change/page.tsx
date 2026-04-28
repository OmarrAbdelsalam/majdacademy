"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLang } from "../../../../i18n/LangContext";
import Navbar from "../../../../components/Navbar";
import { changePassword } from "../../../../../lib/api";

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

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center pt-24 pb-12 px-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-full max-w-[440px]">
          <div className="flex gap-2 mb-8">
            <div className="flex-1 h-1 rounded-full bg-[#C9A84C]" />
            <div className="flex-1 h-1 rounded-full bg-[#C9A84C]" />
            <div className="flex-1 h-1 rounded-full bg-[#C9A84C]" />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/10 to-[#E8C96A]/10 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>

          <p className="text-[12px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2">{tr.subtitle}</p>
          <h1 className="text-[30px] sm:text-[36px] font-extrabold text-[#1a1a1a] tracking-tight leading-none mb-3">{tr.title}</h1>
          <p className="text-[14px] text-[#999] mb-8 leading-relaxed">{tr.desc}</p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.password}</label>
              <div className={inputCls}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-[#ccc] hover:text-[#888] transition-colors shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                  </svg>
                </button>
              </div>
              <p className="text-[11px] text-[#bbb] mt-1">{tr.hint}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.confirm}</label>
              <div className={inputCls}>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" required minLength={6} />
              </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}
            {success && <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-[13px] font-medium">{success}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99]" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
              {loading ? (isRTL ? "جارٍ التغيير..." : "Changing...") : tr.submit}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href={`/${lang}/forgot-password/verify`} className="text-[14px] text-[#999] hover:text-[#C9A84C] transition-colors font-medium inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? "rotate-180" : ""}><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              {tr.back}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
