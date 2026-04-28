"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "../../../i18n/LangContext";
import { getProfile, updateProfile, updateAvatar, getStates, getCities } from "../../../../lib/api";
import { SearchableSelect } from "../../../../components/ui/searchable-select";

export default function ProfilePage() {
  const { isRTL, lang } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [apiStates, setApiStates] = useState<any[]>([]);
  const [apiCities, setApiCities] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // track original values to detect changes
  const [original, setOriginal] = useState({ firstname: "", lastname: "", address: "", city: "", state: "" });

  const fetchProfile = async () => {
    const res = await getProfile(lang);
    const d = res.data;
    if (d) {
      setProfile(d);
      const vals = {
        firstname: d.firstname || "",
        lastname: d.lastname || "",
        address: d.address?.address || "",
        state: d.address?.state || "",
        city: d.address?.city || "",
      };
      setFirstname(vals.firstname);
      setLastname(vals.lastname);
      setAddress(vals.address);
      setState(vals.state);
      setCity(vals.city);
      setOriginal({ ...vals, state: vals.state });

      // Fetch states
      const statesRes = await getStates(lang);
      let loadedStates: any[] = [];
      if (statesRes.success) {
        loadedStates = statesRes.data?.data || statesRes.data || [];
        setApiStates(loadedStates);
      }

      // Auto-detect state if city exists but state does not
      if (vals.city && !vals.state) {
        const allCitiesRes = await getCities("", lang);
        if (allCitiesRes.success) {
          const all = allCitiesRes.data?.data || allCitiesRes.data || [];
          const foundCity = all.find((c: any) => c.name === vals.city);
          if (foundCity && foundCity.state_id) {
            const foundState = loadedStates.find(s => s.id == foundCity.state_id);
            if (foundState) {
              setState(foundState.name || String(foundState.id));
              setOriginal(prev => ({ ...prev, state: foundState.name || String(foundState.id) }));
            }
          }
        }
      }
    }
  };

  const isDirty =
    firstname !== original.firstname ||
    lastname !== original.lastname ||
    address !== original.address ||
    state !== original.state ||
    city !== original.city;

  useEffect(() => { fetchProfile(); }, [lang]);

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

  const tr = {
    title: isRTL ? "الملف الشخصي" : "Profile",
    subtitle: isRTL ? "إدارة معلوماتك الشخصية" : "Manage your personal information",
    firstname: isRTL ? "الاسم الأول" : "First name",
    lastname: isRTL ? "الاسم الأخير" : "Last name",
    email: isRTL ? "البريد الإلكتروني" : "Email",
    mobile: isRTL ? "رقم الهاتف" : "Phone",
    address: isRTL ? "العنوان" : "Address",
    state: isRTL ? "المحافظة" : "State / Region",
    city: isRTL ? "المدينة" : "City",
    save: isRTL ? "حفظ التغييرات" : "Save changes",
    saved: isRTL ? "تم الحفظ بنجاح" : "Saved successfully",
    gold: isRTL ? "رصيد الذهب" : "Gold balance",
    cash: isRTL ? "الرصيد النقدي" : "Cash balance",
    status: isRTL ? "حالة الحساب" : "Account status",
    changePhoto: isRTL ? "تغيير الصورة" : "Change photo",
  };

  const inputCls = "flex items-center gap-3 bg-[#F7F7F8] rounded-2xl px-5 py-4 border border-transparent focus-within:border-[#E9C237]/60 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(233,194,55,0.08)] transition-all duration-200";
  const inputInner = "flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#ccc] font-medium";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!firstname.trim()) { setError(isRTL ? "الاسم الأول مطلوب" : "First name is required"); return; }
    if (!lastname.trim()) { setError(isRTL ? "اسم العائلة مطلوب" : "Last name is required"); return; }
    setLoading(true);
    const payload = { firstname, lastname, address, state, city };
    const res = await updateProfile(payload, lang);
    if (res.success) { setSuccess(tr.saved); fetchProfile(); }
    else setError(res.message || "Error");
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const fd = new FormData();
    fd.append("image", e.target.files[0]);
    const res = await updateAvatar(fd, lang);
    if (res.success) fetchProfile();
    else setError(res.message || "Error");
  };

  const fullName = profile ? `${profile.firstname || ""} ${profile.lastname || ""}`.trim() : "";
  const initials = fullName ? fullName.charAt(0).toUpperCase() : "U";
  const isConfirmed = profile?.conformation_status === "confirmed";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
        <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#f0f0f0] p-8">
      {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#f0f0f0]">
          <div className="relative">
            {profile?.image ? (
              <img src={profile.image} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-white font-bold text-[24px] shadow-lg">
                {initials}
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[#f0f0f0] flex items-center justify-center hover:border-[#C9A84C] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
          </div>
          <div>
            <p className="text-[17px] font-bold text-[#1a1a1a]">{fullName || (isRTL ? "مستخدم" : "User")}</p>
            <p className="text-[13px] text-[#999] mt-0.5">@{profile?.username}</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[12px] text-[#C9A84C] font-semibold hover:text-[#B89A3A] transition-colors mt-1">{tr.changePhoto}</button>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.firstname}</label>
              <div className={inputCls}><input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} className={inputInner} /></div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.lastname}</label>
              <div className={inputCls}><input type="text" value={lastname} onChange={e => setLastname(e.target.value)} className={inputInner} /></div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.email}</label>
              <div className={`${inputCls} opacity-60`}><input type="email" value={profile?.email || ""} className={inputInner} dir="ltr" readOnly /></div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.mobile}</label>
              <div className={`${inputCls} opacity-60`}><input type="tel" value={profile?.mobile || ""} className={inputInner} dir="ltr" readOnly /></div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#888]">{tr.address}</label>
              <div className={inputCls}><input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputInner} /></div>
            </div>
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

          {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">{error}</div>}
          {success && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[13px] font-medium">{success}</div>}

          <div className="flex justify-end mt-2">
            <button type="submit" disabled={loading || !isDirty}
              className="px-8 py-3.5 font-bold text-[14px] rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)", color: "white" }}>
              {loading ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : tr.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
