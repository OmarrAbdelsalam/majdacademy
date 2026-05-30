"use client";
import { useState, useEffect, Suspense } from "react";
import { useLang } from "../../../i18n/LangContext";
import { getTransactions, getTransactionDetails } from "../../../../lib/api";
import { useSearchParams } from "next/navigation";

const TYPES = ["deposit", "order"] as const;

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <TransactionsContent />
    </Suspense>
  );
}

function TransactionsContent() {
  const { isRTL, lang } = useLang();
  const searchParams = useSearchParams();
  const initialFilter = searchParams?.get("filter") === "order" ? "order" : "deposit";
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  const tr = {
    title: isRTL ? "المعاملات" : "Transactions",
    subtitle: isRTL ? "سجل جميع عملياتك المالية" : "History of all your financial operations",
    all: isRTL ? "الكل" : "All",
    deposit: isRTL ? "إيداع" : "Deposit",
    withdraw: isRTL ? "سحب" : "Withdraw",
    gold: isRTL ? "ذهب" : "Gold",
    silver: isRTL ? "فضة" : "Silver",
    order: isRTL ? "طلبات" : "Orders",
    loadMore: isRTL ? "تحميل المزيد" : "Load more",
    empty: isRTL ? "لا توجد معاملات بعد" : "No transactions yet",
    emptyDesc: isRTL ? "ستظهر معاملاتك هنا عند إجراء أي عملية" : "Your transactions will appear here once you make any operation",
  };

  const filterLabels: Record<string, string> = { deposit: tr.deposit, order: tr.order };

  // Hide sell orders and any transaction containing "partial" products
  const shouldHide = (tx: any) => {
    if (tx.type === "sell") return true;
    if (!tx.products || !Array.isArray(tx.products) || tx.products.length === 0) return false;
    return tx.products.every((p: any) =>
      (p.product_name || "").toLowerCase().includes("partial")
    );
  };

  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txDetails, setTxDetails] = useState<any | null>(null);

  // Background-sync real statuses from detail API (list API returns inaccurate status)
  const syncRealStatuses = async (txList: any[]) => {
    const orderTxs = txList.filter((tx: any) => tx.id?.startsWith("O-"));
    if (orderTxs.length === 0) return;
    const results = await Promise.allSettled(
      orderTxs.map((tx: any) => getTransactionDetails(tx.id, lang))
    );
    setTransactions(prev =>
      prev.map(tx => {
        const idx = orderTxs.findIndex((o: any) => o.id === tx.id);
        if (idx === -1) return tx;
        const result = results[idx];
        if (result.status === "fulfilled" && result.value.success && result.value.data?.status) {
          return { ...tx, status: result.value.data.status };
        }
        return tx;
      })
    );
  };

  useEffect(() => {
    setLoading(true);
    getTransactions(1, activeFilter, lang).then(res => {
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
      const filtered = raw.filter((tx: any) => !shouldHide(tx));
      setTransactions(filtered);
      setHasMore(res.data?.hasMore || false);
      setPage(1);
      setLoading(false);
      // Fetch real statuses in background
      syncRealStatuses(filtered);
    });
  }, [activeFilter, lang]);

  const loadMore = () => {
    const nextPage = page + 1;
    getTransactions(nextPage, activeFilter, lang).then(res => {
      const raw = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
      const filtered = raw.filter((tx: any) => !shouldHide(tx));
      setTransactions(prev => [...prev, ...filtered]);
      setHasMore(res.data?.hasMore || false);
      setPage(nextPage);
      syncRealStatuses(filtered);
    });
  };

  const handleRowClick = async (id: string) => {
    setSelectedTx(id);
    setTxDetails(null);
    const res = await getTransactionDetails(id, lang);
    if (res.success && res.data) {
      setTxDetails(res.data);
      // Sync real status back into the list (list API sometimes returns inaccurate status)
      if (res.data.status) {
        setTransactions(prev =>
          prev.map(tx => tx.id === id ? { ...tx, status: res.data.status } : tx)
        );
      }
    } else {
      setSelectedTx(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
        <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {TYPES.map(type => (
          <button key={type} onClick={() => setActiveFilter(type)} className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === type ? "bg-[#1a1a1a] text-white shadow-md" : "bg-white text-[#888] border border-[#f0f0f0] hover:border-[#ddd]"}`}>
            {filterLabels[type]}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-12 text-center animate-pulse">
           <div className="w-20 h-20 rounded-3xl bg-[#f7f7f7] mx-auto mb-5" />
           <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#f7f7f7] flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
          </div>
          <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">{tr.empty}</p>
          <p className="text-[13px] text-[#999]">{tr.emptyDesc}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {transactions.map((tx: any) => {
              const isPlus = tx.operation === "+";
              const statusLower = (tx.status || "").toLowerCase();
              const statusColor =
                statusLower === "cancel" || statusLower === "canceled" || statusLower === "cancelled" || statusLower === "ملغي"
                  ? "text-red-500"
                  : statusLower === "مكتمل" || statusLower === "completed" || statusLower === "success"
                  ? "text-emerald-600"
                  : "text-orange-500";

              return (
                <div key={tx.id} onClick={() => handleRowClick(tx.id)} className="bg-white p-4 rounded-xl border border-[#f0f0f0] hover:border-[#E9C237]/40 cursor-pointer flex justify-between items-center shadow-sm gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPlus ? "bg-emerald-50" : "bg-red-50"}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isPlus ? "#10B981" : "#EF4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={isPlus ? "M12 5v14m-7-7l7 7 7-7" : "M12 19V5m-7 7l7-7 7 7"} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-[#1a1a1a] truncate">{tx.title}</p>
                    <p className="text-[12px] text-[#aaa]">{tx.sub_title} · {tx.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-extrabold text-[15px] ${isPlus ? "text-emerald-600" : "text-[#1a1a1a]"}`}>
                      {tx.operation}{Number(tx.total).toLocaleString()} EGP
                    </p>
                    <p className={`text-[11px] font-semibold ${statusColor}`}>{tx.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMore && (
            <div className="mt-6 text-center">
              <button onClick={loadMore} className="px-8 py-3 rounded-xl text-[13px] font-semibold text-[#888] bg-white border border-[#f0f0f0] hover:border-[#ddd] transition-all">{tr.loadMore}</button>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {/* Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => {setSelectedTx(null); setTxDetails(null);}}>
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full m-4" onClick={e => e.stopPropagation()}>
            {!txDetails ? (
               <div className="flex justify-center items-center h-32">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A84C]"></div>
               </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-4 text-center text-[#1a1a1a]">{txDetails.title}</h3>
                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between"><span className="text-[#888]">{isRTL ? "رقم العملية" : "ID"}:</span> <span className="font-semibold text-[#1a1a1a]">{txDetails.id}</span></div>
                  <div className="flex justify-between"><span className="text-[#888]">{isRTL ? "النوع" : "Type"}:</span> <span className="font-semibold text-[#1a1a1a]">{txDetails.sub_title || txDetails.orderType || txDetails.title}</span></div>
                  <div className="flex justify-between"><span className="text-[#888]">{isRTL ? "المبلغ" : "Amount"}:</span> <span className="font-semibold text-[#1a1a1a]">{txDetails.operation || ""}{Number(txDetails.total).toLocaleString()} EGP</span></div>
                  <div className="flex justify-between"><span className="text-[#888]">{isRTL ? "الحالة" : "Status"}:</span> <span className="font-semibold text-[#1a1a1a]">{txDetails.status}</span></div>
                  <div className="flex justify-between"><span className="text-[#888]">{isRTL ? "التاريخ" : "Date"}:</span> <span className="font-semibold text-[#1a1a1a]">{txDetails.date}</span></div>
                  {txDetails.weight && <div className="flex justify-between"><span className="text-[#888]">{isRTL ? "الوزن" : "Weight"}:</span> <span className="font-semibold text-[#1a1a1a]">{txDetails.weight} {isRTL ? "جم" : "g"}</span></div>}
                </div>
                <button onClick={() => {setSelectedTx(null); setTxDetails(null);}} className="w-full mt-6 py-3 bg-[#f5f5f5] text-[#1a1a1a] rounded-xl font-bold">{isRTL ? "إغلاق" : "Close"}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
