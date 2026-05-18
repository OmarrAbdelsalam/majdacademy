"use client";
import { useState, useEffect } from "react";
import { useLang } from "../../i18n/LangContext";
import { useCart } from "../../cart/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getLiveProducts, getSilverLiveProducts } from "../../../lib/api";

/** Returns true if the image URL is a real product image (not a server placeholder) */
function isRealProductImage(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes("placeholder-image") || url.includes("placeholder")) return false;
  return true;
}

export default function CartPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice, addItem } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = typeof document !== "undefined" ? document.cookie.split(";").find((c) => c.trim().startsWith("gct_token=")) : null;
    if (token) {
      setIsLoggedIn(true);
    }
    setLoadingAuth(false);
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setRelatedProducts([]);
      return;
    }
    const fetchRelated = async () => {
      try {
        const [goldRes, silverRes] = await Promise.all([
          getLiveProducts(lang),
          getSilverLiveProducts(lang)
        ]);
        
        let allProducts: any[] = [];
        if (goldRes.success && goldRes.data) {
          const goldList = Array.isArray(goldRes.data?.data) ? goldRes.data.data : Array.isArray(goldRes.data) ? goldRes.data : [];
          allProducts = [...allProducts, ...goldList.map((p: any) => ({ ...p, isSilver: false }))];
        }
        if (silverRes.success && silverRes.data) {
          const silverList = Array.isArray(silverRes.data?.data) ? silverRes.data.data : Array.isArray(silverRes.data) ? silverRes.data : [];
          allProducts = [...allProducts, ...silverList.map((p: any) => ({ ...p, isSilver: true }))];
        }

        const cartIds = items.map(i => i.id);
        const available = allProducts.filter(p => !cartIds.includes(p.id));

        const refItem = items[0];
        const refWeight = parseFloat(String(refItem.weight).replace(/[^\d.]/g, '')) || 0;

        available.sort((a, b) => {
          const aWeight = parseFloat(String(a.weight).replace(/[^\d.]/g, '')) || 0;
          const bWeight = parseFloat(String(b.weight).replace(/[^\d.]/g, '')) || 0;
          const aIsSameMetal = a.isSilver === refItem.isSilver;
          const bIsSameMetal = b.isSilver === refItem.isSilver;

          if (aIsSameMetal && !bIsSameMetal) return -1;
          if (!aIsSameMetal && bIsSameMetal) return 1;

          return Math.abs(aWeight - refWeight) - Math.abs(bWeight - refWeight);
        });

        setRelatedProducts(available.slice(0, 5));
      } catch (err) {}
    };
    fetchRelated();
  }, [items, lang]);

  const tr = {
    title: isRTL ? "سلة المشتريات" : "Shopping Cart",
    empty: isRTL ? "سلة المشتريات فارغة" : "Your cart is empty",
    continueShopping: isRTL ? "متابعة التسوق" : "Continue Shopping",
    checkout: isRTL ? "متابعة الطلب" : "Proceed to Checkout",
    orderSummary: isRTL ? "ملخص الطلب" : "Order Summary",
    subtotal: isRTL ? "المجموع الفرعي" : "Subtotal",
    shippingCalc: isRTL ? "يتم حساب الشحن في الخطوة التالية" : "Shipping calculated at checkout",
    total: isRTL ? "الإجمالي" : "Total",
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push(`/${lang}/checkout`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a1a1a] tracking-tight mb-6 md:mb-8">
          {tr.title}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <p className="text-[18px] font-bold text-[#1a1a1a] mb-2">{tr.empty}</p>
            <Link href="/" className="inline-block mt-6 px-8 py-3 bg-[#1a1a1a] text-white rounded-xl font-bold hover:bg-black transition-colors">
              {tr.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-[2]">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="relative flex items-stretch gap-4 p-4 border border-gray-100 rounded-[1.5rem] bg-white hover:border-[#E9C237]/30 hover:shadow-[0_8px_20px_rgba(233,194,55,0.06)] transition-all duration-300 group">
                    
                    {/* Remove Button */}
                    <button onClick={() => removeItem(item.id)} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors z-10`} title={isRTL ? "حذف" : "Remove"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>

                    {/* Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#FAFAF8] flex items-center justify-center p-3 shrink-0">
                      <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
                      <div className={`pr-8 ${isRTL ? "rtl:pr-0 rtl:pl-8" : ""}`}>
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a] leading-snug mb-1.5 truncate">
                          {item.title}
                        </h3>
                        <span className="inline-block text-[12px] text-[#888] font-semibold bg-gray-50 px-2 py-0.5 rounded">{item.weight}</span>
                      </div>
                      
                      <div className="mt-4 flex items-end justify-between gap-4">
                        {/* Total Price */}
                        <div>
                          <p className="text-[10px] text-[#999] font-bold uppercase mb-0.5">{isRTL ? "الإجمالي" : "Total"}</p>
                          <div className="flex items-baseline gap-1" dir="ltr">
                            <span className="text-[17px] sm:text-[20px] font-bold text-[#1a1a1a] tabular-nums leading-none">
                              {(item.priceNum * item.quantity).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                            </span>
                            <span className={`text-[11px] font-bold ${item.isSilver ? "text-[#999]" : "text-[#D4A82A]"}`}>
                              {isRTL ? "ج.م" : "EGP"}
                            </span>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-[#F7F7F8] border border-transparent group-hover:border-gray-200 rounded-lg p-1 transition-colors">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-[16px] font-bold text-[#666] hover:text-[#1a1a1a] shadow-sm transition-colors">
                            −
                          </button>
                          <span className="w-8 text-center text-[14px] font-extrabold text-[#1a1a1a]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-[16px] font-bold text-[#666] hover:text-[#1a1a1a] shadow-sm transition-colors">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex-1 w-full lg:max-w-[340px] shrink-0">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-[17px] font-bold text-[#1a1a1a] mb-5">{tr.orderSummary}</h2>
                
                <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#666] font-medium">{tr.subtotal}</span>
                    <span className="font-bold text-[#1a1a1a] tabular-nums">{totalPrice.toLocaleString()} EGP</span>
                  </div>
                  <div className="text-[12px] text-[#999] bg-[#FAFAF8] px-3 py-2.5 rounded-xl border border-gray-50 flex items-start gap-2">
                    <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>{tr.shippingCalc}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[15px] font-bold text-[#1a1a1a]">{tr.total}</span>
                  <div className="flex items-baseline gap-1" dir="ltr">
                    <span className="text-[24px] font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {totalPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[13px] font-bold text-[#D4A82A]">EGP</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:bg-black transition-all active:scale-[0.98]"
                >
                  {tr.checkout}
                  <svg className={`transition-transform rtl:rotate-180`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12" style={{ marginInlineEnd: '-1rem' }}>
            <h2 className="text-[20px] md:text-[24px] font-extrabold text-[#1a1a1a] mb-6 md:mb-8">
              {isRTL ? "منتجات قد تعجبك" : "You May Also Like"}
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {relatedProducts.map(item => {
                const priceNum = parseFloat(String(item.price).replace(/,/g, ""));
                return (
                  <div key={item.id} className="w-[145px] min-w-[145px] sm:w-auto sm:min-w-0 shrink-0 snap-start bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col group">
                    <div className="w-full h-[90px] sm:h-auto sm:aspect-square bg-[#FAFAF8] rounded-xl flex items-center justify-center p-2 mb-2.5 group-hover:bg-gray-50 transition-colors shrink-0">
                      <img src={isRealProductImage(item.image) ? item.image : (item.isSilver ? '/selver.png' : '/black-1.png')} alt={item.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <div className="flex flex-col flex-1 justify-between">
                      <div className="text-center mb-3">
                        <h3 className="text-[12px] sm:text-[14px] font-bold text-[#1a1a1a] mb-0.5 line-clamp-2 leading-tight">{item.name || item.title}</h3>
                      </div>
                      
                      <div className="mt-auto w-full flex items-center justify-between gap-1">
                        <div className="text-start flex flex-col">
                          <span className="text-[13px] sm:text-[15px] font-extrabold text-[#1a1a1a] tabular-nums leading-none mb-0.5" dir="ltr">
                            {(!isNaN(priceNum) ? priceNum : 0).toLocaleString()}
                          </span>
                          <span className={`text-[9px] font-bold ${item.isSilver ? "text-[#999]" : "text-[#D4A82A]"} leading-none`}>
                            {isRTL ? "ج.م" : "EGP"}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            addItem({
                              id: item.id,
                              title: item.name || item.title,
                              weight: String(item.weight),
                              price: item.price,
                              priceNum: isNaN(priceNum) ? 0 : priceNum,
                              image: isRealProductImage(item.image) ? item.image : (item.isSilver ? '/selver.png' : '/black-1.png'),
                              isSilver: item.isSilver,
                            }, 1);
                            setTimeout(() => window.dispatchEvent(new CustomEvent("cart-bump")), 100);
                          }}
                          className="w-8 h-8 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center hover:bg-[#C9A84C] hover:text-white hover:scale-105 transition-all shadow-sm shrink-0"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" onClick={() => setShowLoginModal(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" style={{ animation: 'fadeIn 0.2s ease' }} />
          
          {/* Modal */}
          <div 
            className="relative bg-white rounded-[2rem] p-7 sm:p-9 max-w-[380px] w-full shadow-2xl border border-gray-100 text-center"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Close button */}
            <button 
              onClick={() => setShowLoginModal(false)} 
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-[#eee] transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-[#FFF8E7] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">
              {isRTL ? "سجّل دخولك أولاً" : "Login Required"}
            </h3>

            {/* Description */}
            <p className="text-[14px] text-[#888] leading-relaxed mb-7 max-w-[280px] mx-auto">
              {isRTL 
                ? "عشان تكمل عملية الشراء، لازم تسجّل دخولك الأول أو تعمل حساب جديد."
                : "To complete your purchase, please log in to your account or create a new one."}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href={`/${lang}/login?returnTo=/${lang}/checkout`}
                className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-black transition-all active:scale-[0.98]"
              >
                {isRTL ? "تسجيل الدخول" : "Log In"}
                <svg className="rtl:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 text-[14px] font-semibold text-[#888] hover:text-[#555] transition-colors cursor-pointer"
              >
                {isRTL ? "متابعة التسوق" : "Continue Shopping"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
