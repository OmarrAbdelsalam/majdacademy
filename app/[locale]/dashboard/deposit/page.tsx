"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useLang } from "../../../i18n/LangContext";
import { getWallet, createGeideaDeposit, getDepositStatus, submitDeposit } from "../../../../lib/api";

type DepositStatus = "pending" | "paid" | "failed" | "cancelled" | "expired" | "pending_review" | "unknown";

const METHODS = [
  {
    id: "geidea",
    name: "Credit / Debit Card",
    nameAr: "بطاقة بنكية",
    desc: "Pay securely via Geidea",
    descAr: "دفع إلكتروني آمن عبر جيديا",
    color: "#C9A84C",
    bg: "bg-amber-50",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
    ),
  },
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

  // Wallet balance
  const [cash, setCash] = useState<number>(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [showBalance, setShowBalance] = useState(false);

  // Method selection
  const [method, setMethod] = useState<string>("instapay");

  // Shared form
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Geidea specific
  const [currency] = useState("EGP");
  const [activeDeposit, setActiveDeposit] = useState<{ id: number; trx: string } | null>(null);
  const [depositResult, setDepositResult] = useState<DepositStatus | "timeout" | null>(null);
  // polling runs silently — UI only reacts when a final result arrives
  const pollingRef = useRef<boolean>(false);

  // InstaPay specific
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getWallet(lang).then(res => {
      if (res.success && res.data) setCash(Number(res.data.cash) || 0);
      setLoadingWallet(false);
    });
  }, [lang]);

  // Polling with exponential backoff (Geidea) — runs silently in background
  const startPolling = useCallback((depositId: number) => {
    pollingRef.current = true;
    setDepositResult(null);

    const delays = [2000, 4000, 8000, 16000, 30000, 30000, 30000, 30000, 30000, 30000];
    let index = 0;

    const poll = async () => {
      if (!pollingRef.current) return;
      const res = await getDepositStatus(depositId, lang);
      if (res.success && res.data) {
        const status = res.data.status as DepositStatus;
        if (status !== "pending") {
          pollingRef.current = false;
          setDepositResult(status);
          if (status === "paid") {
            const walletRes = await getWallet(lang);
            if (walletRes.success && walletRes.data) setCash(Number(walletRes.data.cash) || 0);
          }
          return;
        }
      }
      index++;
      if (index >= delays.length) {
        pollingRef.current = false;
        setDepositResult("timeout");
        return;
      }
      setTimeout(poll, delays[index]);
    };

    setTimeout(poll, delays[0]);
  }, [lang]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Support both new structured message and legacy string
      const data = event.data;
      if (data === "geidea_cancel" || data?.status === "cancelled") {
        setDepositResult("cancelled");
      } else if (data?.type === "geidea_result" && data?.status === "success") {
        // SDK confirmed success — polling will verify and update result
        // No need to set depositResult here; polling handles it
      } else if (data?.type === "geidea_result" && data?.status === "failed") {
        setDepositResult("failed");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleGeideaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 50 || numAmount > 100000) {
      setError(isRTL ? "المبلغ يجب أن يكون بين 50 و 100,000" : "Amount must be between 50 and 100,000");
      return;
    }

    setLoading(true);
    const res = await createGeideaDeposit(numAmount, currency, lang);
    if (res.success && res.data) {
      let { deposit_id, trx, payment_url } = res.data;
      
      // Override domain for local testing
      if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        try {
          const url = new URL(payment_url);
          url.protocol = window.location.protocol;
          url.host = window.location.host;
          payment_url = url.toString();
        } catch(e) {}
      }

      setActiveDeposit({ id: deposit_id, trx });
      
      // Open the payment page in a new window AFTER we get the URL
      window.open(payment_url, "_blank");
      
      // Start polling immediately in this original window
      startPolling(deposit_id);
      
    } else {
      setError(res.message || (isRTL ? "حدث خطأ، حاول مرة أخرى" : "An error occurred, please try again"));
    }
    setLoading(false);
  };

  const handleInstapaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) { setError(isRTL ? "برجاء إدخال الاسم" : "Please enter your name"); return; }
    if (!phone.trim()) { setError(isRTL ? "برجاء إدخال رقم الهاتف" : "Please enter your phone number"); return; }
    if (!amount || Number(amount) < 50) { setError(isRTL ? "المبلغ يجب أن يكون 50 جنيهاً على الأقل" : "Amount must be at least 50 EGP"); return; }
    if (!receiptFile) { setError(tr.noReceipt); return; }

    setLoading(true);
    const body = new FormData();
    body.append("payment_method", "instapay");
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
    } else {
      setError(res.message || (isRTL ? "حدث خطأ" : "Error processing deposit"));
    }
    setLoading(false);
  };

  const resetGeideaDeposit = () => {
    setActiveDeposit(null);
    setDepositResult(null);
    setAmount("");
    pollingRef.current = false;
  };

  const tr = {
    title: isRTL ? "إيداع " : "Deposit ",
    subtitle: isRTL ? "أضف رصيد إلى محفظتك" : "Add funds to your wallet",
    cashBalance: isRTL ? "الرصيد الحالي" : "Current Balance",
    currency: "EGP",
    amount: isRTL ? "المبلغ" : "Amount",
    currencyLabel: isRTL ? "العملة" : "Currency",
    submitGeidea: isRTL ? "إيداع الآن" : "Deposit Now",
    submitInstapay: isRTL ? "تأكيد الإيداع" : "Confirm Deposit",
    submitting: isRTL ? "جارٍ الإنشاء..." : "Creating...",
    sending: isRTL ? "جارٍ الإرسال..." : "Sending...",
    back: isRTL ? "العودة" : "Back",
    receipt: isRTL ? "صورة الإيصال" : "Receipt image",
    uploadReceipt: isRTL ? "ارفع صورة الإيصال" : "Upload receipt image",
    pendingDesc: isRTL ? "سيتم مراجعة الإيصال وإضافة الرصيد خلال أقل من يوم" : "Your receipt will be reviewed and funds added in less than a day",
    noReceipt: isRTL ? "برجاء رفع الإيصال" : "Please upload receipt",
    name: isRTL ? "الاسم" : "Name",
    phone: isRTL ? "رقم الهاتف" : "Phone number",
    waitingPayment: isRTL ? "في انتظار تأكيد الدفع..." : "Waiting for payment confirmation...",
    successTitle: isRTL ? "تم الإيداع بنجاح!" : "Deposit Successful!",
    successDesc: isRTL ? "تم إضافة الرصيد إلى محفظتك" : "Funds have been added to your wallet",
    failedTitle: isRTL ? "فشل الدفع" : "Payment Failed",
    failedDesc: isRTL ? "لم يتم الدفع، حاول مرة أخرى" : "Payment was not completed, please try again",
    cancelledTitle: isRTL ? "تم إلغاء الدفع" : "Payment Cancelled",
    cancelledDesc: isRTL ? "تم إلغاء عملية الدفع" : "Payment was cancelled",
    expiredTitle: isRTL ? "انتهت صلاحية الرابط" : "Link Expired",
    expiredDesc: isRTL ? "انتهت صلاحية رابط الدفع، ابدأ إيداع جديد" : "Payment link expired, please start a new deposit",
    timeoutTitle: isRTL ? "لا يزال معلقاً" : "Still Pending",
    timeoutDesc: isRTL ? "لم يتم التأكيد بعد — راجع سجل الإيداعات لاحقاً" : "Not confirmed yet — check deposit history later",
    tryAgain: isRTL ? "حاول مرة أخرى" : "Try Again",
    newDeposit: isRTL ? "إيداع جديد" : "New Deposit",
    ok: isRTL ? "حسناً" : "OK",
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

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
              <span className={`${(loadingWallet ? "..." : showBalance ? cash.toLocaleString() : "••••••").length > 8 ? "text-[22px] sm:text-[32px] md:text-[40px]" : "text-[32px] sm:text-[40px]"} font-extrabold text-white leading-none break-all`}>
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

      {/* InstaPay Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-[#f0f0f0] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-50 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "تم الإرسال بنجاح" : "Submitted Successfully"}</h3>
            <p className="text-[14px] text-[#888] font-medium mb-8 leading-relaxed">{success}</p>
            <button onClick={() => setSuccess("")} className="w-full py-3.5 rounded-xl font-bold text-[14px] transition-all bg-[#1a1a1a] text-white hover:bg-[#333]">
              {isRTL ? "حسناً" : "OK"}
            </button>
          </div>
        </div>
      )}



      {/* Geidea Payment Status — non-blocking bottom toast */}
      {/* Geidea result toast — appears only when polling has a final result */}
      {depositResult && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border overflow-hidden ${
            depositResult === "paid" ? "border-emerald-200" :
            depositResult === "failed" || depositResult === "cancelled" ? "border-red-200" :
            "border-amber-200"
          }`}>
            {/* colour strip */}
            <div className={`h-1 w-full ${
              depositResult === "paid" ? "bg-emerald-400" :
              depositResult === "failed" || depositResult === "cancelled" ? "bg-red-400" :
              "bg-amber-400"
            }`} />

            <div className="p-4 flex items-start gap-3">
              {/* icon */}
              <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                depositResult === "paid" ? "bg-emerald-50 text-emerald-500" :
                depositResult === "failed" || depositResult === "cancelled" ? "bg-red-50 text-red-500" :
                "bg-amber-50 text-amber-500"
              }`}>
                {depositResult === "paid" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
                {(depositResult === "failed" || depositResult === "cancelled") && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                )}
                {(depositResult === "expired" || depositResult === "timeout") && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                )}
              </div>

              {/* text */}
              <div className="flex-1 min-w-0" dir="rtl">
                <p className="text-[14px] font-extrabold text-[#1a1a1a] leading-snug">
                  {depositResult === "paid" && tr.successTitle}
                  {depositResult === "failed" && tr.failedTitle}
                  {depositResult === "cancelled" && tr.cancelledTitle}
                  {depositResult === "expired" && tr.expiredTitle}
                  {depositResult === "timeout" && tr.timeoutTitle}
                </p>
                <p className="text-[12px] text-[#888] mt-0.5 leading-snug truncate">
                  {depositResult === "paid" && tr.successDesc}
                  {depositResult === "failed" && tr.failedDesc}
                  {depositResult === "cancelled" && tr.cancelledDesc}
                  {depositResult === "expired" && tr.expiredDesc}
                  {depositResult === "timeout" && tr.timeoutDesc}
                </p>
              </div>

              {/* action / dismiss */}
              <div className="shrink-0 flex items-center gap-2">
                {depositResult !== "paid" && depositResult !== "timeout" && (
                  <button
                    onClick={resetGeideaDeposit}
                    className="text-[12px] font-bold text-[#1a1a1a] bg-[#f5f5f5] hover:bg-[#eee] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {depositResult === "expired" ? tr.newDeposit : tr.tryAgain}
                  </button>
                )}
                {depositResult === "paid" && (
                  <button
                    onClick={resetGeideaDeposit}
                    className="text-[12px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {tr.ok}
                  </button>
                )}
                <button
                  onClick={resetGeideaDeposit}
                  className="w-7 h-7 rounded-full bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center text-[#888] transition-colors"
                  aria-label="dismiss"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 max-w-lg">
        {METHODS.filter(m => !(m as any).hidden).map(m => (
          <button 
            key={m.id} 
            onClick={() => { setError(""); setSuccess(""); setAmount(""); setMethod(m.id); }}
            className={`px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200 flex-1 flex items-center justify-center gap-3 border ${
              method === m.id 
                ? "bg-[#f5f5f5] text-[#1a1a1a] border-[#e0e0e0] shadow-sm" 
                : "bg-white text-[#888] border-[#f0f0f0] hover:border-[#e0e0e0] hover:bg-[#fafafa]"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.bg}`}>
              {m.icon}
            </div>
            <span>{isRTL ? m.nameAr : m.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod?.bg}`}>
            {selectedMethod?.icon}
          </div>
          <div>
            <p className="text-[16px] font-bold text-[#1a1a1a]">{isRTL ? selectedMethod?.nameAr : selectedMethod?.name}</p>
            <p className="text-[13px] text-[#888] mt-0.5">{isRTL ? selectedMethod?.descAr : selectedMethod?.desc}</p>
          </div>
        </div>

          {method === "geidea" && (
            <form className="flex flex-col gap-5" onSubmit={handleGeideaSubmit}>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.amount} ({currency})</label>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{isRTL ? "حد أقصى 100,000" : "Max 100,000"}</span>
                </div>
                <div className={inputCls}>
                  <input type="number" value={amount} onChange={e => { const val = e.target.value; if (Number(val) > 100000) setAmount("100000"); else setAmount(val); }}
                    placeholder={isRTL ? `أدخل المبلغ (من أول 50 ${currency === 'EGP' ? 'جنيه' : 'دولار'})` : `Enter amount (min 50 ${currency})`}
                    className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium"
                    dir="ltr" min="50" max="100000" required />
                  <span className="text-[13px] font-bold text-[#C9A84C]">{currency}</span>
                </div>
                <p className="text-[11px] text-[#888] font-medium mt-0.5">
                  {isRTL ? "لإيداع مبلغ أكبر من 100,000، يمكنك إجراء أكثر من معاملة متتالية." : "To deposit more than 100,000, you can make multiple consecutive transactions."}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(currency === "EGP" ? [1000, 5000, 10000, 20000] : [100, 500, 1000, 5000, 10000]).map(v => (
                  <button key={v} type="button" onClick={() => setAmount(String(v))}
                    className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all border ${amount === String(v) ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30" : "bg-[#f7f7f7] text-[#888] border-transparent hover:bg-[#f0f0f0]"}`}>
                    {v.toLocaleString("en-US")} {currency}
                  </button>
                ))}
              </div>

              {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60 mt-2"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
                {loading ? tr.submitting : tr.submitGeidea}
              </button>
              
              <p className="text-[12px] text-[#bbb] text-center leading-relaxed">
                {isRTL ? "سيتم فتح بوابة الدفع Geidea لإتمام عملية الدفع بشكل آمن" : "Geidea secure payment gateway will open to complete your payment"}
              </p>
            </form>
          )}

          {method === "instapay" && (
            <form className="flex flex-col gap-5" onSubmit={handleInstapaySubmit}>
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
                    placeholder={isRTL ? "أدخل المبلغ (من أول 50 جنيه)" : "Enter amount (min 50 EGP)"}
                    className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium"
                    dir="ltr" required min="50" />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {[1000, 5000, 10000, 20000].map(v => (
                  <button key={v} type="button" onClick={() => setAmount(String(v))}
                    className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all border ${amount === String(v) ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30" : "bg-[#f7f7f7] text-[#888] border-transparent hover:bg-[#f0f0f0]"}`}>
                    {v.toLocaleString("en-US")} EGP
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#888]">{tr.receipt}</label>
                <label className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-[#eee] rounded-2xl cursor-pointer hover:border-[#C9A84C]/40 transition-colors bg-[#fafafa]">
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
                className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-60 mt-2"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
                {loading ? tr.sending : tr.submitInstapay}
              </button>
            </form>
          )}
        </div>
    </div>
  );
}

