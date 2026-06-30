"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  ArrowRight, User, Phone, BookOpen, Clock, Calendar, 
  CheckCircle2, PauseCircle, PlayCircle, Edit, 
  RefreshCw, Play, Trash2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function SubscriberDetailPage() {
  const { id, locale } = useParams() as { id: string; locale: string };
  const router = useRouter();

  const [subscriber, setSubscriber] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [actionSession, setActionSession] = useState<any>(null);
  const [actionType, setActionType] = useState<'postpone' | 'carry_forward' | null>(null);
  
  const [postponeDate, setPostponeDate] = useState("");
  const [postponeTime, setPostponeTime] = useState("");
  const [postponeReason, setPostponeReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  
  const [isCalendarDeleteModalOpen, setIsCalendarDeleteModalOpen] = useState(false);
  const [eventIdsToDelete, setEventIdsToDelete] = useState<string[]>([]);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});
  
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewCount, setRenewCount] = useState<number>(8);
  const [renewStartDate, setRenewStartDate] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/subscribers/${id}`);
      if (res.ok) {
        const { data } = await res.json();
        setSubscriber(data.subscriber);
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const postponedCount = sessions.filter(s => s.status === 'postponed').length;
  const carriedCount = sessions.filter(s => s.status === 'carried_forward').length;
  const remainingCount = sessions.filter(s => s.status === 'scheduled').length;

  const handleAction = async (sessionId: string, action: string, extraData = {}) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData })
      });
      
      if (res.ok) {
        await fetchData(); // Refresh
        setActionSession(null);
        setActionType(null);
      } else {
        alert("حدث خطأ");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscriberStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/subscribers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubscriber = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        const syncedEventIds = sessions.filter(s => s.google_event_id).map(s => s.google_event_id);
        if (syncedEventIds.length > 0) {
          setEventIdsToDelete(syncedEventIds);
          setIsCalendarDeleteModalOpen(true);
        } else {
          router.push(`/${locale}/dashboard/subscribers`);
        }
      } else {
        alert("حدث خطأ أثناء الحذف");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCalendarEvents = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/calendar/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds: eventIdsToDelete })
      });
    } catch(e) {
      console.error(e);
    } finally {
      router.push(`/${locale}/dashboard/subscribers`);
    }
  };

  const handleEditSubscriber = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/subscribers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        await fetchData();
        setIsEditModalOpen(false);
      } else {
        alert("حدث خطأ أثناء التعديل");
      }
    } catch(e) { alert("حدث خطأ"); }
    finally { setIsSubmitting(false); }
  };

  const handleRenewSubscriber = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/subscribers/${id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions_count: renewCount, start_date: renewStartDate })
      });
      if (res.ok) {
        await fetchData();
        setIsRenewModalOpen(false);
      } else {
        alert("حدث خطأ أثناء التجديد");
      }
    } catch(e) { alert("حدث خطأ"); }
    finally { setIsSubmitting(false); }
  };

  const handleSyncAllToCalendar = async () => {
    const unsyncedSessions = sessions.filter(s => s.status === 'scheduled' && !s.google_event_id);
    if (unsyncedSessions.length === 0) return;

    setIsSyncingAll(true);
    let successCount = 0;

    for (const session of unsyncedSessions) {
      try {
        const res = await fetch(`/api/sessions/${session.id}/calendar`, { method: 'POST' });
        if (res.ok) successCount++;
      } catch (e) {
        console.error("Error syncing session", session.id, e);
      }
    }

    setIsSyncingAll(false);
    if (successCount > 0) {
      fetchData();
    }
    if (successCount !== unsyncedSessions.length) {
      alert(`تم تصدير ${successCount} حصة من أصل ${unsyncedSessions.length}. الرجاء التحقق والمحاولة مرة أخرى.`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-[#fef0f8] text-[#ef5da8] px-3 py-1 text-xs font-bold rounded-full">نشط</span>;
      case 'paused': return <span className="bg-amber-50 text-amber-600 px-3 py-1 text-xs font-bold rounded-full">موقف</span>;
      case 'completed': return <span className="bg-green-50 text-green-600 px-3 py-1 text-xs font-bold rounded-full">مكتمل</span>;
      case 'cancelled': return <span className="bg-red-50 text-red-500 px-3 py-1 text-xs font-bold rounded-full">ملغي</span>;
      default: return null;
    }
  };

  const getSessionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'postponed': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'carried_forward': return <RefreshCw className="w-5 h-5 text-red-500" />;
      case 'scheduled': return <div className="w-3 h-3 rounded-full bg-gray-300" />;
      default: return null;
    }
  };

  const openPostponeModal = (session: any) => {
    setActionSession(session);
    setActionType('postpone');
    setPostponeDate(session.scheduled_date);
    setPostponeTime(session.scheduled_time || '');
    setPostponeReason('');
  };

  const openCarryForwardModal = (session: any) => {
    setActionSession(session);
    setActionType('carry_forward');
  };

  if (isLoading) return <DetailSkeleton />;
  if (!subscriber) return <div className="text-center py-20 font-bold" dir="rtl">المشترك غير موجود</div>;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      
      {/* Header / Nav */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/${locale}/dashboard/subscribers`} className="w-10 h-10 rounded-full bg-white border border-[rgba(38,38,38,0.08)] flex items-center justify-center text-[rgba(38,38,38,0.6)] hover:bg-[#f8f9fa] transition-colors shadow-sm">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-[#262626] font-extrabold text-2xl">تفاصيل المشترك</h1>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fef0f8] rounded-bl-[100px] -z-10 opacity-50" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[24px] bg-[#f8f9fa] border border-gray-100 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-[#ef5da8]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-extrabold text-[#262626]">{subscriber.student_name}</h2>
                {getStatusBadge(subscriber.status)}
              </div>
              <div className="space-y-1.5 mt-2">
                <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {subscriber.course_type} • {subscriber.subject || 'مادة غير محددة'}
                </p>
                <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الصف: {subscriber.grade || 'غير محدد'} {subscriber.child_age ? `• العمر: ${subscriber.child_age}` : ''}
                </p>
                <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  باقة {subscriber.package_sessions} حصص ({subscriber.package_price} درهم)
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {subscriber.status === 'active' && (
              <button 
                onClick={() => handleSubscriberStatus('paused')}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-[60px] bg-amber-50 text-amber-600 text-[13px] font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
                <PauseCircle className="w-4 h-4" /> إيقاف مؤقت
              </button>
            )}
            {subscriber.status === 'paused' && (
              <button 
                onClick={() => handleSubscriberStatus('active')}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-[60px] bg-green-50 text-green-600 text-[13px] font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" /> تفعيل
              </button>
            )}
            <button 
              onClick={() => {
                setRenewCount(subscriber.package_sessions || 8);
                const lastSession = sessions[sessions.length - 1];
                let defaultDate = new Date().toISOString().split('T')[0];
                if (lastSession) {
                    const d = new Date(lastSession.scheduled_date);
                    d.setDate(d.getDate() + 1);
                    defaultDate = d.toISOString().split('T')[0];
                }
                setRenewStartDate(defaultDate);
                setIsRenewModalOpen(true);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-[60px] bg-purple-50 text-purple-600 text-[13px] font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> تجديد الباقة
            </button>
            <button 
              onClick={() => {
                setEditData({
                  student_name: subscriber.student_name,
                  student_phone: subscriber.student_phone || '',
                  parent_phone: subscriber.parent_phone || '',
                  subject: subscriber.subject || '',
                  course_type: subscriber.course_type || '',
                  grade: subscriber.grade || '',
                  child_age: subscriber.child_age || '',
                });
                setIsEditModalOpen(true);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-[60px] bg-[#f8f9fa] text-[#262626] text-[13px] font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" /> تعديل
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-[60px] bg-red-50 text-red-600 text-[13px] font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> حذف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[rgba(38,38,38,0.4)]">واتساب الطالب</p>
              <p className="text-[14px] font-bold text-[#262626]" dir="ltr">{subscriber.student_phone}</p>
            </div>
          </div>
          {subscriber.parent_phone && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[rgba(38,38,38,0.4)]">ولي الأمر</p>
                <p className="text-[14px] font-bold text-[#262626]" dir="ltr">{subscriber.parent_phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[rgba(38,38,38,0.4)]">أيام الحصص</p>
              <p className="text-[14px] font-bold text-[#262626]">
                {subscriber.session_days?.map((d:number) => dayNames[d]).join('، ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-[20px] p-5 border border-green-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#262626] leading-none">{completedCount}</p>
            <p className="text-[12px] font-bold text-[rgba(38,38,38,0.5)] mt-1">حصص مكتملة</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-5 border border-blue-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Play className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#262626] leading-none">{remainingCount}</p>
            <p className="text-[12px] font-bold text-[rgba(38,38,38,0.5)] mt-1">حصص متبقية</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-5 border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#262626] leading-none">{postponedCount}</p>
            <p className="text-[12px] font-bold text-[rgba(38,38,38,0.5)] mt-1">تأجيلات</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-5 border border-red-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#262626] leading-none">{carriedCount}</p>
            <p className="text-[12px] font-bold text-[rgba(38,38,38,0.5)] mt-1">مرحّلة</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-extrabold text-[#262626] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#ef5da8]" />
            جدول الحصص
          </h3>
          
          {sessions.some(s => s.status === 'scheduled' && !s.google_event_id) && (
            <button 
              onClick={handleSyncAllToCalendar}
              disabled={isSyncingAll}
              className="px-4 py-2.5 bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4" />
              {isSyncingAll ? 'جاري تصدير الكل...' : 'تصدير الكل للتقويم'}
            </button>
          )}
        </div>

        <div className="relative border-r-2 border-[rgba(38,38,38,0.05)] pr-6 space-y-6">
          {sessions.map((session) => {
            const isCompleted = session.status === 'completed';
            const isPostponed = session.status === 'postponed';
            const isCarried = session.status === 'carried_forward';
            const isScheduled = session.status === 'scheduled';

            let bgColor = "bg-white";
            let borderColor = "border-[rgba(38,38,38,0.08)]";
            if (isCompleted) { bgColor = "bg-green-50/50"; borderColor = "border-green-200"; }
            if (isPostponed) { bgColor = "bg-amber-50/50"; borderColor = "border-amber-200"; }
            if (isCarried) { bgColor = "bg-red-50/50"; borderColor = "border-red-200"; }

            return (
              <div key={session.id} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -right-[35px] top-5 w-[18px] h-[18px] rounded-full border-4 border-white shadow-sm flex items-center justify-center
                  ${isCompleted ? 'bg-green-500' : isPostponed ? 'bg-amber-500' : isCarried ? 'bg-red-500' : 'bg-gray-300'}`} 
                />

                <div className={`rounded-[20px] border ${borderColor} ${bgColor} p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md`}>
                  
                  {/* Session Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[16px] bg-white border border-gray-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <span className="text-[10px] font-bold text-gray-400">حصة</span>
                      <span className="text-[16px] font-extrabold text-[#262626] leading-none mt-0.5">{session.session_number}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[15px] font-extrabold text-[#262626]">
                          {format(parseISO(session.scheduled_date), 'EEEE، d MMMM', { locale: ar })}
                        </h4>
                        {getSessionStatusIcon(session.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium text-[rgba(38,38,38,0.6)]">
                        <span className="flex items-center gap-1.5" dir="ltr">
                          <Clock className="w-3.5 h-3.5" />
                          {session.scheduled_time || '16:00'}
                        </span>
                        <span>•</span>
                        <span>{session.duration_minutes} دقيقة</span>
                        
                        {isPostponed && session.original_date && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 line-through">
                              كانت: {format(parseISO(session.original_date), 'd MMM', { locale: ar })}
                            </span>
                          </>
                        )}
                        {session.carried_from_session && (
                          <>
                            <span>•</span>
                            <span className="text-red-500">مرحلة من حصة {session.carried_from_session}</span>
                          </>
                        )}
                      </div>
                      
                      {session.postpone_reason && (
                        <p className="mt-2 text-[12px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                          سبب التأجيل: {session.postpone_reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Container */}
                  {(isScheduled || isPostponed || (isCarried && session.google_event_id)) && (
                    <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-gray-100 md:border-none">
                      
                      {/* Actions for postponed/carried_forward to update calendar */}
                      {(isPostponed || isCarried) && session.google_event_id && !(session.notes && session.notes.includes('[CALENDAR_SYNCED]')) && (
                        <button 
                          onClick={async () => {
                            const btn = document.getElementById(`update-cal-btn-${session.id}`);
                            if(btn) btn.innerText = 'جاري التحديث...';
                            try {
                              const res = await fetch(`/api/sessions/${session.id}/calendar`, { method: 'PUT' });
                              if (res.ok) fetchData();
                              else alert('فشل التحديث أو تم حذفه مسبقاً');
                            } catch(e) { alert('خطأ'); }
                            if(btn) btn.innerText = 'تحديث التقويم';
                          }}
                          id={`update-cal-btn-${session.id}`}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-4 h-4" /> تحديث التقويم
                        </button>
                      )}

                      {/* Standard Actions for Scheduled and Postponed */}
                      {(isScheduled || isPostponed) && (
                        <>
                          {session.meet_link ? (
                            <a 
                              href={session.meet_link} target="_blank" rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
                            >
                              <Calendar className="w-4 h-4" /> رابط ميت
                            </a>
                          ) : (
                            <button 
                              onClick={async () => {
                                const btn = document.getElementById(`sync-btn-${session.id}`);
                                if(btn) btn.innerText = 'جاري التصدير...';
                                try {
                                  const res = await fetch(`/api/sessions/${session.id}/calendar`, { method: 'POST' });
                                  if (res.ok) fetchData();
                                  else alert('فشل التصدير للتقويم');
                                } catch(e) { alert('خطأ'); }
                                if(btn) btn.innerText = 'تصدير للتقويم';
                              }}
                              id={`sync-btn-${session.id}`}
                              className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
                            >
                              <Calendar className="w-4 h-4" /> تصدير للتقويم
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleAction(session.id, 'complete')}
                            className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> إتمام
                          </button>
                          <button 
                            onClick={() => openPostponeModal(session)}
                            className="px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Clock className="w-4 h-4" /> تأجيل
                          </button>
                          <button 
                            onClick={() => openCarryForwardModal(session)}
                            className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-[60px] text-[13px] font-bold transition-colors flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-4 h-4" /> ترحيل
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Modals */}
      <AnimatePresence>
        {actionSession && actionType === 'postpone' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-extrabold text-[#262626] mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> تأجيل الحصة رقم {actionSession.session_number}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">التاريخ الجديد</label>
                  <input type="date" value={postponeDate} onChange={e => setPostponeDate(e.target.value)} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">الوقت الجديد</label>
                  <input type="time" value={postponeTime} onChange={e => setPostponeTime(e.target.value)} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">السبب (اختياري)</label>
                  <textarea value={postponeReason} onChange={e => setPostponeReason(e.target.value)} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none resize-none h-20" placeholder="مثال: ظرف صحي..." />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActionSession(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-[60px] font-bold text-[14px]">إلغاء</button>
                <button 
                  onClick={() => handleAction(actionSession.id, 'postpone', { new_date: postponeDate, new_time: postponeTime, reason: postponeReason })}
                  disabled={!postponeDate || isSubmitting}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-[60px] font-bold text-[14px] disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'تأكيد التأجيل'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {actionSession && actionType === 'carry_forward' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold text-[#262626] mb-2">ترحيل الحصة {actionSession.session_number}</h3>
              <p className="text-[14px] text-[rgba(38,38,38,0.6)] mb-6 font-medium">
                هل أنت متأكد من ترحيل هذه الحصة؟ سيتم إعتبارها ملغية وإضافة حصة بديلة في نهاية جدول المشترك.
              </p>
              
              <div className="flex gap-3">
                <button onClick={() => setActionSession(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-[60px] font-bold text-[14px]">تراجع</button>
                <button 
                  onClick={() => handleAction(actionSession.id, 'carry_forward')}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-[60px] font-bold text-[14px] disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري...' : 'تأكيد الترحيل'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold text-[#262626] mb-2">حذف المشترك</h3>
              <p className="text-[14px] text-[rgba(38,38,38,0.6)] mb-6 font-medium">
                هل أنت متأكد من حذف المشترك "{subscriber.student_name}"؟ سيتم حذف جميع الحصص المرتبطة به نهائياً ولا يمكن التراجع عن هذا الإجراء.
              </p>
              
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-[60px] font-bold text-[14px]">تراجع</button>
                <button 
                  onClick={handleDeleteSubscriber}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-[60px] font-bold text-[14px] disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحذف...' : 'تأكيد الحذف'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isCalendarDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-xl text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-extrabold text-[#262626] mb-2">حذف مواعيد التقويم</h3>
              <p className="text-[14px] text-[rgba(38,38,38,0.6)] mb-6 font-medium">
                تم حذف المشترك بنجاح. هل ترغب أيضاً في حذف جميع مواعيد حصصه المتبقية من جوجل كاليندر (Google Calendar)؟
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push(`/${locale}/dashboard/subscribers`)} 
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-[60px] font-bold text-[14px]"
                >
                  لا، اتركها
                </button>
                <button 
                  onClick={handleDeleteCalendarEvents}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-[60px] font-bold text-[14px] disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحذف...' : 'نعم، احذف المواعيد'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-extrabold text-[#262626] mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-500" /> تعديل بيانات المشترك
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">اسم الطالب</label>
                  <input type="text" value={editData.student_name || ''} onChange={e => setEditData({...editData, student_name: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">رقم الطالب</label>
                  <input type="text" value={editData.student_phone || ''} onChange={e => setEditData({...editData, student_phone: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" dir="ltr" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">رقم ولي الأمر</label>
                  <input type="text" value={editData.parent_phone || ''} onChange={e => setEditData({...editData, parent_phone: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" dir="ltr" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">المادة</label>
                  <input type="text" value={editData.subject || ''} onChange={e => setEditData({...editData, subject: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">المنهج / النوع</label>
                  <input type="text" value={editData.course_type || ''} onChange={e => setEditData({...editData, course_type: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#262626] mb-1.5">الصف الدراسي</label>
                    <input type="text" value={editData.grade || ''} onChange={e => setEditData({...editData, grade: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="مثال: Grade 5" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#262626] mb-1.5">العمر</label>
                    <input type="text" value={editData.child_age || ''} onChange={e => setEditData({...editData, child_age: e.target.value})} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="مثال: 10" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-[60px] font-bold text-[14px]">إلغاء</button>
                <button 
                  onClick={handleEditSubscriber}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-[60px] font-bold text-[14px] disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isRenewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-extrabold text-[#262626] mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-500" /> تجديد الباقة / إضافة شهر
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">عدد الحصص الجديدة</label>
                  <input type="number" value={renewCount} onChange={e => setRenewCount(Number(e.target.value))} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#262626] mb-1.5">تاريخ أول حصة</label>
                  <input type="date" value={renewStartDate} onChange={e => setRenewStartDate(e.target.value)} className="w-full bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm outline-none" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsRenewModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-[60px] font-bold text-[14px]">إلغاء</button>
                <button 
                  onClick={handleRenewSubscriber}
                  disabled={isSubmitting || renewCount < 1 || !renewStartDate}
                  className="flex-1 py-2.5 bg-purple-500 text-white rounded-[60px] font-bold text-[14px] disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري التجديد...' : 'تأكيد التجديد'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
        <div className="flex gap-5 mb-8">
          <div className="w-16 h-16 rounded-[24px] bg-gray-200 animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-50">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
        </div>
      </div>
    </div>
  );
}
