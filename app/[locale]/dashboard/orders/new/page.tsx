"use client";
import { useState, useEffect } from "react";
import { useLang } from "../../../../i18n/LangContext";
import { getLiveProducts, getSilverLiveProducts, getBranches, validateCart, submitOrder, getCurrentPrices, getProfile, updateProfile, getStates, getCities } from "../../../../../lib/api";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "../../../../../components/ui/searchable-select";

/** Returns true if the image URL is a real product image (not a server placeholder) */
function isRealProductImage(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes("placeholder-image") || url.includes("placeholder")) return false;
  return true;
}

const GOLD_FALLBACK = "/black-1.png";
const SILVER_FALLBACK = "/selver.png";

export default function NewOrderPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupBranch, setPickupBranch] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  const [apiStates, setApiStates] = useState<any[]>([]);
  const [apiCities, setApiCities] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFundError, setShowFundError] = useState(false);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [cartTotal, setCartTotal] = useState<number | null>(null);
  
  const [branches, setBranches] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [silverProducts, setSilverProducts] = useState<any[]>([]);
  const [productTab, setProductTab] = useState<"gold" | "silver">("gold");
  const [cart, setCart] = useState<{ id: string | number; quantity: number }[]>([]);
  const [prices, setPrices] = useState<any>(null);
  const [validationData, setValidationData] = useState<any>(null);

  useEffect(() => {
    getCurrentPrices(lang).then(res => {
      if (res.success && res.prices) {
        setPrices(res.prices);
      }
    });
    getBranches(lang).then(res => {
      if (res.success) {
        const list = Array.isArray(res.data?.branches)
          ? res.data.branches
          : Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setBranches(list);
      }
    });
    getLiveProducts(lang).then(res => {
      if (res.success) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.products)
          ? res.products
          : [];
        setProducts(list);
      }
    });
    getSilverLiveProducts(lang).then(res => {
      if (res.success) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setSilverProducts(list);
      }
    });
    getProfile(lang).then(res => {
      if (res.success && res.data) {
        setProfile(res.data);
        if (res.data.mobile) setMobile(res.data.mobile);
        if (res.data.address?.address) setAddress(res.data.address.address);
        if (res.data.address?.city) setCity(res.data.address.city);
        if (res.data.address?.state) setState(res.data.address.state);
        if (res.data.cash_wallet) setCashBalance(Number(res.data.cash_wallet));
      }
    });
    getStates(lang).then(res => {
      if (res.success) {
        setApiStates(res.data?.data || res.data || []);
      }
    });
  }, [lang]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!state) {
      setApiCities([]);
      return;
    }
    const stateObj = apiStates.find(s => s.name === state || s.id == state);
    const stateId = stateObj ? stateObj.id : state;
    
    getCities(stateId, lang).then(res => {
      if (res.success) {
        setApiCities(res.data?.data || res.data || []);
      }
    });
  }, [state, apiStates, lang]);

  const updateCart = (id: string | number, qty: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === id);
      if (existing) {
        if (qty <= 0) return prev.filter(p => p.id !== id);
        return prev.map(p => p.id === id ? { ...p, quantity: qty } : p);
      }
      if (qty > 0) return [...prev, { id, quantity: qty }];
      return prev;
    });
  };

  const tr = {
    title: isRTL ? "طلب جديد" : "New Order",
    subtitle: isRTL ? "اطلب سبائكك للتوصيل أو الاستلام" : "Order your bullion for delivery or pickup",
    products: isRTL ? "اختر المنتجات" : "Select Products",
    noProducts: isRTL ? "سيتم تحميل المنتجات المتاحة" : "Available products will be loaded",
    address: isRTL ? "عنوان التوصيل" : "Delivery address",
    state: isRTL ? "المحافظة" : "State / Region",
    city: isRTL ? "المدينة" : "City",
    mobile: isRTL ? "رقم الموبايل" : "Mobile number",
    notes: isRTL ? "ملاحظات (اختياري)" : "Notes (optional)",
    delivery: isRTL ? "توصيل" : "Delivery",
    pickup: isRTL ? "استلام من فرع" : "Branch pickup",
    selectBranch: isRTL ? "اختر الفرع" : "Select branch",
    validateCart: isRTL ? "مراجعة الطلب" : "Review Order",
    submitOrder: isRTL ? "تأكيد الطلب" : "Confirm Order",
    total: isRTL ? "الإجمالي" : "Total",
    back: isRTL ? "تعديل الطلب" : "Edit order",
    cooldown: isRTL ? "يرجى الانتظار 5 دقائق قبل تقديم طلب جديد" : "Please wait 5 minutes before placing a new order",
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

  const getOrderPayload = () => ({
    products: cart.map(p => ({ id: p.id, qty: p.quantity })),
    delivery_method: deliveryMethod,
    address: deliveryMethod === "delivery" ? address : undefined,
    state: deliveryMethod === "delivery" ? state : undefined,
    city: deliveryMethod === "delivery" ? city : undefined,
    mobile: mobile,
    pickup_branch_id: deliveryMethod === "pickup" ? pickupBranch : undefined,
    notes
  });

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (cart.length === 0) {
      setError(isRTL ? "يرجى اختيار منتج واحد على الأقل" : "Please select at least one product");
      return;
    }
    setLoading(true);
    const res = await validateCart(getOrderPayload(), lang);
    if (res.success && res.data) {
      if (cashBalance < res.data.total) {
        setShowFundError(true);
        setLoading(false);
        return;
      }
      setCartTotal(res.data.total);
      setValidationData(res.data);
      setStep("confirm");
    } else {
      setError(res.message || "Error validating cart");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (deliveryMethod === "delivery" && profile) {
      try {
        await updateProfile({
          firstname: profile.firstname || "",
          lastname: profile.lastname || "",
          address,
          state,
          city
        }, lang);
      } catch (e) {
        console.error("Failed to update profile", e);
      }
    }

    const res = await submitOrder(getOrderPayload(), lang);
    if (res.success) {
      setSuccess(isRTL ? "تم تأكيد الطلب بنجاح" : "Order confirmed successfully");
    } else {
      if (res.message?.toLowerCase().includes("insufficient funds")) {
        setShowFundError(true);
      } else if (res.message?.toLowerCase().includes("cooldown")) {
        setError(tr.cooldown);
      } else {
        setError(res.message || "Error submitting order");
      }
    }
    setLoading(false);
  };



  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
          <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
        </div>

        {/* Live Prices */}
        {prices && (
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-[#f0f0f0] shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#888]">24K</span>
              <span className="text-[15px] font-extrabold text-[#1a1a1a]">{prices.sell_24?.toLocaleString()} <span className="text-[10px] text-[#C9A84C]">EGP</span></span>
            </div>
            <div className="w-[1px] h-8 bg-[#f0f0f0]"></div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#888]">21K</span>
              <span className="text-[15px] font-extrabold text-[#1a1a1a]">{prices.sell_21?.toLocaleString()} <span className="text-[10px] text-[#C9A84C]">EGP</span></span>
            </div>
            <div className="w-[1px] h-8 bg-[#f0f0f0]"></div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#888]">18K</span>
              <span className="text-[15px] font-extrabold text-[#1a1a1a]">{prices.sell_18?.toLocaleString()} <span className="text-[10px] text-[#C9A84C]">EGP</span></span>
            </div>
          </div>
        )}
      </div>

      {step === "select" ? (
      <div className="bg-white rounded-2xl border border-[#f0f0f0] p-6 mx-2">
          <form className="flex flex-col gap-6" onSubmit={handleValidate}>
            {/* Products section */}
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-semibold text-[#888]">{tr.products}</label>
            {/* Product tabs */}
              <div className="flex gap-2 bg-[#f5f5f5] p-1 rounded-xl w-fit mb-1">
                <button type="button" onClick={() => setProductTab("gold")} className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${productTab === "gold" ? "bg-white shadow-sm text-[#C9A84C]" : "text-[#999]"}`}>
                  {isRTL ? "ذهب" : "Gold"}
                </button>
                <button type="button" onClick={() => setProductTab("silver")} className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${productTab === "silver" ? "bg-white shadow-sm text-[#9CA3AF]" : "text-[#999]"}`}>
                  {isRTL ? "فضة" : "Silver"}
                </button>
              </div>
              {(productTab === "gold" ? products : silverProducts).length === 0 ? (
                <div className="border-2 border-dashed border-[#eee] rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#f7f7f7] flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11V3H8v8H2l10 10 10-10h-6z"/></svg>
                  </div>
                  <p className="text-[13px] text-[#999]">{tr.noProducts}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {(productTab === "gold" ? products : silverProducts).map(p => {
                      const qty = cart.find(item => item.id === p.id)?.quantity || 0;
                      const unitPrice = Number(p.price_amount ?? String(p.price).replace(/,/g, "") ?? 0);
                      return (
                        <div key={p.id} onClick={() => updateCart(p.id, qty + 1)}
                          className={`relative rounded-xl border-2 p-2.5 cursor-pointer transition-all duration-200 select-none ${qty > 0 ? "border-[#C9A84C] bg-[#C9A84C]/5 shadow-sm" : "border-[#f0f0f0] bg-white hover:border-[#C9A84C]/40 hover:shadow-sm"}`}>
                          {/* qty badge */}
                          {qty > 0 && (
                            <div className="absolute top-1.5 end-1.5 w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center">
                              <span className="text-[10px] font-extrabold text-white">{qty}</span>
                            </div>
                          )}
                          {/* image */}
                          <div className="w-full aspect-square rounded-lg bg-[#f7f7f7] flex items-center justify-center mb-2 overflow-hidden">
                            {isRealProductImage(p.image) ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <img src={p.metal_type === "silver" ? SILVER_FALLBACK : GOLD_FALLBACK} alt={p.name} className="w-full h-full object-contain rounded-lg p-2" />
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-[#1a1a1a] leading-snug mb-1 line-clamp-2">{p.name || p.title}</p>
                          <div className="flex items-center gap-1 mb-1">
                            {p.weight && <span className="text-[9px] text-[#999] bg-[#f5f5f5] px-1 py-0.5 rounded font-medium">{p.weight_display || p.weight}g</span>}
                            {p.karats && <span className="text-[9px] text-[#999] bg-[#f5f5f5] px-1 py-0.5 rounded font-medium">{p.karats}K</span>}
                          </div>
                          <p className="text-[11px] font-semibold text-[#C9A84C]">{p.price} EGP</p>

                          {qty > 0 && (
                            <div className="flex items-center gap-1 mt-2" onClick={e => e.stopPropagation()}>
                              <button type="button" onClick={() => updateCart(p.id, qty - 1)}
                                className="w-6 h-6 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#888] hover:border-red-300 hover:text-red-400 transition-colors font-bold text-[14px]">
                                −
                              </button>
                              <span className="flex-1 text-center text-[11px] font-extrabold text-[#1a1a1a]">{qty}</span>
                              <button type="button" onClick={() => updateCart(p.id, qty + 1)}
                                className="w-6 h-6 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors font-bold text-[14px]">
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Cart total */}
                  {cart.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#1a1a1a] mt-1">
                      <span className="text-[13px] font-semibold text-white/60">{tr.total}</span>
                      <span className="text-[16px] font-extrabold text-[#C9A84C]">
                        {cart.reduce((sum, item) => {
                          const allProducts = [...products, ...silverProducts];
                          const p = allProducts.find(pr => pr.id === item.id);
                          const price = Number(p?.price_amount ?? String(p?.price ?? "0").replace(/,/g, ""));
                          return sum + (price * item.quantity);
                        }, 0).toLocaleString()} EGP
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Delivery method */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{isRTL ? "طريقة الاستلام" : "Delivery method"}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setDeliveryMethod("delivery")} className={`flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${deliveryMethod === "delivery" ? "bg-[#1a1a1a] text-white shadow-md" : "bg-[#F7F7F8] text-[#888] hover:bg-[#eee]"}`}>
                  {tr.delivery}
                </button>
                <button type="button" onClick={() => setDeliveryMethod("pickup")} className={`flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${deliveryMethod === "pickup" ? "bg-[#1a1a1a] text-white shadow-md" : "bg-[#F7F7F8] text-[#888] hover:bg-[#eee]"}`}>
                  {tr.pickup}
                </button>
              </div>
            </div>

            {/* Conditional fields */}
            {deliveryMethod === "delivery" ? (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.mobile}</label>
                  <div className={inputCls}><input type="tel" dir="ltr" value={mobile} onChange={e => setMobile(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" placeholder="01xxxxxxxxx" required /></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#888]">{tr.state}</label>
                    <SearchableSelect 
                      isRTL={isRTL}
                      value={state}
                      onValueChange={(val) => { setState(val); setCity(""); }}
                      placeholder={`${tr.state}...`}
                      options={apiStates.map(s => ({ value: s.name || String(s.id), label: s.name }))}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#888]">{tr.city}</label>
                    <SearchableSelect 
                      isRTL={isRTL}
                      disabled={!state}
                      value={city}
                      onValueChange={setCity}
                      placeholder={`${tr.city}...`}
                      options={apiCities.map(c => ({ value: c.name || String(c.id), label: c.name }))}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.address}</label>
                  <div className={inputCls}><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" placeholder={isRTL ? "أدخل العنوان الكامل" : "Enter full address"} required /></div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.mobile}</label>
                  <div className={inputCls}><input type="tel" dir="ltr" value={mobile} onChange={e => setMobile(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" placeholder="01xxxxxxxxx" required /></div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#888]">{tr.selectBranch}</label>
                  <SearchableSelect 
                    isRTL={isRTL}
                    value={pickupBranch}
                    onValueChange={setPickupBranch}
                    placeholder={`${tr.selectBranch}...`}
                    options={branches.map(b => ({ value: String(b.id), label: b.full_name || b.name, sub: b.city }))}
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.notes}</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus:border-[#E9C237]/60 focus:bg-white text-[15px] text-[#1a1a1a] outline-none font-medium resize-none transition-all duration-200" placeholder={isRTL ? "ملاحظات إضافية..." : "Additional notes..."} />
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}

            <button type="submit" disabled={loading || cart.length === 0} className="w-full py-4 font-bold text-[15px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', color: 'white' }}>
              {tr.validateCart}
            </button>
          </form>
        </div>
      ) : (
        /* Confirmation Step */
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "مراجعة تفاصيل الطلب" : "Review Order Details"}</h2>
            <p className="text-[14px] text-[#999]">{isRTL ? "يرجى مراجعة تفاصيل طلبك قبل التأكيد" : "Please review your order details before confirming"}</p>
          </div>

          {/* Products List */}
          <div className="bg-[#fcfcfc] rounded-2xl border border-[#f5f5f5] p-5 mb-6">
            <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-4 pb-3 border-b border-[#f0f0f0]">{isRTL ? "المنتجات" : "Products"}</h3>
            <div className="flex flex-col gap-4">
              {validationData?.products?.map((p: any, idx: number) => {
                const originalProduct = [...products, ...silverProducts].find(pr => pr.id === p.id);
                const rawImageUrl = originalProduct?.image || p.image;
                const imageUrl = isRealProductImage(rawImageUrl) ? rawImageUrl : (originalProduct?.metal_type === "silver" ? SILVER_FALLBACK : GOLD_FALLBACK);
                return (
                  <div key={`${p.id}-${idx}`} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#f0f0f0] flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={imageUrl} alt={p.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#1a1a1a] truncate mb-0.5">{p.name}</p>
                      <p className="text-[11px] text-[#888] font-semibold">{p.weight}g <span className="text-[#ccc] mx-1">•</span> <span className="text-[#C9A84C]">{p.qty}x</span></p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-[13px] font-extrabold text-[#1a1a1a]">{Number(p.price || 0).toLocaleString()} <span className="text-[9px] text-[#888]">EGP</span></p>
                      <p className="text-[10px] text-[#999] font-medium mt-0.5">{isRTL ? "مصنعية:" : "Service:"} {p.service} EGP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-[#fcfcfc] rounded-2xl border border-[#f5f5f5] p-5 mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#888] font-semibold">{isRTL ? "سعر الذهب" : "Gold Price"}</span>
                <span className="font-bold text-[#1a1a1a]">{Number(validationData?.gold_price || 0).toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#888] font-semibold">{isRTL ? "إجمالي المصنعية" : "Total Service"}</span>
                <span className="font-bold text-[#1a1a1a]">{Number(validationData?.service || 0).toLocaleString()} EGP</span>
              </div>
              {deliveryMethod === "delivery" && validationData?.shipping > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#888] font-semibold">{isRTL ? "الشحن" : "Shipping"}</span>
                  <span className="font-bold text-[#1a1a1a]">{Number(validationData?.shipping || 0).toLocaleString()} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-[13px]">
                <span className="text-[#888] font-semibold">{isRTL ? "إجمالي الوزن" : "Total Weight"}</span>
                <span className="font-bold text-[#1a1a1a]">{validationData?.weight}g</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#f0f0f0] flex justify-between items-center">
              <span className="text-[15px] font-bold text-[#1a1a1a]">{tr.total}</span>
              <span className="text-[22px] font-extrabold text-[#C9A84C]">
                {Number(
                  (deliveryMethod === "pickup" && validationData?.shipping > 0)
                    ? (validationData.total - validationData.shipping)
                    : (validationData?.total || cartTotal || 0)
                ).toLocaleString()} 
                <span className="text-[12px] font-bold">EGP</span>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("select")} disabled={loading || !!success} className="flex-1 py-3.5 rounded-xl text-[14px] font-bold bg-[#F7F7F8] text-[#888] hover:bg-[#eee] transition-all disabled:opacity-50">{tr.back}</button>
            <button onClick={handleSubmit} disabled={loading || !!success} className="flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all shadow-md active:scale-[0.99] disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 100%)', color: 'white' }}>{tr.submitOrder}</button>
          </div>
          {error && !success && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium mt-4">{error}</div>}
        </div>
      )}

      {/* Insufficient Funds Modal */}
      {showFundError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "الرصيد غير كافٍ" : "Insufficient Funds"}</h3>
              <p className="text-[14px] text-[#888] font-medium mb-8">
                {isRTL ? "عذراً، رصيدك الحالي لا يكفي لإتمام هذه المعاملة. يرجى إيداع مبلغ في المحفظة للمتابعة." : "Sorry, your current balance is insufficient to complete this transaction. Please deposit funds to continue."}
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => router.push(`/${lang}/dashboard/deposit`)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-white rounded-xl font-bold text-[15px] shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_6px_25px_rgba(201,168,76,0.4)] transition-all active:scale-[0.98]"
                >
                  {isRTL ? "إيداع الآن" : "Deposit Now"}
                </button>
                <button 
                  onClick={() => setShowFundError(false)}
                  className="w-full py-3.5 bg-[#f5f5f5] text-[#1a1a1a] rounded-xl font-bold text-[15px] hover:bg-[#eee] transition-all active:scale-[0.98]"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "نجاح" : "Success"}</h3>
              <p className="text-[14px] text-[#888] font-medium mb-8">
                {success}
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => router.push(`/${lang}/dashboard/transactions?filter=order`)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-bold text-[15px] shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98]"
                >
                  {isRTL ? "متابعة الطلب" : "Track Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
