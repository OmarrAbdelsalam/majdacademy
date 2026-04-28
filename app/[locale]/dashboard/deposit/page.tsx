"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "../../../i18n/LangContext";
import { submitDeposit, getWallet } from "../../../../lib/api";

const METHODS = [
  {
    id: "instapay",
    name: "InstaPay",
    nameAr: "إنستاباي",
    desc: "Acc: 2390001000023734 (Banque Misr)",
    descAr: "رقم الحساب: 2390001000023734 (بنك مصر)",
    color: "#10B981",
    bg: "bg-emerald-50",
    icon: (
      <Image src="/instapay.png" alt="InstaPay" width={90} height={35} className="object-contain" />
    ),
  },
];

export default function DepositPage() {
  const { isRTL, lang } = useLang();
  const [method, setMethod] = useState<string | null>("instapay");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState<number>(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    getWallet(lang).then(res => {
      if (res.success && res.data) {
        setCash(Number(res.data.cash) || 0);
      }
      setLoadingWallet(false);
    });
  }, [lang]);

  const tr = {
    title: isRTL ? "إيداع" : "Deposit",
    subtitle: isRTL ? "أضف رصيد إلى محفظتك" : "Add funds to your wallet",
    amount: isRTL ? "المبلغ" : "Amount",
    receipt: isRTL ? "صورة الإيصال" : "Receipt image",
    uploadReceipt: isRTL ? "ارفع صورة الإيصال" : "Upload receipt image",
    submit: isRTL ? "إيداع" : "Deposit",
    back: isRTL ? "العودة لاختيار الطريقة" : "Back",
    pendingDesc: isRTL ? "سيتم مراجعة الإيصال وإضافة الرصيد خلال أقل من يوم" : "Your receipt will be reviewed and funds added in less than a day",
    noReceipt: isRTL ? "برجاء رفع الإيصال" : "Please upload receipt",
    loading: isRTL ? "جارٍ الإرسال..." : "Sending...",
    cashBalance: isRTL ? "الرصيد الحالي" : "Current Balance",
    currency: "EGP",
    name: isRTL ? "الاسم" : "Name",
    phone: isRTL ? "رقم الهاتف" : "Phone number",
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) { setError(isRTL ? "برجاء إدخال الاسم" : "Please enter your name"); return; }
    if (!phone.trim()) { setError(isRTL ? "برجاء إدخال رقم الهاتف" : "Please enter your phone number"); return; }
    if (!amount || Number(amount) < 1) { setError(isRTL ? "برجاء إدخال مبلغ صحيح (1 جنيه على الأقل)" : "Please enter a valid amount (min 1 EGP)"); return; }
    if (!receiptFile) { setError(tr.noReceipt); return; }
    setLoading(true);
    const body = new FormData();
    body.append("payment_method", method!);
    body.append("name", name);
    body.append("phone", phone);
    body.append("amount", amount);
    body.append("image", receiptFile);
    const res = await submitDeposit(body, lang);
    if (res.success) {
      setSuccess(tr.pendingDesc);
      setAmount("");
      setName("");
      setPhone("");
      setReceiptFile(null);
      setMethod("instapay");
    } else {
      setError(res.message || (isRTL ? "حدث خطأ" : "Error processing deposit"));
    }
    setLoading(false);
  };

  const selectedMethod = METHODS.find(m => m.id === method);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
        <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-3xl p-6 mb-8 relative overflow-hidden max-w-lg" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-[12px] text-white/50 font-semibold uppercase tracking-[0.1em]">{tr.cashBalance}</p>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/50 hover:text-white transition-colors">
                {showBalance ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] sm:text-[40px] font-extrabold text-white leading-none">
                {loadingWallet ? "..." : showBalance ? cash.toLocaleString() : "••••••"}
              </span>
              <span className="text-[14px] font-bold text-[#C9A84C]">{tr.currency}</span>
            </div>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8"><path d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 14a1 1 0 100 2 1 1 0 000-2z"/></svg>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-[#f0f0f0] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "تم الإيداع بنجاح" : "Deposit Successful"}</h3>
            <p className="text-[14px] text-[#888] font-medium mb-8 leading-relaxed">{success}</p>
            <button onClick={() => { setSuccess(""); setMethod(""); setReceiptFile(null); setAmount(""); setName(""); setPhone(""); }} className="w-full py-3.5 rounded-xl font-bold text-[14px] transition-all bg-[#1a1a1a] text-white hover:bg-[#333]">
              {isRTL ? "حسناً" : "OK"}
            </button>
          </div>
        </div>
      )}

      {!method ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          {METHODS.map(m => (
            <button key={m.id} onClick={() => { setError(""); setSuccess(""); setMethod(m.id); }}
              className="bg-white rounded-2xl border border-[#f0f0f0] p-6 text-start hover:border-[#C9A84C]/40 hover:shadow-md transition-all duration-200 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${m.bg} group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
              <p className="text-[16px] font-bold text-[#1a1a1a] mb-1">{isRTL ? m.nameAr : m.name}</p>
              <p className="text-[13px] text-[#999]">{isRTL ? m.descAr : m.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 max-w-lg">
          {/* Selected method badge & details */}
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#fafafa] border border-[#f0f0f0] mb-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg overflow-hidden flex items-center justify-center">
                {selectedMethod?.icon}
              </div>
            </div>
            <div className="text-end">
              <p className="text-[15px] sm:text-[16px] font-extrabold text-[#1a1a1a] tracking-wider tabular-nums">
                2390001000023734
              </p>
              <p className="text-[12px] text-[#888] font-semibold mt-0.5">{isRTL ? "بنك مصر" : "Banque Misr"}</p>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.name}</label>
              <div className={inputCls}>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={isRTL ? "أدخل اسمك بالكامل" : "Enter your full name"} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium"
                  required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.phone}</label>
              <div className={inputCls}>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium"
                  dir="ltr" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.amount} (EGP)</label>
              <div className={inputCls}>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium"
                  dir="ltr" required min="1" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.receipt}</label>
              <label className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-[#eee] rounded-2xl cursor-pointer hover:border-[#C9A84C]/40 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span className="text-[13px] text-[#999] font-medium">{receiptFile ? receiptFile.name : tr.uploadReceipt}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
              {loading ? tr.loading : tr.submit}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
