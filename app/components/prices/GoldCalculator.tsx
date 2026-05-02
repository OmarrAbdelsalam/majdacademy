"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLang } from "../../i18n/LangContext";
import { getCurrentPrices } from "../../../lib/api";

interface PriceData {
  buy_24?: number;
  buy_21?: number;
  buy_18?: number;
  buy_14?: number;
  silver_buy?: number;
}

type Karat = "24" | "21" | "18" | "14" | "silver";

export default function GoldCalculator() {
  const { isRTL, lang } = useLang();
  const [weight, setWeight] = useState<string>("1");
  const [karat, setKarat] = useState<Karat>("24");
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [result, setResult] = useState<number>(0);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await getCurrentPrices(lang);
      if ("success" in res && res.success === false) return;
      const data = (res as any).prices || (res as any).data || {};
      setPrices(data);
    } catch {
      // silent
    }
  }, [lang]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    if (!prices || !weight) {
      setResult(0);
      return;
    }
    const w = parseFloat(weight) || 0;
    let pricePerGram = 0;
    if (karat === "24") pricePerGram = prices.buy_24 || 0;
    else if (karat === "21") pricePerGram = prices.buy_21 || 0;
    else if (karat === "18") pricePerGram = prices.buy_18 || 0;
    else if (karat === "14") pricePerGram = prices.buy_14 || 0;
    else pricePerGram = prices.silver_buy || 0;
    setResult(w * pricePerGram);
  }, [weight, karat, prices]);

  const karatOptions: { value: Karat; labelAr: string; labelEn: string }[] = [
    { value: "24", labelAr: "ذهب 24", labelEn: "Gold 24K" },
    { value: "21", labelAr: "ذهب 21", labelEn: "Gold 21K" },
    { value: "18", labelAr: "ذهب 18", labelEn: "Gold 18K" },
    { value: "14", labelAr: "ذهب 14", labelEn: "Gold 14K" },
    { value: "silver", labelAr: "فضة 999", labelEn: "Silver 999" },
  ];

  return (
    <section
      className="relative w-full bg-[#0A0A0A] py-20 md:py-28 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top gold glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[150px] sm:h-[200px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(212, 168, 42, 0.15), rgba(212, 168, 42, 0.05) 50%, transparent 100%)",
        }}
      ></div>

      {/* Side glows */}
      <div
        className="absolute top-10 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full blur-[60px] sm:blur-[80px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(212, 168, 42, 0.1), transparent 70%)",
        }}
      ></div>
      <div
        className="absolute top-10 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full blur-[60px] sm:blur-[80px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(212, 168, 42, 0.1), transparent 70%)",
        }}
      ></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[13px] sm:text-[14px] text-white/40 font-semibold mb-3 tracking-wide">
            {isRTL ? "احسب قيمة استثمارك" : "Calculate Your Investment"}
          </p>
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold text-white leading-tight tracking-tight">
            {isRTL ? (
              <>
                حاسبة{" "}
                <span className="gold-gradient-text">الذهب والفضة</span>
              </>
            ) : (
              <>
                <span className="gold-gradient-text">Gold &amp; Silver</span>{" "}
                Calculator
              </>
            )}
          </h2>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          className="bg-[#111111] rounded-[24px] sm:rounded-[28px] border border-[#1E1E1E] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {/* Karat Selection */}
          <div className="mb-6">
            <label className="block text-[12px] sm:text-[13px] text-white/40 font-bold uppercase tracking-wider mb-3">
              {isRTL ? "اختر العيار" : "Select Caliber"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {karatOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKarat(opt.value)}
                  className={`px-4 py-3 rounded-xl text-[13px] sm:text-[14px] font-bold transition-all duration-300 border ${
                    karat === opt.value
                      ? opt.value === "silver"
                        ? "bg-gradient-to-br from-[#C0C0C0] to-[#E8E8E8] text-[#333] border-[#C0C0C0]/30 shadow-[0_4px_16px_rgba(192,192,192,0.2)]"
                        : "bg-gradient-to-br from-[#C9A84C] to-[#F5E6A3] text-[#1a1a1a] border-[#C9A84C]/30 shadow-[0_4px_16px_rgba(201,168,76,0.2)]"
                      : "bg-[#1a1a1a] text-white/60 border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white/80"
                  }`}
                >
                  {isRTL ? opt.labelAr : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Input */}
          <div className="mb-8">
            <label className="block text-[12px] sm:text-[13px] text-white/40 font-bold uppercase tracking-wider mb-3">
              {isRTL ? "الوزن (جرام)" : "Weight (grams)"}
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="0.1"
                placeholder={isRTL ? "ادخل الوزن بالجرام" : "Enter weight in grams"}
                className="w-full bg-[#1a1a1a] text-white text-[18px] sm:text-[20px] font-bold px-5 py-4 rounded-xl border border-[#2a2a2a] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 outline-none transition-all duration-300 placeholder:text-white/20 tabular-nums"
                dir="ltr"
              />
              <span className="absolute top-1/2 -translate-y-1/2 end-5 text-[13px] text-white/30 font-semibold">
                {isRTL ? "جرام" : "grams"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1E1E1E] mb-8"></div>

          {/* Result */}
          <div className="text-center">
            <p className="text-[12px] sm:text-[13px] text-white/40 font-bold uppercase tracking-wider mb-3">
              {isRTL ? "القيمة التقديرية" : "Estimated Value"}
            </p>
            <div className="flex items-baseline justify-center gap-2" dir="ltr">
              <motion.span
                key={result}
                className="text-[36px] sm:text-[48px] md:text-[56px] font-extrabold gold-gradient-text tabular-nums leading-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {result.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </motion.span>
              <span className="text-[16px] sm:text-[20px] text-[#C9A84C] font-bold">
                {isRTL ? "ج.م" : "EGP"}
              </span>
            </div>
            <p className="text-[11px] sm:text-[12px] text-white/20 mt-3">
              {isRTL
                ? "* السعر تقديري ويعتمد على سعر الشراء الحالي"
                : "* Estimated based on current buy price"}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
