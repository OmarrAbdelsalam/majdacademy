"use client";
import { useEffect, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { getCurrentPrices } from "../../lib/api";

interface Prices {
  gold_buy: number;
  gold_sell: number;
  silver_buy: number;
  silver_sell: number;
  updated_at: string;
}

export default function GoldPrices() {
  const { isRTL, lang } = useLang();
  const [prices, setPrices] = useState<Prices | null>(null);
  const [stale, setStale] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await getCurrentPrices(lang);
      if (res.success && res.data) {
        setPrices(res.data);
        setStale(false);
      } else {
        setStale(true);
      }
      setLoading(false);
    };
    fetch();
    const interval = setInterval(fetch, 30_000);
    return () => clearInterval(interval);
  }, [lang]);

  const fmt = (n: number) => n?.toLocaleString("en-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows = prices ? [
    { label: isRTL ? "ذهب عيار 24 — شراء" : "Gold 24K — Buy",  value: fmt(prices.gold_buy),  color: "#C9A84C" },
    { label: isRTL ? "ذهب عيار 24 — بيع"  : "Gold 24K — Sell", value: fmt(prices.gold_sell), color: "#C9A84C" },
    { label: isRTL ? "فضة — شراء"          : "Silver — Buy",    value: fmt(prices.silver_buy),  color: "#9CA3AF" },
    { label: isRTL ? "فضة — بيع"           : "Silver — Sell",   value: fmt(prices.silver_sell), color: "#9CA3AF" },
  ] : [];

  return (
    <section className="max-w-2xl mx-auto px-4 py-16" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">
        {isRTL ? "الأسعار الحية" : "Live Prices"}
      </h1>
      <p className="text-sm text-[#999] mb-8">
        {isRTL ? "تتحدث كل 30 ثانية" : "Updates every 30 seconds"}
        {stale && <span className="text-amber-500 ms-2">{isRTL ? "⚠ قد تكون غير محدّثة" : "⚠ May be outdated"}</span>}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 rounded-2xl bg-[#f3f3f3] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between bg-white border border-[#f0f0f0] rounded-2xl px-6 py-4 shadow-sm">
              <span className="text-[15px] font-semibold text-[#444]">{row.label}</span>
              <span className="text-[18px] font-extrabold" style={{ color: row.color }}>
                {row.value} <span className="text-[13px] font-medium text-[#999]">EGP/g</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {prices?.updated_at && (
        <p className="text-xs text-[#bbb] mt-6 text-center">
          {isRTL ? "آخر تحديث:" : "Last updated:"} {new Date(prices.updated_at).toLocaleTimeString()}
        </p>
      )}
    </section>
  );
}
