"use client";
import { useState, useEffect } from "react";
import { useLang } from "../../../i18n/LangContext";
import { getWallet, submitWithdraw } from "../../../../lib/api";

export default function WithdrawPage() {
  const { isRTL, lang } = useLang();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const fetchWallet = async () => {
    const res = await getWallet(lang);
    if (res.success && res.data) {
      setAvailableBalance(Number(res.data.balance) || 0);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [lang]);

  const tr = {
    title: isRTL ? "سحب" : "Withdraw",
    subtitle: isRTL ? "اسحب رصيدك النقدي" : "Withdraw your cash balance",
    amount: isRTL ? "المبلغ" : "Amount",
    balance: isRTL ? "الرصيد المتاح" : "Available balance",
    submit: isRTL ? "سحب" : "Withdraw",
    successMsg: isRTL ? "تم تقديم طلب السحب بنجاح" : "Withdrawal request submitted successfully",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (Number(amount) > availableBalance) {
      setError(isRTL ? "رصيدك لا يكفي" : "Insufficient balance");
      return;
    }
    setLoading(true);
    const res = await submitWithdraw({ amount }, lang);
    if (res.success) {
      setSuccess(res.message || tr.successMsg);
      setAmount("");
      fetchWallet();
    } else {
      setError(res.message || "Error submitting request");
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

      <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 max-w-lg">
        {/* Balance indicator */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#f0f0f0]">
          <span className="text-[13px] font-semibold text-[#888]">{tr.balance}</span>
          <span className="text-[18px] font-extrabold text-[#1a1a1a]">{availableBalance.toLocaleString()} <span className="text-[#C9A84C] text-[14px]">EGP</span></span>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#888]">{tr.amount} (EGP)</label>
            <div className={inputCls}>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" dir="ltr" required min="1" />
            </div>
          </div>

          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}
          {success && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[13px] font-medium">{success}</div>}

          <button type="submit" disabled={loading} className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99]" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
            {tr.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
