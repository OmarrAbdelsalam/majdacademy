"use client";
import { useLang } from "../i18n/LangContext";
import { useEffect, useState } from "react";
import { ApiResponse } from "../../lib/api-client";
import { getCurrentPrices } from "../../lib/api";

interface CurrentPrices {
  buy_24?: number;
  buy_21?: number;
  buy_18?: number;
  silver_buy?: number;
}

interface LivePrices {
  buy24: number | null;
  buy21: number | null;
  buy18: number | null;
  silverBuy: number | null;
  stale: boolean;
}

function useLivePrices(locale: string): LivePrices {
  const [prices, setPrices] = useState<LivePrices>({ buy24: null, buy21: null, buy18: null, silverBuy: null, stale: false });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await getCurrentPrices(locale);
        if ("success" in res && res.success === false) {
          setPrices((prev) => ({ ...prev, stale: true }));
          return;
        }
        // The API returns the prices directly in res.prices
        const data = (res as unknown as { prices: CurrentPrices }).prices;
        if (data) {
          setPrices({
            buy24: data.buy_24 ?? null,
            buy21: data.buy_21 ?? null,
            buy18: data.buy_18 ?? null,
            silverBuy: data.silver_buy ?? null,
            stale: false
          });
        }
      } catch {
        setPrices((prev) => ({ ...prev, stale: true }));
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000);
    return () => clearInterval(interval);
  }, [locale]);

  return prices;
}

export default function Hero() {
  const { tr, isRTL, lang } = useLang();
  const h = tr.hero;
  const { buy24, buy21, buy18, silverBuy, stale } = useLivePrices(lang);

  // Build ticker items: live prices for first two, static for the rest
  const staleIndicator = stale ? " ⚠" : "";
  const formatPrice = (p: number | null) => p ? p.toLocaleString('en-US', { maximumFractionDigits: 2 }) : "...";
  
  const gold24Label = isRTL
    ? `سعر الذهب عيار 24: ${formatPrice(buy24)} ج.م/جرام${staleIndicator}`
    : `Live 24K Gold: EGP ${formatPrice(buy24)}/g${staleIndicator}`;
  
  const gold21Label = isRTL
    ? `سعر الذهب عيار 21: ${formatPrice(buy21)} ج.م/جرام${staleIndicator}`
    : `Live 21K Gold: EGP ${formatPrice(buy21)}/g${staleIndicator}`;
    
  const gold18Label = isRTL
    ? `سعر الذهب عيار 18: ${formatPrice(buy18)} ج.م/جرام${staleIndicator}`
    : `Live 18K Gold: EGP ${formatPrice(buy18)}/g${staleIndicator}`;

  const silverLabel = isRTL
    ? `سعر الفضة عيار 999: ${silverBuy ? formatPrice(silverBuy) : "قريباً"} ج.م/جرام`
    : `Live 999 Silver: ${silverBuy ? `EGP ${formatPrice(silverBuy)}/g` : "Coming Soon"}`;
    
  const tickerItems = [gold24Label, gold21Label, gold18Label, silverLabel, ...(h.ticker.slice(2) as string[])];

  return (
    <div id="home" className="w-full relative flex flex-col bg-[#FDFBF5] overflow-hidden">
      {/* Premium subtle gold glows — lighter on mobile */}
      <div className="absolute -top-32 -left-16 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#E9C237]/20 to-transparent blur-[60px] sm:blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 -right-16 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-tl from-[#C9A84C]/15 via-[#F5E6A3]/8 to-transparent blur-[50px] sm:blur-[80px] pointer-events-none z-0"></div>
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-30 md:opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(201, 168, 76, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201, 168, 76, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, #000 60%, transparent 100%)'
        }}
      ></div>

      {/* Fine noise texture to give a non-digital, premium physical feel */}
      <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none z-0 hidden sm:block" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <section className="relative w-full flex flex-col justify-center items-center overflow-visible z-10 min-h-[85svh] md:min-h-0 pt-20 md:pt-36 pb-0 px-2 sm:px-6">

      {/* Content wrapper */}
      <div className="w-full flex flex-col items-center text-center mt-4 sm:mt-4 mb-6 sm:mb-6 relative z-10 px-2 sm:px-6">

        {/* Trust badge */}
        <div 
          className="flex items-center gap-2 mb-7 sm:mb-8 animate-fadeInUp"
          style={{ animationDelay: '0s' }}
        >
          <div className="flex -space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#FDF1B8]" />
            <div className="w-2 h-2 rounded-full bg-[#F4CD58]" />
            <div className="w-2 h-2 rounded-full bg-[#D39C04]" />
          </div>
          <span className={`text-[11px] sm:text-[13px] font-semibold text-[#999] uppercase ${!isRTL ? 'tracking-[0.2em]' : 'tracking-normal'}`}>
            {isRTL ? "منصة موثوقة لبيع الذهب والفضة" : "Trusted Gold & Silver Platform"}
          </span>
        </div>

        {/* Main Headline */}
        <h1 
          className="text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-bold leading-[1.1] tracking-tight mb-6 sm:mb-6 text-[#1a1a1a] px-1 max-w-[1300px] animate-fadeInUp"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="block mb-0.5 sm:mb-1">
            {h.h1a} <span className="text-[#E4B815]">{h.h1b}</span>
          </span>
          <span className="block">{h.h1c}</span>
        </h1>

        {/* Description */}
        <p 
          className="text-[14px] sm:text-[17px] md:text-[19px] text-[#777] leading-[1.7] max-w-[340px] sm:max-w-[900px] mb-8 sm:mb-8 font-medium px-0 animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          {h.sub}
        </p>

        {/* CTA Button */}
        <div
          className="mb-0 animate-fadeInUp"
          style={{ animationDelay: '0.3s' }}
        >
          <a 
            href="#products" 
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center justify-center min-w-[200px] gap-3 bg-[#1a1a1a] text-white px-8 py-3.5 rounded-full font-bold text-[15px] sm:text-[16px] hover:bg-black transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          >
            <span>{isRTL ? "تصفح المنتجات" : "Browse Products"}</span>
            {isRTL ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </a>
        </div>

        {/* Subtle stats */}
        <div 
          className="flex items-center gap-3 sm:gap-5 mt-6 sm:mt-6 text-[11px] sm:text-[13px] text-[#999] font-medium leading-none animate-fadeInUp"
          style={{ animationDelay: '0.5s' }}
        >
          <span>{h.stats.users}</span>
          <span className="text-[#ddd]">·</span>
          <span>{h.stats.rating}</span>
          <span className="text-[#ddd]">·</span>
          <span>{h.stats.purity}</span>
        </div>

      </div>

      {/* BTC Gold Bars - Showcase */}
      <div className="hidden md:flex w-full px-2 sm:px-4 mt-6 md:mt-4 relative z-20 items-center justify-center -space-x-4 sm:-space-x-4 md:-space-x-8" style={{ marginBottom: "-100px" }}>
        {[
          "/black-1.webp",
          "/blue-2.png",
          "/black-3.webp",
        ].map((src, i) => (
          <img 
            key={i}
            src={src} 
            alt={`Gold Bar ${i + 1}`}
            className="w-[34%] sm:w-[36%] max-w-[380px] h-auto object-contain relative z-10 animate-fadeInUp"
            style={{ 
              filter: "drop-shadow(0 25px 45px rgba(0,0,0,0.25))",
              animationDelay: `${0.4 + i * 0.1}s`,
            }}
          />
        ))}
      </div>
      </section>

      {/* Live Prices Ticker - Unbound from container */}
      <div className="w-full bg-[#0A0A0A] py-3 sm:py-3.5 border-y border-[#333] overflow-hidden z-10 mt-12 md:mt-[160px]">
        {/* The wrapper that animates to -50% */}
        <div className="flex w-max animate-ticker">
          {/* First set */}
          <div className="flex items-center shrink-0 text-white/90 font-medium text-[12px] sm:text-[15px] tracking-wider">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((text, i) => (
              <div key={`a-${i}`} className="flex items-center shrink-0">
                <span className="px-2 sm:px-8">{text}</span>
                <span className="text-[#E9C237] opacity-60 text-[8px] sm:text-[10px]">◆</span>
              </div>
            ))}
          </div>
          {/* Second identical set for seamless loop */}
          <div className="flex items-center shrink-0 text-white/90 font-medium text-[12px] sm:text-[15px] tracking-wider">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((text, i) => (
              <div key={`b-${i}`} className="flex items-center shrink-0">
                <span className="px-2 sm:px-8">{text}</span>
                <span className="text-[#E9C237] opacity-60 text-[8px] sm:text-[10px]">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
