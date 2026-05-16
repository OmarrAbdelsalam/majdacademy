"use client";
import { useLang } from "../i18n/LangContext";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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

interface ApiProduct {
  id: number;
  name?: string;
  title?: string;
  weight?: string | number;
  price?: number | string;
  image?: string | null;
  metal_type?: string;
}

const GOLD_FALLBACK = "/black-1.png";
const SILVER_FALLBACK = "/selver.png";

function formatPrice(price: number | string): string {
  const num =
    typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
  if (isNaN(num)) return String(price);
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function mapApiProduct(p: ApiProduct): ProductItem {
  const isSilver = p.metal_type === "silver";
  const rawImage = p.image ?? null;
  const image = rawImage ? rawImage : isSilver ? SILVER_FALLBACK : GOLD_FALLBACK;
  const gain = isSilver ? "22" : "48";
  const weight = p.weight != null ? String(p.weight) : "";
  const price = p.price != null ? formatPrice(p.price) : "0";
  const title = p.name ?? p.title ?? "";
  return { id: p.id, title, weight, price, image, isSilver, gain };
}

type Filter = "all" | "gold" | "silver";

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-[28px] p-4 md:p-5 flex flex-col animate-pulse">
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

export default function ProductsShowcase() {
  const { lang, isRTL } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [goldItems, setGoldItems] = useState<ProductItem[]>([]);
  const [silverItems, setSilverItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getLiveProducts(lang), getSilverLiveProducts(lang)]).then(
      ([goldRes, silverRes]) => {
        if (cancelled) return;

        const goldData = (goldRes as { data: ApiProduct[] | null }).data;
        const goldProducts: ApiProduct[] = Array.isArray(goldData) ? goldData : [];

        const silverData = (silverRes as { data: ApiProduct[] | null }).data;
        const silverProducts: ApiProduct[] = Array.isArray(silverData)
          ? silverData
          : [];

        setGoldItems(
          goldProducts
            .filter((p) => p.metal_type !== "silver")
            .map(mapApiProduct)
        );
        setSilverItems(silverProducts.map(mapApiProduct));
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const allItems =
    filter === "all"
      ? [...goldItems, ...silverItems]
      : filter === "gold"
      ? goldItems
      : silverItems;

  const displayItems = showAll ? allItems : allItems.slice(0, 8);

  const filters: { id: Filter; labelAr: string; labelEn: string }[] = [
    { id: "all", labelAr: "الكل", labelEn: "All" },
    { id: "gold", labelAr: "ذهب", labelEn: "Gold" },
    { id: "silver", labelAr: "فضة", labelEn: "Silver" },
  ];

  return (
    <section
      className="relative w-full bg-white py-20 md:py-28 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[12px] sm:text-[13px] text-[#999] font-semibold uppercase tracking-wider mb-3">
            {isRTL ? "تشكيلة مميزة" : "Premium Collection"}
          </p>
          <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold text-[#1a1a1a] leading-tight tracking-tight mb-4">
            {isRTL ? "منتجاتنا" : "Our Products"}
          </h2>
          <p className="text-[14px] sm:text-[16px] text-[#777] max-w-xl mx-auto">
            {isRTL
              ? "سبائك وجنيهات ذهبية وفضية بأعلى جودة وأسعار تنافسية"
              : "Premium gold & silver bars and coins at competitive prices"}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id);
                setShowAll(false);
              }}
              className={`px-5 sm:px-7 py-2.5 rounded-full text-[13px] sm:text-[14px] font-bold transition-all duration-300 ${
                filter === f.id
                  ? "bg-[#1a1a1a] text-white shadow-sm"
                  : "text-[#777] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]"
              }`}
            >
              {isRTL ? f.labelAr : f.labelEn}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : allItems.length === 0 ? (
          <div className="w-full flex items-center justify-center py-16">
            <p className="text-[16px] text-[#999] font-semibold">
              {isRTL ? "لا توجد منتجات متاحة حالياً" : "No products available"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {displayItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className="cursor-pointer text-start bg-white border border-gray-100 rounded-[28px] p-4 md:p-5 flex flex-col hover:shadow-[0_12px_25px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="w-full h-[120px] md:h-[140px] mb-4 relative flex items-center justify-center p-2 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="mt-auto">
                    <h4 className="text-[15px] md:text-[17px] font-bold text-[#1a1a1a] mb-1 leading-tight line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-[#777] font-semibold mb-4 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#ccc]"></span>
                      {item.weight}
                    </p>

                    <div className="flex items-end justify-between pt-3 border-t border-gray-100/50">
                      <div>
                        <p className="text-[9px] text-[#999] font-bold uppercase tracking-[0.1em] rtl:normal-case rtl:tracking-normal mb-1">
                          {isRTL ? "السعر" : "Price"}
                        </p>
                        <div
                          className="flex items-baseline gap-1"
                          dir="ltr"
                        >
                          <span className="text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] tabular-nums leading-none">
                            {item.price}
                          </span>
                          <span
                            className={`text-[12px] font-bold ${
                              item.isSilver
                                ? "text-[#999]"
                                : "text-[#D4A82A]"
                            } ml-0.5`}
                          >
                            {isRTL ? "ج.م" : "EGP"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}
                        className="bg-[#1a1a1a] text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center hover:bg-black"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Show More */}
            {!showAll && allItems.length > 8 && (
              <div className="flex w-full justify-center mt-10">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-10 py-3.5 rounded-full border-[1.5px] border-[#1a1a1a] text-[#1a1a1a] font-bold text-sm hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                >
                  {isRTL ? "عرض المزيد" : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Popup */}
      {selectedProduct && (
        <ProductPopup
          item={selectedProduct}
          isRTL={isRTL}
          lang={lang}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Cart Toast has been removed because animation is handled by Navbar */}
    </section>
  );
}

// Self-contained popup to avoid circular imports
function ProductPopup({
  item,
  isRTL,
  lang,
  onClose,
}: {
  item: ProductItem;
  isRTL: boolean;
  lang: string;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [adding, setAdding] = useState(false);

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 250);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end md:items-center justify-center transition-all duration-250 ${
        visible ? "bg-black/40" : "bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`
          relative bg-white w-full md:w-auto md:min-w-[440px] md:max-w-[480px]
          md:rounded-[2rem] md:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          transition-all duration-250 ease-out
          ${
            visible
              ? "opacity-100 translate-y-0 md:scale-100"
              : "opacity-0 translate-y-8 md:translate-y-0 md:scale-95"
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full bg-[#FAFAF8] flex items-center justify-center py-10 px-8 md:rounded-t-[2rem]">
            <img
              src={item.image}
              alt={item.title}
              className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-contain mix-blend-multiply drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="px-7 pt-5 pb-3 md:px-8 md:py-7">
            <h3 className="text-[22px] md:text-[24px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight mb-1">
              {item.title}
            </h3>
            <p className="text-[13px] text-[#999] font-semibold mb-5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#ccc]"></span>
              {item.weight}
            </p>

            <div className="flex items-end justify-between mb-5 pb-5 border-b border-[#f0f0f0]">
              <div>
                <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-[0.15em] rtl:normal-case rtl:tracking-normal mb-1">
                  {isRTL ? "السعر الحالي" : "Current Price"}
                </p>
                <div
                  className="flex items-baseline gap-1.5"
                  dir="ltr"
                >
                  <span
                    className="text-[26px] md:text-[28px] font-extrabold text-[#1a1a1a] tabular-nums leading-none"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {item.price}
                  </span>
                  <span
                    className={`text-[13px] font-bold ${
                      item.isSilver ? "text-[#999]" : "text-[#D4A82A]"
                    }`}
                  >
                    {isRTL ? "ج.م" : "EGP"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] text-[#bbb] font-bold uppercase tracking-[0.15em] rtl:normal-case rtl:tracking-normal">
                  {isRTL ? "لو اشتريت من سنة" : "1 Year Return"}
                </p>
                <div className="flex items-center gap-1 bg-[#E8F5E9] px-3 py-1.5 rounded-full">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <span
                    className="text-[14px] font-extrabold text-[#2E7D32]"
                    dir="ltr"
                  >
                    +{item.gain}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart — sticky bottom */}
        <div
          className="shrink-0 px-6 md:px-8 pt-3 pb-5 md:pb-7 bg-white border-t border-[#f5f5f5]"
          style={{
            paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
          }}
        >
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
