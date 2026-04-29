"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "../../i18n/LangContext";
import { apiRequest } from "../../../lib/api-client";
import { getNotifications, deleteNotification, getProfile } from "../../../lib/api";

const navItems = [
  { key: "wallet", iconPath: "M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 14a1 1 0 100 2 1 1 0 000-2z" },
  { key: "transactions", iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "deposit", iconPath: "M12 5v14m-7-7l7 7 7-7" },
  { key: "orders", iconPath: "M16 11V3H8v8H2l10 10 10-10h-6z", href: "orders/new" },
  { key: "profile", iconPath: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
  { key: "home", iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", href: "/" },
];

const labels: Record<string, { ar: string; en: string }> = {
  wallet: { ar: "المحفظة", en: "Wallet" },
  transactions: { ar: "المعاملات", en: "Transactions" },
  deposit: { ar: "إيداع", en: "Deposit" },
  withdraw: { ar: "سحب", en: "Withdraw" },
  "buy-gold": { ar: "شراء ذهب", en: "Buy Gold" },
  "buy-silver": { ar: "شراء فضة", en: "Buy Silver" },
  orders: { ar: "شراء ذهب وفضة", en: "Buy Gold & Silver" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  profile: { ar: "الملف الشخصي", en: "Profile" },
  home: { ar: "الصفحة الرئيسية", en: "Home" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isRTL, lang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifHasMore, setNotifHasMore] = useState(false);
  const [notifSkip, setNotifSkip] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = (skip = 0, append = false) => {
    setNotifLoading(true);
    getNotifications(skip, lang).then(res => {
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.items)
        ? res.data.items
        : [];
      setNotifications(prev => append ? [...prev, ...list] : list);
      setNotifHasMore(res.data?.hasMore || false);
      setNotifSkip(skip);
      setNotifLoading(false);
    });
  };

  const handleBellClick = () => {
    if (!notifOpen) fetchNotifications(0);
    setNotifOpen(o => !o);
  };

  const handleDeleteNotif = async (id: string) => {
    await deleteNotification(id, lang);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const [profileName, setProfileName] = useState("");
  const [profileInitial, setProfileInitial] = useState("U");

  useEffect(() => {
    getProfile(lang).then(res => {
      if (res.data) {
        const full = `${res.data.firstname || ""} ${res.data.lastname || ""}`.trim();
        setProfileName(full || res.data.username || "");
        setProfileInitial((full || res.data.username || "U").charAt(0).toUpperCase());
      }
    });
  }, [lang]);

  const tr = {
    dashboard: isRTL ? "لوحة التحكم" : "Dashboard",
    logout: isRTL ? "تسجيل خروج" : "Logout",
  };

  const handleLogout = async () => {
    await apiRequest("/api/user/logout", { method: "GET", locale: lang }).catch(() => {});
    document.cookie = "gct_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push(`/${lang}/login`);
  };

  const isActive = (item: any) => {
    if (item.key === "home") return false;
    const href = item.href || item.key;
    return pathname.includes(`/dashboard/${href}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar — Desktop */}
      <aside className={`hidden lg:flex flex-col w-[280px] bg-white border-${isRTL ? "l" : "r"} border-[#f0f0f0] fixed top-0 bottom-0 ${isRTL ? "right-0" : "left-0"} z-30`}>
        {/* Logo */}
        <div className="flex items-center gap-4 px-7 h-[80px] border-b border-[#f0f0f0]">
          <Image src="/logo.png" alt="GCT" width={64} height={64} className="w-16 h-16 object-contain scale-[1.2]" />
          <div className="flex-1 mt-1">
            <p className="text-[18px] font-extrabold text-[#1a1a1a] tracking-wide leading-tight">GCT GOLD</p>
            <p className="text-[12px] text-[#bbb] font-medium">{tr.dashboard}</p>
          </div>
          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={handleBellClick} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#f5f5f5] transition-colors relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map(item => {
            const href = item.href || item.key;
            const active = isActive(item.key);
            if ((item as any).disabled) {
              return (
                <div key={item.key} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#ccc] cursor-not-allowed select-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.iconPath} /></svg>
                  <span>{labels[item.key]?.[lang] || item.key}</span>
                  <span className="ms-auto text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">{isRTL ? "قريباً" : "Soon"}</span>
                </div>
              );
            }
            return (
              <Link key={item.key} href={item.key === "home" ? `/${lang}` : `/${lang}/dashboard/${href}`} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${active ? "bg-gradient-to-r from-[#C9A84C]/10 to-[#E8C96A]/5 text-[#C9A84C] shadow-sm" : "text-[#888] hover:text-[#1a1a1a] hover:bg-[#f7f7f7]"}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#C9A84C" : "#bbb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.iconPath} /></svg>
                {labels[item.key]?.[lang] || item.key}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-[#f0f0f0] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C96A] flex items-center justify-center text-white font-bold text-[14px]">{profileInitial}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#1a1a1a] truncate">{profileName || "..."}</p>
            </div>
            <button onClick={handleLogout} className="text-[#ccc] hover:text-red-400 transition-colors" title={tr.logout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#f0f0f0] h-[60px] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="GCT" width={44} height={44} className="w-11 h-11 object-contain" />
          <div>
            <p className="text-[15px] font-extrabold text-[#1a1a1a]">GCT GOLD</p>
            <p className="text-[11px] text-[#bbb]">{tr.dashboard}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Bell mobile */}
          <button onClick={handleBellClick} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f5f5f5] relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f5f5f5]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className={`fixed top-[70px] lg:top-[80px] ${isRTL ? "left-4 lg:left-auto lg:right-[260px]" : "right-4 lg:right-auto lg:left-[260px]"} z-50 w-[340px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#f0f0f0] overflow-hidden`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f5f5f5]">
              <p className="text-[15px] font-bold text-[#1a1a1a]">{isRTL ? "الإشعارات" : "Notifications"}</p>
              <button onClick={() => setNotifOpen(false)} className="text-[#ccc] hover:text-[#888]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                  <p className="text-[13px] text-[#bbb]">{isRTL ? "لا توجد إشعارات" : "No notifications"}</p>
                </div>
              ) : (
                <div className="divide-y divide-[#f5f5f5]">
                  {notifications.map((n: any) => (
                    <div key={n.id} className="flex items-start gap-3 px-5 py-4 hover:bg-[#fafafa] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1a1a1a] leading-snug">{n.title}</p>
                        {n.body && <p className="text-[12px] text-[#999] mt-0.5 leading-relaxed">{n.body}</p>}
                        {n.date && <p className="text-[11px] text-[#ccc] mt-1">{n.date}</p>}
                      </div>
                      <button onClick={() => handleDeleteNotif(n.id)} className="text-[#ddd] hover:text-red-400 transition-colors shrink-0 mt-0.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {notifHasMore && (
                <div className="px-5 py-3 border-t border-[#f5f5f5]">
                  <button onClick={() => fetchNotifications(notifSkip + 10, true)} className="w-full text-[12px] font-semibold text-[#C9A84C] hover:text-[#B89A3A] transition-colors">
                    {isRTL ? "تحميل المزيد" : "Load more"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setSidebarOpen(false)} />
          <div className={`lg:hidden fixed top-0 ${isRTL ? "right-0" : "left-0"} bottom-0 w-[280px] bg-white z-50 shadow-2xl overflow-y-auto`}>
            <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#f0f0f0]">
              <span className="text-[14px] font-bold text-[#1a1a1a]">{tr.dashboard}</span>
              <button onClick={() => setSidebarOpen(false)} className="text-[#888]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map(item => {
                const href = item.href || item.key;
                const active = isActive(item);
                const finalHref = item.key === "home" ? `/${lang}` : `/${lang}/dashboard/${href}`;

                if ((item as any).disabled) {
                  return (
                    <div key={item.key} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#ccc] cursor-not-allowed select-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.iconPath} /></svg>
                      <span>{labels[item.key]?.[lang] || item.key}</span>
                      <span className="ms-auto text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">{isRTL ? "قريباً" : "Soon"}</span>
                    </div>
                  );
                }
                return (
                  <Link key={item.key} href={finalHref} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${active ? "bg-[#C9A84C]/10 text-[#C9A84C]" : "text-[#888] hover:bg-[#f7f7f7]"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#C9A84C" : "#bbb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.iconPath} /></svg>
                    {labels[item.key]?.[lang] || item.key}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isRTL ? "lg:mr-[280px]" : "lg:ml-[280px]"} pt-[60px] lg:pt-0 min-h-screen`}>
        <div className="p-6 lg:p-10 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
