"use client";
import { useState, useEffect } from "react";
import { useLang } from "../../i18n/LangContext";
import { useCart } from "../../cart/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  validateCart,
  submitOrder,
  getProfile,
  updateProfile,
  getBranches,
  getStates,
  getCities,
} from "../../../lib/api";
import { SearchableSelect } from "../../../components/ui/searchable-select";

export default function CheckoutPage() {
  const { isRTL, lang } = useLang();
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Form State
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupBranch, setPickupBranch] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  const [apiStates, setApiStates] = useState<any[]>([]);
  const [apiCities, setApiCities] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [profileData, setProfileData] = useState<any>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFundError, setShowFundError] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [validationData, setValidationData] = useState<any>(null);
  const [cartTotalAfterValidation, setCartTotalAfterValidation] = useState<number | null>(null);

  useEffect(() => {
    const token = typeof document !== "undefined" ? document.cookie.split(";").find((c) => c.trim().startsWith("gct_token=")) : null;
    if (!token) {
      router.push(`/${lang}/login?returnTo=/${lang}/checkout`);
      return;
    }
    
    setIsLoggedIn(true);
    getProfile(lang).then((res) => {
      if (res.success && res.data) {
        setProfileData(res.data);
        if (res.data.mobile) setMobile(res.data.mobile);
        if (res.data.address?.address) setAddress(res.data.address.address);
        if (res.data.address?.city) setCity(res.data.address.city);
        if (res.data.address?.state) setState(res.data.address.state);
        if (res.data.cash_wallet) setCashBalance(Number(res.data.cash_wallet));
      }
    });
    getBranches(lang).then((res) => {
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
    getStates(lang).then((res) => {
      if (res.success) {
        setApiStates(res.data?.data || res.data || []);
      }
    });
    setLoadingAuth(false);
  }, [lang, router]);

  useEffect(() => {
    if (!state) {
      setApiCities([]);
      return;
    }
    const stateObj = apiStates.find((s) => s.name === state || s.id == state);
    const stateId = stateObj ? stateObj.id : state;

    getCities(stateId, lang).then((res) => {
      if (res.success) {
        setApiCities(res.data?.data || res.data || []);
      }
    });
  }, [state, apiStates, lang]);

  useEffect(() => {
    if (!loadingAuth && items.length === 0 && !success) {
      router.push(`/${lang}/cart`);
    }
  }, [items.length, loadingAuth, success, lang, router]);

  const tr = {
    title: isRTL ? "إتمام الطلب" : "Checkout",
    checkoutInfo: isRTL ? "معلومات التوصيل" : "Delivery Information",
    total: isRTL ? "الإجمالي" : "Total",
    address: isRTL ? "عنوان التوصيل" : "Delivery address",
    state: isRTL ? "المحافظة" : "State / Region",
    city: isRTL ? "المدينة" : "City",
    mobile: isRTL ? "رقم الموبايل" : "Mobile number",
    notes: isRTL ? "ملاحظات (اختياري)" : "Notes (optional)",
    delivery: isRTL ? "توصيل" : "Delivery",
    pickup: isRTL ? "استلام من فرع" : "Branch pickup",
    selectBranch: isRTL ? "اختر الفرع" : "Select branch",
    submitOrder: isRTL ? "تأكيد الطلب" : "Confirm Order",
    back: isRTL ? "تعديل المعلومات" : "Edit Details",
    cooldown: isRTL ? "يرجى الانتظار 5 دقائق قبل تقديم طلب جديد" : "Please wait 5 minutes before placing a new order",
    reviewOrder: isRTL ? "مراجعة تفاصيل الطلب" : "Review Order Details",
    reviewOrderDesc: isRTL ? "يرجى مراجعة تفاصيل طلبك قبل التأكيد" : "Please review your order details before confirming",
    products: isRTL ? "المنتجات" : "Products",
    orderSummary: isRTL ? "ملخص الطلب" : "Order Summary",
    subtotal: isRTL ? "المجموع الفرعي" : "Subtotal",
  };

  const inputCls =
    "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";

  const getOrderPayload = () => ({
    products: items.map((p) => ({ id: p.id, qty: p.quantity })),
    delivery_method: deliveryMethod,
    address: deliveryMethod === "delivery" ? address : undefined,
    state: deliveryMethod === "delivery" ? state : undefined,
    city: deliveryMethod === "delivery" ? city : undefined,
    mobile: mobile,
    pickup_branch_id: deliveryMethod === "pickup" ? pickupBranch : undefined,
    notes,
  });

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      router.push(`/${lang}/cart`);
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
      setCartTotalAfterValidation(res.data.total);
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
    const res = await submitOrder(getOrderPayload(), lang);
    if (res.success) {
      setSuccess(isRTL ? "تم تأكيد الطلب بنجاح" : "Order confirmed successfully");
      clearCart();
      // Save address to profile so user doesn't have to enter it again
      if (deliveryMethod === "delivery" && (address || state || city || mobile)) {
        updateProfile({
          firstname: profileData?.firstname || profileData?.first_name || "",
          lastname: profileData?.lastname || profileData?.last_name || "",
          address,
          state,
          city,
          mobile,
        }, lang).catch(() => {});
      }
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

  if (loadingAuth || (items.length === 0 && !success)) {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-28 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#1a1a1a] tracking-tight mb-6 md:mb-8">
          {tr.title}
        </h1>

        {step === "form" ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="flex-[2]">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100">
                <h2 className="text-[16px] font-bold text-[#1a1a1a] mb-5">{tr.checkoutInfo}</h2>
                <form onSubmit={handleValidate} className="flex flex-col gap-5">
                  {/* Delivery method */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-semibold text-[#1a1a1a]">{isRTL ? "طريقة الاستلام" : "Delivery method"}</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setDeliveryMethod("delivery")} className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-200 border-2 ${deliveryMethod === "delivery" ? "border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-md" : "border-gray-100 bg-white text-[#666] hover:bg-gray-50"}`}>
                        {tr.delivery}
                      </button>
                      <button type="button" onClick={() => setDeliveryMethod("pickup")} className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-200 border-2 ${deliveryMethod === "pickup" ? "border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-md" : "border-gray-100 bg-white text-[#666] hover:bg-gray-50"}`}>
                        {tr.pickup}
                      </button>
                    </div>
                  </div>

                  {/* Conditional fields */}
                  {deliveryMethod === "delivery" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[#888]">{tr.mobile}</label>
                        <div className={`${inputCls}`}><input type="tel" dir="ltr" value={mobile} onChange={e => setMobile(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" placeholder="01xxxxxxxxx" required /></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className={`${inputCls}`}><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" placeholder={isRTL ? "أدخل العنوان الكامل" : "Enter full address"} required /></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-[#888]">{tr.mobile}</label>
                        <div className={`${inputCls}`}><input type="tel" dir="ltr" value={mobile} onChange={e => setMobile(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium" placeholder="01xxxxxxxxx" required /></div>
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
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus:border-[#E9C237]/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] text-[15px] text-[#1a1a1a] outline-none font-medium resize-none transition-all duration-200" placeholder={isRTL ? "ملاحظات إضافية..." : "Additional notes..."} />
                  </div>

                  {error && <div className="px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] font-medium">{error}</div>}

                  <button type="submit" disabled={loading} className="w-full mt-2 py-3.5 font-bold text-[14px] rounded-2xl transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:bg-black active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: '#1a1a1a', color: 'white' }}>
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {isRTL ? "جارٍ المراجعة..." : "Reviewing..."}
                      </>
                    ) : (
                      <>
                        {tr.reviewOrder}
                        <svg className={`transition-transform rtl:rotate-180`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="flex-1 w-full lg:max-w-[340px] shrink-0">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100 sticky top-28">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-[17px] font-bold text-[#1a1a1a]">{tr.orderSummary}</h2>
                  <Link href={`/${lang}/cart`} className="text-[13px] font-bold text-[#C9A84C] hover:text-[#b89842] transition-colors">
                    {isRTL ? "تعديل" : "Edit"}
                  </Link>
                </div>
                
                {/* Miniature items list */}
                <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-gray-100 max-h-[300px] overflow-y-auto pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] flex items-center justify-center p-1.5 shrink-0">
                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-[#1a1a1a] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#888] font-semibold">{item.weight} x {item.quantity}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-[13px] font-extrabold text-[#1a1a1a] tabular-nums">{(item.priceNum * item.quantity).toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-[#D4A82A]">{isRTL ? "ج.م" : "EGP"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#666] font-medium">{tr.subtotal}</span>
                    <span className="font-bold text-[#1a1a1a] tabular-nums">{totalPrice.toLocaleString()} EGP</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-[#1a1a1a]">{tr.total}</span>
                  <div className="flex items-baseline gap-1" dir="ltr">
                    <span className="text-[24px] font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {totalPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[13px] font-bold text-[#D4A82A]">EGP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : step === "confirm" ? (
          /* Confirmation Step - same layout as form */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Confirmation Content - replaces the delivery form */}
            <div className="flex-[2]">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-[22px] font-extrabold text-[#1a1a1a] mb-2">{tr.reviewOrder}</h2>
                  <p className="text-[13px] text-[#999]">{tr.reviewOrderDesc}</p>
                </div>

                {/* Products List */}
                <div className="bg-[#FAFAF8] rounded-[1.5rem] border border-[#f5f5f5] p-4 md:p-5 mb-5">
                  <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-3 pb-2.5 border-b border-[#f0f0f0]">{tr.products}</h3>
                  <div className="flex flex-col gap-4">
                    {validationData?.products?.map((p: any, idx: number) => {
                      const originalProduct = items.find(pr => pr.id === p.id);
                      const imageUrl = originalProduct?.image || p.image;
                      return (
                        <div key={`${p.id}-${idx}`} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white border border-[#f0f0f0] flex items-center justify-center shrink-0 overflow-hidden p-1">
                            {imageUrl ? <img src={imageUrl} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" /> : <div className="w-5 h-5 bg-[#C9A84C]/20 rounded-full" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-[#1a1a1a] truncate mb-0.5">{p.name}</p>
                            <p className="text-[12px] text-[#888] font-semibold">{p.weight}g <span className="text-[#ccc] mx-1">•</span> <span className="text-[#C9A84C] font-bold">{p.qty}x</span></p>
                          </div>
                          <div className="text-end shrink-0">
                            <p className="text-[14px] font-extrabold text-[#1a1a1a]">{Number(p.price || 0).toLocaleString()} <span className="text-[10px] text-[#888]">EGP</span></p>
                            <p className="text-[11px] text-[#999] font-medium mt-0.5">{isRTL ? "مصنعية:" : "Service:"} {p.service} EGP</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-[#FAFAF8] rounded-[1.5rem] border border-[#f5f5f5] p-4 md:p-5 mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#888] font-semibold">{isRTL ? "سعر الذهب" : "Gold Price"}</span>
                      <span className="font-bold text-[#1a1a1a] tabular-nums">{Number(validationData?.gold_price || 0).toLocaleString()} EGP</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#888] font-semibold">{isRTL ? "إجمالي المصنعية" : "Total Service"}</span>
                      <span className="font-bold text-[#1a1a1a] tabular-nums">{Number(validationData?.service || 0).toLocaleString()} EGP</span>
                    </div>
                    {deliveryMethod === "delivery" && validationData?.shipping > 0 && (
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#888] font-semibold">{isRTL ? "الشحن" : "Shipping"}</span>
                        <span className="font-bold text-[#1a1a1a] tabular-nums">{Number(validationData?.shipping || 0).toLocaleString()} EGP</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#888] font-semibold">{isRTL ? "إجمالي الوزن" : "Total Weight"}</span>
                      <span className="font-bold text-[#1a1a1a]">{validationData?.weight}g</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#f0f0f0] flex justify-between items-center">
                    <span className="text-[15px] font-bold text-[#1a1a1a]">{tr.total}</span>
                    <span className="text-[24px] font-extrabold text-[#C9A84C] tabular-nums">
                      {Number(
                        (deliveryMethod === "pickup" && validationData?.shipping > 0)
                          ? (validationData.total - validationData.shipping)
                          : (validationData?.total || cartTotalAfterValidation || 0)
                      ).toLocaleString()}
                      <span className="text-[13px] font-bold ms-1">EGP</span>
                    </span>
                  </div>
                </div>

                {error && !success && (
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-red-50/80 border border-red-200/60 mb-5">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <p className="text-[13px] font-semibold text-red-700 leading-snug">{error}</p>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button onClick={() => setStep("form")} disabled={loading || !!success} className="sm:flex-1 py-3.5 px-5 rounded-2xl text-[14px] font-bold text-[#555] hover:text-[#1a1a1a] bg-[#f5f5f5] hover:bg-[#ebebeb] transition-all disabled:opacity-50 border border-[#e8e8e8] active:scale-[0.98]">
                    {tr.back}
                  </button>
                  <button onClick={handleSubmit} disabled={loading || !!success} className="sm:flex-[2] py-4 px-6 rounded-2xl text-[14px] font-bold transition-all shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-black text-white">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {isRTL ? "جارٍ المعالجة..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        {tr.submitOrder}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar - same as form step */}
            <div className="flex-1 w-full lg:max-w-[340px] shrink-0">
              <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-gray-100 sticky top-28">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-[17px] font-bold text-[#1a1a1a]">{tr.orderSummary}</h2>
                  <Link href={`/${lang}/cart`} className="text-[13px] font-bold text-[#C9A84C] hover:text-[#b89842] transition-colors">
                    {isRTL ? "تعديل" : "Edit"}
                  </Link>
                </div>
                
                <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-gray-100 max-h-[300px] overflow-y-auto pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] flex items-center justify-center p-1.5 shrink-0">
                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-[#1a1a1a] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#888] font-semibold">{item.weight} x {item.quantity}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-[13px] font-extrabold text-[#1a1a1a] tabular-nums">{(item.priceNum * item.quantity).toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-[#D4A82A]">{isRTL ? "ج.م" : "EGP"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#666] font-medium">{tr.subtotal}</span>
                    <span className="font-bold text-[#1a1a1a] tabular-nums">{totalPrice.toLocaleString()} EGP</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-[#1a1a1a]">{tr.total}</span>
                  <div className="flex items-baseline gap-1" dir="ltr">
                    <span className="text-[24px] font-extrabold text-[#1a1a1a] tabular-nums leading-none">
                      {totalPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[13px] font-bold text-[#D4A82A]">EGP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Insufficient Funds Modal */}
      {showFundError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "الرصيد غير كافٍ" : "Insufficient Funds"}</h3>
              <p className="text-[14px] text-[#888] font-medium mb-8 leading-relaxed">
                {isRTL ? "عذراً، رصيدك الحالي لا يكفي لإتمام هذه المعاملة. يرجى إيداع مبلغ في المحفظة للمتابعة." : "Sorry, your current balance is insufficient to complete this transaction. Please deposit funds to continue."}
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => router.push(`/${lang}/dashboard/deposit`)}
                  className="w-full py-4 bg-[#1a1a1a] text-white rounded-xl font-bold text-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-black transition-all active:scale-[0.98]"
                >
                  {isRTL ? "إيداع الآن" : "Deposit Now"}
                </button>
                <button 
                  onClick={() => setShowFundError(false)}
                  className="w-full py-4 bg-[#f5f5f5] text-[#1a1a1a] rounded-xl font-bold text-[15px] hover:bg-[#eee] transition-all active:scale-[0.98]"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#1a1a1a] mb-2">{isRTL ? "تم تأكيد طلبك بنجاح!" : "Order Confirmed!"}</h3>
              <p className="text-[14px] text-[#888] font-medium mb-8 leading-relaxed">
                {isRTL ? "تم استلام طلبك وهو الآن قيد المعالجة. يمكنك متابعة حالة الطلب من خلال لوحة التحكم." : "Your order has been received and is now being processed. You can track the status in your dashboard."}
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <Link 
                  href={`/${lang}/dashboard/transactions?filter=order`}
                  className="w-full py-4 bg-[#1a1a1a] text-white rounded-xl font-bold text-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-black transition-all active:scale-[0.98] text-center"
                >
                  {isRTL ? "متابعة الطلب" : "Track Order"}
                </Link>
                <Link 
                  href="/"
                  className="w-full py-4 bg-[#f5f5f5] text-[#1a1a1a] rounded-xl font-bold text-[15px] hover:bg-[#eee] transition-all active:scale-[0.98] text-center"
                >
                  {isRTL ? "العودة للرئيسية" : "Back to Home"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
