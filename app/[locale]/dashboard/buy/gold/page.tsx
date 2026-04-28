"use client";
import { useState, useEffect } from "react";
import { useLang } from "../../../../i18n/LangContext";
import { getWallet, getCurrentPrices, buyGold } from "../../../../../lib/api";
import { useRouter } from "next/navigation";

const KARATS = [24, 21, 18] as const;

export default function BuyGoldPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [karat, setKarat] = useState<number>(24);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFundError, setShowFundError] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  const fetchData = async () => {
    const [walletRes, pricesRes] = await Promise.all([
      getWallet(lang),
      getCurrentPrices(lang)
    ]);
    if (walletRes.success && walletRes.data) {
      setAvailableBalance(Number(walletRes.data.balance) || 0);
    }
    if (pricesRes.success && pricesRes.data) {
      // Assuming pricesRes.data.gold_buy is 24K price, adjust for karat if necessary or just show gold_buy
      const price24k = pricesRes.data.gold_buy || 0;
      setCurrentPrice(price24k);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang]);

  const tr = {
    title: isRTL ? "شراء ذهب" : "Buy Gold",
    subtitle: isRTL ? "اشترِ ذهب بالجرام من رصيدك" : "Buy gold by gram from your balance",
    weight: isRTL ? "الوزن (جرام)" : "Weight (grams)",
    karat: isRTL ? "العيار" : "Karat",
    balance: isRTL ? "الرصيد المتاح" : "Available balance",
    submit: isRTL ? "شراء ذهب" : "Buy Gold",
    successMsg: isRTL ? "تمت عملية الشراء بنجاح" : "Purchase completed successfully",
    livePrice: isRTL ? "سعر الجرام الحالي" : "Current price per gram",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!weight || Number(weight) <= 0) {
      setError(isRTL ? "يرجى إدخال وزن صحيح" : "Please enter a valid weight");
      return;
    }
    
    // Proactive validation
    const estimatedCost = Number(weight) * ((currentPrice * karat) / 24);
    if (estimatedCost > availableBalance) {
      setShowFundError(true);
      return;
    }
    
    setLoading(true);
    const res = await buyGold({ weight, karats: karat }, lang);
    if (res.success) {
      setSuccess(res.message || tr.successMsg);
      setWeight("");
      fetchData();
    } else {
      if (res.message?.toLowerCase().includes("insufficient funds")) {
        setShowFundError(true);
      } else {
        setError(res.message || "Error submitting request");
      }
    }
    setLoading(false);
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
        <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
      </div>

      {/* Gold price card */}
      <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)' }}>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-white/70 uppercase tracking-wider mb-1">{tr.livePrice}</p>
            <p className="text-[32px] font-extrabold text-white leading-none">{currentPrice > 0 ? ((currentPrice * karat) / 24).toLocaleString(undefined, {maximumFractionDigits: 0}) : "..."} <span className="text-[16px]">EGP/g</span></p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 max-w-lg">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#f0f0f0]">
          <span className="text-[13px] font-semibold text-[#888]">{tr.balance}</span>
          <span className="text-[18px] font-extrabold text-[#1a1a1a]">{availableBalance.toLocaleString()} <span className="text-[#C9A84C] text-[14px]">EGP</span></span>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Weight */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#888]">{tr.weight}</label>
            <div className={inputCls}>
              <input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" dir="ltr" required min="0.01" />
            </div>
          </div>

          {/* Karat selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#888]">{tr.karat}</label>
            <div className="flex gap-3">
              {KARATS.map(k => (
                <button key={k} type="button" onClick={() => setKarat(k)} className={`flex-1 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${karat === k ? "bg-[#1a1a1a] text-white shadow-md" : "bg-[#F7F7F8] text-[#888] hover:bg-[#eee]"}`}>
                  {k}K
                </button>
              ))}
            </div>
          </div>

          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}
          {success && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[13px] font-medium">{success}</div>}

          <button type="submit" disabled={loading} className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(233,194,55,0.25)] hover:shadow-[0_6px_28px_rgba(233,194,55,0.35)] active:scale-[0.99]" style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 100%)', color: '#1a1a1a' }}>
            {tr.submit}
          </button>
        </form>
      </div>

      {/* Insufficient Funds Modal */}
      {showFundError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "الرصيد غير كافٍ" : "Insufficient Funds"}</h3>
              <p className="text-[14px] text-[#888] font-medium mb-8">
                {isRTL ? "عذراً، رصيدك الحالي لا يكفي لإتمام هذه المعاملة. يرجى إيداع مبلغ في المحفظة للمتابعة." : "Sorry, your current balance is insufficient to complete this transaction. Please deposit funds to continue."}
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => router.push(`/${lang}/dashboard/deposit`)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-white rounded-xl font-bold text-[15px] shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_6px_25px_rgba(201,168,76,0.4)] transition-all active:scale-[0.98]"
                >
                  {isRTL ? "إيداع الآن" : "Deposit Now"}
                </button>
                <button 
                  onClick={() => setShowFundError(false)}
                  className="w-full py-3.5 bg-[#f5f5f5] text-[#1a1a1a] rounded-xl font-bold text-[15px] hover:bg-[#eee] transition-all active:scale-[0.98]"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
