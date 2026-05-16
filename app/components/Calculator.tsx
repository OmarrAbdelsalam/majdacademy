"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "../i18n/LangContext";

export default function CalculatorSection() {
  const { tr, isRTL } = useLang();
  const h = tr.hero;

  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [mode, setMode] = useState<"buy" | "sell">("buy");

  const getPrice = (m: "gold" | "silver", md: "buy" | "sell") => {
    if (m === "gold") return md === "buy" ? 8268 : 8150;
    return md === "buy" ? 55 : 52;
  };
  const pricePerGram = getPrice(metal, mode);

  const [weight, setWeight] = useState<string>("10");
  const [budget, setBudget] = useState<string>((10 * pricePerGram).toString());

  const handleWeightChange = (val: string) => {
    setWeight(val);
    const num = Number(val);
    if (!isNaN(num) && val !== "") {
      setBudget((num * pricePerGram).toFixed(2).replace(/\.00$/, ''));
    } else {
      setBudget("");
    }
  };

  const handleBudgetChange = (val: string) => {
    setBudget(val);
    const num = Number(val);
    if (!isNaN(num) && val !== "") {
      setWeight((num / pricePerGram).toFixed(2).replace(/\.00$/, ''));
    } else {
      setWeight("");
    }
  };

  useEffect(() => {
    const numWeight = Number(weight);
    if (!isNaN(numWeight)) {
      setBudget((numWeight * pricePerGram).toFixed(2).replace(/\.00$/, ''));
    }
  }, [metal, mode, pricePerGram]);

  const totalValue = Number(budget) || 0;

  return (
    <section id="calculator" className="relative w-full bg-white py-20 md:py-32 overflow-hidden -mt-[1px]" dir={isRTL ? "rtl" : "ltr"}>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-6 sm:mb-14 md:mb-10 lg:mb-12">
          <motion.h2
            className="text-[28px] sm:text-[40px] md:text-6xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[#1a1a1a] mb-3 sm:mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isRTL ? "حاسبة" : "Price"}
            <span className="text-[#D4A82A]">{isRTL ? " الذهب والفضة." : " Calculator."}</span>
          </motion.h2>
          <motion.p
            className="text-[13px] sm:text-[15px] lg:text-[17px] text-[#888] leading-relaxed max-w-[520px] lg:max-w-[600px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {isRTL
              ? "اختار المعدن ونوع العملية، حط الوزن أو الميزانية والنتيجة هتطلعلك فوراً."
              : "Select your metal and operation type. Enter weight or budget and get instant results."}
          </motion.p>
        </div>

        {/* Calculator Card — Premium gold card like Foot */}
        <motion.div
          className="w-full bg-[#FFF3D0] rounded-[2rem] md:rounded-[2.5rem] px-5 sm:px-10 md:px-14 py-6 sm:py-10 md:py-14 border border-[#F0E2B4]/60 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {/* Inner subtle texture */}
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}></div>

          <div className="relative z-10 flex flex-col gap-5 sm:gap-8">

            {/* Toggle Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xl">

              {/* Metal Toggle */}
              <div className="flex bg-white/70 backdrop-blur-sm p-1 rounded-full border border-[#E8D5A0]/40 flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <button
                  onClick={() => setMetal("gold")}
                  className={`flex-1 py-2 sm:py-3 rounded-full text-[12px] sm:text-[13px] font-bold transition-all duration-300 ${
                    metal === "gold"
                      ? "bg-[#1a1a1a] text-white shadow-md"
                      : "text-[#8a7a4a] hover:text-[#555]"
                  }`}
                >
                  {isRTL ? "ذهب 24" : "Gold 24K"}
                </button>
                <button
                  onClick={() => setMetal("silver")}
                  className={`flex-1 py-2 sm:py-3 rounded-full text-[12px] sm:text-[13px] font-bold transition-all duration-300 ${
                    metal === "silver"
                      ? "bg-[#1a1a1a] text-white shadow-md"
                      : "text-[#8a7a4a] hover:text-[#555]"
                  }`}
                >
                  {isRTL ? "فضة 999" : "Silver 999"}
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-white/70 backdrop-blur-sm p-1 rounded-full border border-[#E8D5A0]/40 flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <button
                  onClick={() => setMode("buy")}
                  className={`flex-1 py-2 sm:py-3 rounded-full text-[12px] sm:text-[13px] font-bold transition-all duration-300 ${
                    mode === "buy"
                      ? "bg-[#1a1a1a] text-white shadow-md"
                      : "text-[#8a7a4a] hover:text-[#555]"
                  }`}
                >
                  {isRTL ? "شراء" : "Buy"}
                </button>
                <button
                  onClick={() => setMode("sell")}
                  className={`flex-1 py-2 sm:py-3 rounded-full text-[12px] sm:text-[13px] font-bold transition-all duration-300 ${
                    mode === "sell"
                      ? "bg-[#1a1a1a] text-white shadow-md"
                      : "text-[#8a7a4a] hover:text-[#555]"
                  }`}
                >
                  {isRTL ? "بيع" : "Sell"}
                </button>
              </div>
            </div>

            {/* Live price indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#8a7a4a] font-medium">
                {isRTL ? "سعر الجرام:" : "Price/gram:"}
              </span>
              <span className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">{pricePerGram.toLocaleString('en-US')}</span>
              <span className="text-[10px] sm:text-[11px] text-[#8a7a4a]/70">{isRTL ? "ج.م" : "EGP"}</span>
            </div>

            {/* Inputs */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">

              {/* Weight */}
              <div className="flex-1">
                <label className={`block text-[10px] sm:text-[11px] font-bold text-[#8a7a4a] uppercase ${!isRTL ? 'tracking-[0.12em]' : 'tracking-normal'} mb-1.5 sm:mb-2.5`}>
                  {isRTL ? "الوزن (جرام)" : "Weight (g)"}
                </label>
                <div className="flex items-center bg-white/80 backdrop-blur-sm border border-[#E8D5A0]/50 rounded-[1rem] sm:rounded-2xl px-4 py-2.5 sm:px-5 sm:py-4 transition-all focus-within:border-[#D4A82A] focus-within:ring-[3px] focus-within:ring-[#D4A82A]/20 focus-within:bg-white" dir="ltr">
                  <input
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-[18px] sm:text-[22px] md:text-[26px] font-bold text-[#1a1a1a] outline-none tabular-nums placeholder:text-[#ccc] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#b3a06a] shrink-0 ml-2">g</span>
                </div>
              </div>

              {/* Swap Icon */}
              <div className="shrink-0 flex items-center sm:items-end justify-center py-1 sm:pb-5 lg:pb-[1.125rem]">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-md rotate-90 sm:rotate-0 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="scale-[0.8] sm:scale-100">
                    <polyline points="7 16 3 12 7 8"></polyline>
                    <line x1="21" y1="12" x2="3" y2="12"></line>
                  </svg>
                </div>
              </div>

              {/* Budget */}
              <div className="flex-1">
                <label className={`block text-[10px] sm:text-[11px] font-bold text-[#8a7a4a] uppercase ${!isRTL ? 'tracking-[0.12em]' : 'tracking-normal'} mb-1.5 sm:mb-2.5`}>
                  {isRTL ? "المبلغ (ج.م)" : "Amount (EGP)"}
                </label>
                <div className="flex items-center bg-white/80 backdrop-blur-sm border border-[#E8D5A0]/50 rounded-[1rem] sm:rounded-2xl px-4 py-2.5 sm:px-5 sm:py-4 transition-all focus-within:border-[#D4A82A] focus-within:ring-[3px] focus-within:ring-[#D4A82A]/20 focus-within:bg-white" dir="ltr">
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#b3a06a] shrink-0 mr-2">EGP</span>
                  <input
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-[18px] sm:text-[22px] md:text-[26px] font-bold text-[#1a1a1a] outline-none tabular-nums placeholder:text-[#ccc] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Result Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-[#E8D5A0]/40">
              <div>
                <p className={`text-[10px] sm:text-[11px] font-bold text-[#8a7a4a] uppercase ${!isRTL ? 'tracking-[0.12em]' : 'tracking-normal'} mb-1 sm:mb-1.5`}>
                  {isRTL ? "إجمالي القيمة" : "Total Value"}
                </p>
                <div className="flex items-baseline gap-1.5 sm:gap-2" dir="ltr">
                  <span className="text-[26px] sm:text-[32px] lg:text-[40px] font-bold text-[#1a1a1a] tabular-nums leading-none">
                    {totalValue.toLocaleString('en-US')}
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-bold text-[#D4A82A]">{isRTL ? "ج.م" : "EGP"}</span>
                </div>
              </div>
              <a 
                href="#download" 
                className="flex items-center gap-2 sm:gap-2.5 bg-[#1a1a1a] text-white w-full sm:w-auto justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-[1rem] sm:rounded-full hover:bg-black transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-[13px] sm:text-[14px] font-bold mt-2 sm:mt-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="scale-[0.85] sm:scale-100">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {isRTL ? "حمل التطبيق وابدأ" : "Download & Start"}
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
