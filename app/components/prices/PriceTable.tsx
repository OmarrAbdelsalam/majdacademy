"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import { getCurrentPrices } from "../../../lib/api";

interface PriceData {
  sell_24?: number;
  buy_24?: number;
  sell_change_24?: number;
  buy_change_24?: number;
  sell_22?: number;
  buy_22?: number;
  sell_change_22?: number;
  buy_change_22?: number;
  sell_21?: number;
  buy_21?: number;
  sell_change_21?: number;
  buy_change_21?: number;
  sell_18?: number;
  buy_18?: number;
  sell_change_18?: number;
  buy_change_18?: number;
  sell_14?: number;
  buy_14?: number;
  sell_change_14?: number;
  buy_change_14?: number;
  ounce?: number;
  buy_ounce?: number;
  sell_ounce?: number;
  ounce_change?: number;
  dollar?: number;
  buy_dollar?: number;
  sell_dollar?: number;
  dollar_change?: number;
  pound?: number;
  buy_pound?: number;
  sell_pound?: number;
  pound_change?: number;
  screen?: number;
  service_price?: number;
  silver_buy?: number;
  silver_sell?: number;
  silver_change?: number;
  silver_swiss_buy?: number;
  silver_swiss_sell?: number;
  silver_swiss_change?: number;
  silver_egypt_buy?: number;
  silver_egypt_sell?: number;
  silver_egypt_change?: number;
  silver_925_buy?: number;
  silver_925_sell?: number;
  silver_925_change?: number;
  silver_800_buy?: number;
  silver_800_sell?: number;
  silver_800_change?: number;
  silver_ounce_buy?: number;
  silver_ounce_sell?: number;
  silver_ounce_change?: number;
}

type Tab = "gold" | "silver";

const fmt = (p: number | undefined) =>
  p != null ? p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

function ChangeIndicator({ value }: { value?: number }) {
  if (value === undefined) return <span className="text-[12px] text-[#ccc]">—</span>;
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f5f5] text-[12px] font-bold text-[#999]">
        — {value}%
      </span>
    );
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold ${
        up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  );
}

const RenderIcon = ({ type }: { type: string }) => {
  const isGold = type.includes("gold");
  const isSilver = type.includes("silver");
  const isDollar = type === "dollar";

  const iconColor = isGold ? "#8A6B1C" : isSilver ? "#606060" : isDollar ? "#2D8A4E" : "#8A6B1C";
  const bgClass = isGold
    ? "bg-gradient-to-br from-[#C9A84C] to-[#F5E6A3]"
    : isSilver
    ? "bg-gradient-to-br from-[#C0C0C0] to-[#E8E8E8]"
    : isDollar
    ? "bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]"
    : "bg-gradient-to-br from-[#C9A84C] to-[#F5E6A3]";

  return (
    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] border border-[#ffffff60] ${bgClass}`}>
      {type === "gold-bar" || type === "silver-bar" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 4 4 8 12 12 20 8 12 4" fill="rgba(255,255,255,0.4)" />
          <polyline points="4 14 12 18 20 14" />
          <polyline points="4 8 4 14" />
          <polyline points="20 8 20 14" />
          <polyline points="12 12 12 18" />
        </svg>
      ) : type === "gold-coin" || type === "silver-coin" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.3)" />
          <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
          <path d="M12 9v6" />
        </svg>
      ) : type === "dollar" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(255,255,255,0.5)" />
          <path d="M12 8v8" />
          <path d="M10 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2 .9-2 2 .9 2 2 2 2-.9 2-2" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18" />
          <path d="M4 8h16" />
          <path d="M5 8l-2 5a2 2 0 0 0 4 0l-2-5" fill="rgba(255,255,255,0.4)" />
          <path d="M19 8l-2 5a2 2 0 0 0 4 0l-2-5" fill="rgba(255,255,255,0.4)" />
          <path d="M9 21h6" />
        </svg>
      )}
    </div>
  );
};

export default function PriceTable() {
  const { isRTL, lang } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("gold");
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchPrices = useCallback(async () => {
    try {
      const res = await getCurrentPrices(lang);
      if ("success" in res && res.success === false) {
        setStale(true);
        return;
      }
      const data = (res as any).prices || (res as any).data || {};
      setPrices(data);
      setStale(false);
      setLastUpdate(
        new Date().toLocaleTimeString(isRTL ? "ar-EG" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch {
      setStale(true);
    } finally {
      setLoading(false);
    }
  }, [lang, isRTL]);

  useEffect(() => {
    fetchPrices();
    const iv = setInterval(fetchPrices, 30_000);
    return () => clearInterval(iv);
  }, [fetchPrices]);

  /* ── tabs ── */
  const tabs: { id: Tab; ar: string; en: string }[] = [
    { id: "gold", ar: "أسعار الذهب", en: "Gold Prices" },
    { id: "silver", ar: "أسعار الفضة", en: "Silver Prices" },
  ];

  /* ── rows ── */
  const goldRows = [
    { label: isRTL ? "جرام عيار 24" : "24 Karat", icon: "gold-bar", buy: prices?.buy_24, sell: prices?.sell_24, change: prices?.buy_change_24 || prices?.sell_change_24, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "جرام عيار 22" : "22 Karat", icon: "gold-bar", buy: prices?.buy_22, sell: prices?.sell_22, change: prices?.buy_change_22 || prices?.sell_change_22, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "جرام عيار 21" : "21 Karat", icon: "gold-bar", buy: prices?.buy_21, sell: prices?.sell_21, change: prices?.buy_change_21 || prices?.sell_change_21, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "جرام عيار 18" : "18 Karat", icon: "gold-bar", buy: prices?.buy_18, sell: prices?.sell_18, change: prices?.buy_change_18 || prices?.sell_change_18, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "جرام عيار 14" : "14 Karat", icon: "gold-bar", buy: prices?.buy_14, sell: prices?.sell_14, change: prices?.buy_change_14 || prices?.sell_change_14, unit: isRTL ? "ج.م" : "EGP" },
  ];

  const silverRows = [
    { label: isRTL ? "999 سويسري" : "999 Swiss", icon: "silver-bar", buy: prices?.silver_swiss_buy || prices?.silver_buy, sell: prices?.silver_swiss_sell || prices?.silver_sell, change: prices?.silver_swiss_change || prices?.silver_change, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "999 مصري" : "999 Egyptian", icon: "silver-bar", buy: prices?.silver_egypt_buy, sell: prices?.silver_egypt_sell, change: prices?.silver_egypt_change, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "عيار 925" : "925 Karat", icon: "silver-bar", buy: prices?.silver_925_buy, sell: prices?.silver_925_sell, change: prices?.silver_925_change, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "عيار 800" : "800 Karat", icon: "silver-bar", buy: prices?.silver_800_buy, sell: prices?.silver_800_sell, change: prices?.silver_800_change, unit: isRTL ? "ج.م" : "EGP" },
    { label: isRTL ? "الاونصة" : "Ounce", icon: "ounce-silver", buy: prices?.silver_ounce_buy, sell: prices?.silver_ounce_sell, change: prices?.silver_ounce_change, unit: isRTL ? "ج.م" : "EGP" },
  ];

  const rows = activeTab === "gold" ? goldRows : silverRows;

  /* ── market metrics ── */
  const metrics = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D8A4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(45,138,78,0.1)"/><path d="M12 8v8"/><path d="M10 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2 .9-2 2 .9 2 2 2 2-.9 2-2"/></svg>, label: isRTL ? "سعر الدولار في الصاغة" : "Dollar (Gold Market)", value: prices?.dollar, unit: isRTL ? "ج.م" : "EGP" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A6B1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M4 8h16"/><path d="M5 8l-2 5a2 2 0 0 0 4 0l-2-5" fill="rgba(138,107,28,0.1)"/><path d="M19 8l-2 5a2 2 0 0 0 4 0l-2-5" fill="rgba(138,107,28,0.1)"/><path d="M9 21h6"/></svg>, label: isRTL ? "سعر الأوقية" : "Gold Ounce", value: prices?.ounce, unit: isRTL ? "ج.م" : "EGP" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A6B1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" fill="rgba(138,107,28,0.1)"/><circle cx="12" cy="12" r="5" strokeDasharray="2 2"/><path d="M12 9v6"/></svg>, label: isRTL ? "الجنيه الذهب" : "Gold Pound", value: prices?.pound, unit: isRTL ? "ج.م" : "EGP" },
  ];
  return (
    <div className="w-full space-y-6" dir={isRTL ? "rtl" : "ltr"}>

      {/* ─── Tabs ─── */}
      <div className="flex items-center justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-8 py-3 rounded-full text-[14px] font-bold transition-all duration-300 ${
              activeTab === t.id
                ? "bg-[#1a1a1a] text-white shadow-lg"
                : "text-[#777] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]"
            }`}
          >
            {isRTL ? t.ar : t.en}
          </button>
        ))}
      </div>

      {/* ─── Price Table ─── */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-[#eee] shadow-[0_12px_40px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Market Metrics — compact inline strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 sm:px-10 py-3.5 bg-[#FAFAF8] border-b border-[#f0f0f0]">
          {metrics.map((m, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[13px]">
              <span className="shrink-0">{m.icon}</span>
              <span className="text-[#999] font-semibold">{m.label}:</span>
              <span className="font-extrabold text-[#1a1a1a] tabular-nums" dir="ltr">{fmt(m.value)}</span>
              <span className="text-[#ccc] text-[11px]">{m.unit}</span>
              {i < metrics.length - 1 && <span className="text-[#e0e0e0] mx-1 hidden sm:inline">|</span>}
            </span>
          ))}
        </div>

        {/* Header */}
        <div className="grid grid-cols-4 gap-2 px-5 sm:px-10 py-4 sm:py-5 bg-[#FAFAF8] border-b border-[#f0f0f0]">
          <span className="text-[11px] sm:text-[12px] font-bold text-[#aaa] uppercase tracking-wider">
            {isRTL ? "العيار" : "Caliber"}
          </span>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#aaa] uppercase tracking-wider text-center">
            {isRTL ? "سعر الشراء" : "Buy Price"}
          </span>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#aaa] uppercase tracking-wider text-center">
            {isRTL ? "سعر البيع" : "Sell Price"}
          </span>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#aaa] uppercase tracking-wider text-end">
            {isRTL ? "التغيير" : "Change"}
          </span>
        </div>

        {/* Rows */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {loading ? (
              <div className="divide-y divide-[#f5f5f5]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 px-5 sm:px-10 py-6 sm:py-7">
                    <div className="h-6 bg-[#f3f3f3] rounded-lg w-20 animate-pulse" />
                    <div className="h-6 bg-[#f3f3f3] rounded-lg w-24 mx-auto animate-pulse" />
                    <div className="h-6 bg-[#f3f3f3] rounded-lg w-24 mx-auto animate-pulse" />
                    <div className="h-5 bg-[#f3f3f3] rounded-full w-16 ms-auto animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[#f5f5f5]">
                {rows.map((row, idx) => (
                  <motion.div
                    key={row.label}
                    className="grid grid-cols-4 gap-2 px-5 sm:px-10 py-6 sm:py-7 hover:bg-[#FDFCF8] transition-colors duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    {/* Caliber */}
                    <div className="flex items-center gap-3">
                      <RenderIcon type={row.icon} />
                      <span className="text-[15px] sm:text-[18px] font-bold text-[#1a1a1a]">
                        {row.label}
                      </span>
                    </div>

                    {/* Buy */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[17px] sm:text-[22px] font-extrabold text-[#1a1a1a] tabular-nums" dir="ltr">
                        {fmt(row.buy)}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#bbb] font-medium">{row.unit}</span>
                    </div>

                    {/* Sell */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[17px] sm:text-[22px] font-extrabold text-[#C9A84C] tabular-nums" dir="ltr">
                        {fmt(row.sell)}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#bbb] font-medium">{row.unit}</span>
                    </div>

                    {/* Change */}
                    <div className="flex items-center justify-end">
                      <ChangeIndicator value={row.change} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="px-5 sm:px-10 py-4 bg-[#FAFAF8] border-t border-[#f0f0f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-[12px] text-[#bbb] font-semibold">
                {isRTL ? "آخر تحديث:" : "Last update:"} {lastUpdate}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] text-[#999] font-bold">
              {isRTL ? "تحديث مباشر كل 30 ثانية" : "Live · updates every 30s"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
