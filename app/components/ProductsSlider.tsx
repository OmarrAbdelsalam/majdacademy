"use client";

import { useLang } from "../i18n/LangContext";
import { useState, useEffect, useCallback } from "react";
import { getLiveProducts, getSilverLiveProducts } from "../../lib/api";
import { useCart } from "../cart/CartContext";
import Link from "next/link";

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

/** Returns true if the image URL is a real product image (not a server placeholder) */
function isRealProductImage(url: string | null | undefined): boolean {
  if (!url) return false;
  // Detect placeholder URLs returned by the API (e.g. staging.golden-circle.net/placeholder-image/...)
  if (url.includes("placeholder-image") || url.includes("placeholder")) return false;
  return true;
}

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
  const title = p.name ?? p.title ?? "";
  
  // Check if the product is a gold bar (sabika)
  const isSabika = title.includes("سبيكة") || title.includes("سبيكه") || title.toLowerCase().includes("bar");
  const isOneGram = p.weight === 1 || p.weight === "1" || title.includes("1 جرام") || title.toLowerCase().includes("1 gram") || title.includes("1g");
  
  let image = "";
  if (isSilver) {
    image = isRealProductImage(p.image) ? p.image! : SILVER_FALLBACK;
  } else {
    if (isOneGram) {
      image = "/gold1.png";
    } else if (isSabika) {
      image = "/gold.png";
    } else {
      image = isRealProductImage(p.image) ? p.image! : "/gold.png";
    }
  }

  const gain = isSilver ? "22" : "48";
  const weight = p.weight != null ? String(p.weight) : "";
  const price = p.price != null ? formatPrice(p.price) : "0";

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
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [visible, setVisible] = useState(false);

  const priceNum = parseFloat(String(item.price).replace(/,/g, ""));

  const handleAddToCart = () => {
    setAdding(true);
    // Simulate brief loading
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => {
        onClose();
        addItem(
          {
            id: item.id,
            title: item.title,
            weight: item.weight,
            price: item.price,
            priceNum: isNaN(priceNum) ? 0 : priceNum,
            image: item.image,
            isSilver: item.isSilver,
          },
          qty
        );
        setTimeout(() => window.dispatchEvent(new CustomEvent("cart-bump")), 100);
      }, 1200);
    }, 400);
  };

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
            <div className="relative flex items-center justify-center">
              <div className="absolute -bottom-2 w-[70%] h-[12px] bg-black/15 blur-[6px] rounded-[100%]"></div>
              <img
                src={item.image}
                alt={item.title}
                className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-contain mix-blend-multiply drop-shadow-[0_15px_25px_rgba(0,0,0,0.1)] relative z-10"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
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

            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-[0.15em] rtl:normal-case rtl:tracking-normal mb-1">{isRTL ? "السعر الحالي" : "Current Price"}</p>
                <div className="flex items-baseline gap-1.5" dir="ltr">
                  <span className="text-[26px] md:text-[28px] font-extrabold text-[#1a1a1a] tabular-nums leading-none" style={{ fontFamily: 'sans-serif' }}>{item.price}</span>
                  <span className={`text-[13px] font-bold ${item.isSilver ? 'text-[#999]' : 'text-[#D4A82A]'}`} style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{isRTL ? "ج.م" : "EGP"}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Add to Cart button — sticky bottom */}
        <div className="shrink-0 px-6 md:px-8 pt-3 pb-5 md:pb-7 bg-white border-t border-[#f5f5f5]" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          {/* Quantity selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-[#888]">
              {isRTL ? "الكمية" : "Quantity"}
            </span>
            <div className="flex items-center gap-3 bg-[#f5f5f5] rounded-xl px-1 py-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[18px] font-bold text-[#888] hover:text-[#1a1a1a] shadow-sm transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center text-[16px] font-extrabold text-[#1a1a1a]">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[18px] font-bold text-[#888] hover:text-[#1a1a1a] shadow-sm transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          {qty > 1 && (
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[12px] text-[#aaa] font-semibold">{isRTL ? "الإجمالي" : "Total"}</span>
              <span className="text-[15px] font-extrabold text-[#1a1a1a]" dir="ltr">
                {(priceNum * qty).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                <span className={`text-[11px] ms-1 font-bold ${item.isSilver ? "text-[#999]" : "text-[#D4A82A]"}`}>
                  {isRTL ? "ج.م" : "EGP"}
                </span>
              </span>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={added || adding}
            className={`w-full flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-[14px] transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${
              added
                ? "bg-[#00472f] text-white"
                : "bg-[#1a1a1a] hover:bg-black text-white disabled:opacity-80"
            }`}
          >
            {adding ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {isRTL ? "جاري الإضافة..." : "Adding..."}
              </>
            ) : added ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {isRTL ? "تمت الإضافة بنجاح" : "Added Successfully"}
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {isRTL ? "أضف للسلة" : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSlider() {
  const { lang, isRTL } = useLang();
  const [showAllGold, setShowAllGold] = useState(false);
  const [showAllSilver, setShowAllSilver] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [goldItems, setGoldItems] = useState<ProductItem[]>([]);
  const [silverItems, setSilverItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const { addItem } = useCart();
  const [cartToast, setCartToast] = useState<string | null>(null);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, item: ProductItem) => {
      e.stopPropagation();
      const priceNum = parseFloat(String(item.price).replace(/,/g, ""));
      addItem({
        id: item.id,
        title: item.title,
        weight: item.weight,
        price: item.price,
        priceNum: isNaN(priceNum) ? 0 : priceNum,
        image: item.image,
        isSilver: item.isSilver,
      });
      setCartToast(item.title);
      setTimeout(() => setCartToast(null), 2000);
    },
    [addItem]
  );

  useEffect(() => {
    let cancelled = false;
    
    // 1. Try to load from cache
    const cachedGold = localStorage.getItem(`cached_gold_${lang}`);
    const cachedSilver = localStorage.getItem(`cached_silver_${lang}`);
    
    if (cachedGold && cachedSilver) {
      try {
        const parsedGold = JSON.parse(cachedGold);
        const parsedSilver = JSON.parse(cachedSilver);
        if (parsedGold.length > 0 || parsedSilver.length > 0) {
          setGoldItems(parsedGold.filter((p: any) => p.metal_type !== "silver").map(mapApiProduct));
          setSilverItems(parsedSilver.map(mapApiProduct));
          setLoading(false);
        }
      } catch (e) {}
    } else {
      setLoading(true);
    }
    setEmpty(false);

    Promise.all([
      getLiveProducts(lang),
      getSilverLiveProducts(lang),
    ]).then(([goldRes, silverRes]) => {
      if (cancelled) return;

      if ("success" in goldRes && goldRes.success === false) {
        if (!cachedGold) setLoading(true);
        return;
      }

      const goldData = (goldRes as { data: ApiProduct[] | null }).data;
      const goldProducts: ApiProduct[] = Array.isArray(goldData) ? goldData : [];

      const silverData = (silverRes as { data: ApiProduct[] | null }).data;
      const silverProducts: ApiProduct[] = Array.isArray(silverData) ? silverData : [];

      if (goldProducts.length === 0 && silverProducts.length === 0) {
        if (!cachedGold) setEmpty(true);
        setLoading(false);
        return;
      }

      // Save to cache
      localStorage.setItem(`cached_gold_${lang}`, JSON.stringify(goldProducts));
      localStorage.setItem(`cached_silver_${lang}`, JSON.stringify(silverProducts));

      setGoldItems(goldProducts.filter(p => p.metal_type !== "silver").map(mapApiProduct));
      setSilverItems(silverProducts.map(mapApiProduct));
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
      showAll: showAllGold,
      setShowAll: setShowAllGold,
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
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 md:-mt-28" style={{ paddingInlineEnd: 0 }}>
                {loading ? (
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
                      {category.items.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedProduct(item)}
                          className={`cursor-pointer text-start relative snap-always snap-start shrink-0 w-[220px] sm:w-[280px] bg-white border border-gray-100 rounded-[28px] p-4 md:p-5 flex-col hover:shadow-[0_12px_25px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group
                            ${!category.showAll && index >= category.items.length - 3 ? "flex lg:hidden" : "flex"}
                          `}
                        >
                          <div className="w-full h-[120px] md:h-[140px] mb-4 relative flex items-center justify-center">
                            <div className="absolute -bottom-1 w-[60%] h-[10px] bg-black/15 blur-[5px] rounded-[100%] transition-all duration-500 group-hover:scale-90 group-hover:opacity-60"></div>
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] relative z-10 transition-transform duration-500 group-hover:-translate-y-2"
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
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}
                                className="bg-[#1a1a1a] text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center hover:bg-black pointer-events-auto"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="9" cy="21" r="1"></circle>
                                  <circle cx="20" cy="21" r="1"></circle>
                                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>


                    {!category.showAll && category.items.length > 3 && (
                      <div className="hidden lg:flex w-full justify-center mt-2 mb-10">
                        <button
                          onClick={() => category.setShowAll(true)}
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

      {/* Cart Toast */}
      {cartToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 bg-[#1a1a1a] text-white px-6 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span className="text-[13px] font-bold">{isRTL ? "تمت الإضافة للسلة" : "Added to cart"}</span>
            <Link href={`/${lang}/cart`} className="text-[12px] font-bold text-[#C9A84C] hover:underline ms-2">
              {isRTL ? "عرض السلة" : "View Cart"}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
