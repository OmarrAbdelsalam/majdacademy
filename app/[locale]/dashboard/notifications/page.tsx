"use client";
import { useState, useEffect } from "react";
import { useLang } from "../../../i18n/LangContext";
import { getNotifications, deleteNotification } from "../../../../lib/api";

export default function NotificationsPage() {
  const { isRTL, lang } = useLang();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const tr = {
    title: isRTL ? "الإشعارات" : "Notifications",
    subtitle: isRTL ? "آخر التحديثات والتنبيهات" : "Latest updates and alerts",
    empty: isRTL ? "لا توجد إشعارات" : "No notifications",
    emptyDesc: isRTL ? "ستظهر الإشعارات هنا عند وجود تحديثات جديدة" : "Notifications will appear here when there are new updates",
  };
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNotifications(0, lang).then(res => {
      if (res.success && res.data) {
        setNotifications(res.data.items || []);
        setHasMore(res.data.hasMore || false);
      } else {
        setNotifications([]);
      }
      setSkip(0);
      setLoading(false);
    });
  }, [lang]);

  const loadMore = () => {
    const nextSkip = skip + 10;
    getNotifications(nextSkip, lang).then(res => {
      if (res.success && res.data) {
        setNotifications(prev => [...prev, ...(res.data.items || [])]);
        setHasMore(res.data.hasMore || false);
        setSkip(nextSkip);
      }
    });
  };

  const handleDelete = async (id: string) => {
    const res = await deleteNotification(id, lang);
    if (res.success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{tr.title}</h1>
        <p className="text-[14px] text-[#999] mt-1">{tr.subtitle}</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-12 text-center animate-pulse">
           <div className="w-20 h-20 rounded-3xl bg-[#f7f7f7] mx-auto mb-5" />
           <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#f7f7f7] flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </div>
          <p className="text-[16px] font-bold text-[#1a1a1a] mb-2">{tr.empty}</p>
          <p className="text-[13px] text-[#999]">{tr.emptyDesc}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((notif: any) => (
              <div key={notif.id} className="bg-white p-4 rounded-xl border border-[#f0f0f0] flex justify-between items-start shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-[15px] mb-1">{notif.title}</h4>
                  <p className="text-[13px] text-[#666] leading-relaxed mb-2">{notif.body}</p>
                  <p className="text-[11px] text-[#999]">{notif.date}</p>
                </div>
                <button onClick={() => handleDelete(notif.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0 ml-4 rtl:ml-0 rtl:mr-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 text-center">
              <button onClick={loadMore} className="px-8 py-3 rounded-xl text-[13px] font-semibold text-[#888] bg-white border border-[#f0f0f0] hover:border-[#ddd] transition-all">{isRTL ? "تحميل المزيد" : "Load more"}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
