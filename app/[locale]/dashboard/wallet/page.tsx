"use client";
import { useLang } from "../../../i18n/LangContext";
import { useEffect, useState } from "react";
import { getWallet, getTransactions } from "../../../../lib/api";
import Link from "next/link";

export default function WalletPage() {
  const { isRTL, lang } = useLang();

  const tr = {
    title: isRTL ? "المحفظة" : "Wallet",
    subtitle: isRTL ? "رصيدك الحالي" : "Your current balance",
    cash: isRTL ? "الرصيد النقدي" : "Cash Balance",
    gold: isRTL ? "رصيد الذهب" : "Gold Balance",
    silver: isRTL ? "رصيد الفضة" : "Silver Balance",
    currency: "EGP",
    grams: isRTL ? "جم" : "g",
    quickActions: isRTL ? "إجراءات سريعة" : "Quick Actions",
    deposit: isRTL ? "إيداع" : "Deposit",
    withdraw: isRTL ? "سحب" : "Withdraw",
    buyGold: isRTL ? "شراء ذهب" : "Buy Gold",
    recentTx: isRTL ? "آخر المعاملات" : "Recent Transactions",
    noTx: isRTL ? "لا توجد معاملات بعد" : "No transactions yet",
  };

  const [cash, setCash] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    getWallet(lang).then(res => {
      if (res.success && res.data) {
        setCash(Number(res.data.cash) || 0);
        setGold(Number(res.data.gold) || 0);
        setSilver(Number(res.data.silver) || 0);
      }
      setLoading(false);
    });
    getTransactions(1, "deposit", lang).then(res => {
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
      // Hide orders that contain only Partial Gold — show only bullion (bars/coins)
      const filtered = raw.filter((tx: any) => {
        if (!tx.products || !Array.isArray(tx.products) || tx.products.length === 0) return true;
        return !tx.products.every((p: any) =>
          (p.product_name || "").toLowerCase().includes("partial gold")
        );
      });
      setTransactions(filtered);
      setLoadingTx(false);
    });
  }, [lang]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
        <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
      </div>

      {/* Cash Balance Card */}
      <div className="rounded-3xl p-8 mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[13px] text-white/50 font-semibold uppercase tracking-[0.15em]">{tr.cash}</p>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/50 hover:text-white transition-colors">
                {showBalance ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </button>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[48px] sm:text-[56px] font-extrabold text-white leading-none">
                {loading ? "..." : showBalance ? cash.toLocaleString() : "••••••"}
              </span>
              <span className="text-[18px] font-bold text-[#C9A84C]">{tr.currency}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
            </div>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8"><path d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 14a1 1 0 100 2 1 1 0 000-2z"/></svg>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-[16px] font-bold text-[#1a1a1a] mb-4">{tr.recentTx}</h2>
        {loadingTx ? (
          <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 text-center text-[#999] text-[14px]">
            {isRTL ? "جارٍ التحميل..." : "Loading..."}
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f7f7f7] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
            </div>
            <p className="text-[14px] text-[#999]">{tr.noTx}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.slice(0, 5).map(tx => {
              const isPlus = tx.operation === "+";
              const statusLower = (tx.status || "").toLowerCase();
              const statusColor = statusLower === "cancel" || statusLower === "cancelled" || statusLower === "ملغي"
                ? "bg-red-50 text-red-500"
                : statusLower === "مكتمل" || statusLower === "completed"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600";

              return (
                <div key={tx.id} className="bg-white rounded-2xl border border-[#f0f0f0] p-4 flex items-center gap-3 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPlus ? "bg-emerald-50" : "bg-red-50"}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isPlus ? "#10B981" : "#EF4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={isPlus ? "M12 5v14m-7-7l7 7 7-7" : "M12 19V5m-7 7l7-7 7 7"} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1a1a1a] truncate">{tx.title}</p>
                    <p className="text-[11px] text-[#aaa]">{tx.date}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className={`text-[14px] font-extrabold ${isPlus ? "text-emerald-600" : "text-[#1a1a1a]"}`}>
                      {tx.operation}{Number(tx.total).toLocaleString()} EGP
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${statusColor}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
            <Link href={`/${lang}/dashboard/transactions`} className="text-center text-[13px] font-bold text-[#C9A84C] mt-1 hover:underline">
              {isRTL ? "عرض كل المعاملات" : "View all transactions"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
