"use client";

import { useLang } from "../i18n/LangContext";
import { useState, useEffect, useCallback } from "react";
import { getLiveProducts } from "../../lib/api";

type ProductItem = {
  id: number;
  title: string;
  weight: string;
  price: string;
  image: string;
  isSilver: boolean;
  gain: string;
};

// Fallback images
const GOLD_FALLBACK = "/black-1.png";
const SILVER_FALLBACK = "/selver.png";

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
  if (isNaN(num)) return String(price);
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface ApiProduct {
  id: number;
  name?: string;
  title?: string;
  weight?: string | number;
  price?: number | string;
  image?: string | null;
  metal_type?: string;
}

function mapApiProduct(p: ApiProduct): ProductItem {
  const isSilver = p.metal_type === "silver";
  const rawImage = p.image ?? null;
  const image = rawImage ? rawImage : (isSilver ? SILVER_FALLBACK : GOLD_FALLBACK);
  const gain = isSilver ? "22" : "48";
  const weight = p.weight != null ? String(p.weight) : "";
  const price = p.price != null ? formatPrice(p.price) : "0";
  const title = p.name ?? p.title ?? "";

  return { id: p.id, title, weight, price, image, isSilver, gain };
}

function SkeletonCard() {
  return (
    <div className="relative snap-always snap-start shrink-0 w-[220px] sm:w-[280px] bg-white border border-gray-100 rounded-[28px] p-4 md:p-5 flex flex-col animate-pulse">
      <div className="w-full h-[120px] md:h-[140px] mb-4 bg-gray-200 rounded-2xl" />
      <div className="mt-auto space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex items-end justify-between pt-3 border-t border-gray-100/50">
          <div className="space-y-1">
            <div className="h-2 bg-gray-100 rounded w-10" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ProductPopup({ item, isRTL, onClose }: { item: ProductItem; isRTL: boolean; onClose: () => void }) {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end md:items-center justify-center transition-all duration-250 ${visible ? 'bg-black/40' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      <div
        className={`
          relative bg-white w-full md:w-auto md:min-w-[440px] md:max-w-[480px]
          md:rounded-[2rem] md:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          transition-all duration-250 ease-out
          ${visible
            ? 'opacity-100 translate-y-0 md:scale-100'
            : 'opacity-0 translate-y-8 md:translate-y-0 md:scale-95'
          }
          max-h-[85vh] md:max-h-[85vh] overflow-hidden flex flex-col
          rounded-t-[1.5rem] md:rounded-[2rem]
        `}
        style={{ fontFamily: isRTL ? 'var(--font-tajawal), sans-serif' : 'var(--font-playfair), sans-serif' }}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-[5px] rounded-full bg-[#ddd]"></div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 md:top-4 right-4 rtl:right-auto rtl:left-4 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Product image area */}
          <div className="w-full bg-[#FAFAF8] flex items-center justify-center py-10 md:py-10 px-8 md:rounded-t-[2rem]">
            <img
              src={item.image}
              alt={item.title}
              className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-contain mix-blend-multiply drop-shadow-lg"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>

          {/* Content */}
          <div className="px-7 pt-5 pb-3 md:px-8 md:py-7">
            {/* Name & weight */}
            <h3 className="text-[22px] md:text-[24px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight mb-1">
              {item.title}
            </h3>
            <p className="text-[13px] md:text-[13px] text-[#999] font-semibold mb-5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#ccc]"></span>
              {item.weight}
            </p>

            {/* Price + Gain row */}
            <div className="flex items-end justify-between mb-5 pb-5 border-b border-[#f0f0f0]">
              <div>
                <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-[0.15em] rtl:normal-case rtl:tracking-normal mb-1">{isRTL ? "السعر الحالي" : "Current Price"}</p>
                <div className="flex items-baseline gap-1.5" dir="ltr">
                  <span className="text-[26px] md:text-[28px] font-extrabold text-[#1a1a1a] tabular-nums leading-none" style={{ fontFamily: 'sans-serif' }}>{item.price}</span>
                  <span className={`text-[13px] font-bold ${item.isSilver ? 'text-[#999]' : 'text-[#D4A82A]'}`} style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{isRTL ? "ج.م" : "EGP"}</span>
                </div>
              </div>

              {/* Gain badge */}
              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-[0.15em] rtl:normal-case rtl:tracking-normal">{isRTL ? "لو اشتريت من سنة" : "1 Year Return"}</p>
                <div className="flex items-center gap-1 bg-[#E8F5E9] px-3 py-1.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <span className="text-[14px] font-extrabold text-[#2E7D32]" dir="ltr">+{item.gain}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Now button — sticky bottom */}
        <div className="shrink-0 px-6 md:px-8 pt-2 pb-5 md:pb-7 bg-white border-t border-[#f5f5f5]" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => {
              const token = document.cookie.split(";").find(c => c.trim().startsWith("gct_token="));
              if (token) {
                window.location.href = `/${lang}/dashboard`;
              } else {
                window.location.href = `/${lang}/login`;
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-black text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-[14px] transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          >
            {isRTL ? "اشتر الآن" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSlider() {
  const { lang, isRTL } = useLang();
  const [showAllGold, setShowAllGold] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [goldItems, setGoldItems] = useState<ProductItem[]>([]);
  const [silverItems, setSilverItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setEmpty(false);

    getLiveProducts(lang).then((res) => {
      if (cancelled) return;

      if ("success" in res && res.success === false) {
        // API failed — keep skeleton showing (don't show hardcoded data)
        setLoading(true);
        return;
      }

      const data = (res as { data: ApiProduct[] | null }).data;
      const products: ApiProduct[] = Array.isArray(data) ? data : [];

      if (products.length === 0) {
        setEmpty(true);
        setLoading(false);
        return;
      }

      const mapped = products.map(mapApiProduct);
      setGoldItems(mapped.filter((p) => !p.isSilver));
      setSilverItems(mapped.filter((p) => p.isSilver));
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [lang]);

  const categories = [
    {
      title: isRTL ? "السبائك والجنيهات الذهبية" : "Gold Coins & Bars",
      description: isRTL
        ? "الدهب هو ملاذك الآمن في وقت الأزمات.. اشتري براحتك في أي وقت ومن غير ولا قرش عمولة."
        : "Gold is your ultimate safe haven during crises. Buy freely anytime with zero commission.",
      items: goldItems,
      isSilverCat: false,
    },
    {
      title: isRTL ? "سبائك الفضة" : "Silver Bars",
      description: isRTL
        ? "الفضة مكسبها جاي مع الوقت.. ابدأ استثمارك دلوقتي وابني ثروتك للمستقبل بخطوات بسيطة."
        : "Silver's value grows over time. Start your investment journey today and build for the future.",
      items: silverItems,
      isSilverCat: true,
    },
  ];

  return (
    <section id="products" className="relative w-full bg-white py-20 md:py-32 [overflow-x:clip]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full flex flex-col gap-16 md:gap-24">
        {categories.map((category, idx) => {
          const bgGradient = category.isSilverCat
            ? "linear-gradient(25deg, #d3d3d3 10%, #f4f4f4 30%, #c8c8c8 50%, #e8e8e8 70%, #bfbfbf 90%)"
            : "linear-gradient(25deg, #e4c25f 10%, #fae69e 30%, #d4b045 50%, #f1d981 70%, #c6a137 90%)";

          return (
            <div key={idx} className="w-full relative">
              <div className="w-full mb-0 relative z-0">
                <div
                  className="max-w-7xl mx-auto overflow-hidden relative pb-24 md:pb-32 pt-10 md:pt-14 px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-center text-center shadow-[0_12px_30px_rgba(0,0,0,0.04)] rounded-none"
                  style={{
                    backgroundImage: `
                      radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.6) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 100%, rgba(255,255,255,0.4) 0%, transparent 60%),
                      radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 50%),
                      ${bgGradient}
                    `,
                    boxShadow: "inset 0 1px 15px rgba(255,255,255,0.4)"
                  }}
                >
                  {/* Subtle noise for fabric texture */}
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}></div>
                  <div className="relative z-10 mt-1">
                    <h2 className="text-[24px] sm:text-[32px] md:text-[42px] font-bold text-[#1a1a1a] leading-[1.2] tracking-tight mb-2 drop-shadow-sm">{category.title}</h2>
                    <p className="text-[13px] sm:text-[15px] text-[#444]/80 font-medium max-w-xl mx-auto">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Slider Container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 md:-mt-28">
                {category.isSilverCat ? (
                  /* ── Silver "Coming Soon" Card ── */
                  <div className="w-full flex justify-center pb-12">
                    <div
                      className="relative overflow-hidden w-full max-w-2xl rounded-[32px] border border-white/30 p-8 md:p-12 flex flex-col items-center text-center gap-5"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(245,245,245,0.7) 50%, rgba(255,255,255,0.9) 100%)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    >
                      {/* Shimmer sweep animation */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmerSweep 3s ease-in-out infinite",
                        }}
                      />

                      {/* Decorative ring */}
                      <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #0f3460 70%, #533483 100%)",
                          boxShadow: "0 6px 24px rgba(15,52,96,0.3), inset 0 1px 2px rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/80 flex items-center justify-center"
                          style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
                        >
                          {/* Animated bell icon */}
                          <svg
                            width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#888"
                            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                            className="md:w-8 md:h-8"
                            style={{ animation: "bellRing 2.5s ease-in-out infinite" }}
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </div>
                      </div>

                      {/* Coming Soon text */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <h3
                          className="text-[22px] sm:text-[28px] md:text-[32px] font-extrabold tracking-tight leading-tight"
                          style={{
                            background: "linear-gradient(135deg, #888 0%, #555 40%, #999 70%, #666 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {isRTL ? "قريبـاً" : "Coming Soon"}
                        </h3>
                        <p className="text-[13px] sm:text-[15px] text-[#777] font-medium max-w-md leading-relaxed">
                          {isRTL
                            ? "نجهّز لك تشكيلة مميزة من سبائك الفضة عيار 999.. استنونا قريب!"
                            : "We're preparing an exclusive collection of 999 fine silver bars. Stay tuned!"}
                        </p>
                      </div>

                      {/* Decorative dots */}
                      <div className="relative z-10 flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] animate-pulse" style={{ animationDelay: "0s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bbb] animate-pulse" style={{ animationDelay: "0.3s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-pulse" style={{ animationDelay: "0.6s" }} />
                      </div>

                      {/* Keyframes injected via style tag */}
                      <style>{`
                        @keyframes shimmerSweep {
                          0% { background-position: 200% 0; }
                          100% { background-position: -200% 0; }
                        }
                        @keyframes bellRing {
                          0%, 100% { transform: rotate(0deg); }
                          10% { transform: rotate(14deg); }
                          20% { transform: rotate(-12deg); }
                          30% { transform: rotate(8deg); }
                          40% { transform: rotate(-4deg); }
                          50% { transform: rotate(0deg); }
                        }
                      `}</style>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="w-full flex lg:flex-wrap lg:justify-center gap-4 md:gap-6 overflow-x-auto lg:overflow-x-visible pb-12 snap-x lg:snap-none snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : empty ? (
                  <div className="w-full flex items-center justify-center py-16 pb-12">
                    <p className="text-[16px] text-[#999] font-semibold">
                      {isRTL ? "لا توجد منتجات متاحة حالياً" : "No products available"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-full flex lg:flex-wrap lg:justify-center gap-4 md:gap-6 overflow-x-auto lg:overflow-x-visible pb-12 snap-x lg:snap-none snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {category.items.slice(0, (!showAllGold) ? 8 : category.items.length).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedProduct(item)}
                          className="cursor-pointer text-start relative snap-always snap-start shrink-0 w-[220px] sm:w-[280px] bg-white border border-gray-100 rounded-[28px] p-4 md:p-5 flex flex-col hover:shadow-[0_12px_25px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
                        >
                          <div className="w-full h-[120px] md:h-[140px] mb-4 relative flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-105">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-lg"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          </div>

                          <div className="mt-auto pointer-events-none">
                            <h4 className="text-[16px] md:text-[18px] font-bold text-[#1a1a1a] mb-1 leading-tight">{item.title}</h4>
                            <p className="text-[12px] text-[#777] font-semibold mb-4 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#ccc]"></span>
                              {item.weight}
                            </p>

                            <div className="flex items-end justify-between pt-3 border-t border-gray-100/50">
                              <div>
                                <p className="text-[9px] text-[#999] font-bold uppercase tracking-[0.1em] rtl:normal-case rtl:tracking-normal mb-1">{isRTL ? "السعر" : "Price"}</p>
                                <div className="flex items-baseline gap-1" dir="ltr">
                                  <span className="text-[20px] font-bold text-[#1a1a1a] tabular-nums leading-none">{item.price}</span>
                                  <span className={`text-[12px] font-bold ${item.isSilver ? 'text-[#999]' : 'text-[#D4A82A]'} ml-0.5`}>{isRTL ? "ج.م" : "EGP"}</span>
                                </div>
                              </div>
                              <div
                                className="bg-[#1a1a1a] text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                  <line x1="3" y1="6" x2="21" y2="6"></line>
                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!showAllGold && category.items.length > 8 && (
                      <div className="hidden sm:flex w-full justify-center mt-2 mb-10">
                        <button
                          onClick={() => setShowAllGold(true)}
                          className="px-10 py-3.5 rounded-full border-[1.5px] border-[#1a1a1a] text-[#1a1a1a] font-bold text-sm hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                        >
                          {isRTL ? "عرض المزيد" : "Show More"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Popup */}
      {selectedProduct && (
        <ProductPopup
          item={selectedProduct}
          isRTL={isRTL}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
