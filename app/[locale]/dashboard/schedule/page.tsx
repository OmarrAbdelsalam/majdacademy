"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { format, parseISO, startOfWeek, endOfWeek, isToday, isTomorrow, startOfDay, endOfDay, addDays } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Filter, Users, Sparkles, ChevronRight, ChevronLeft, Video } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type ScheduleItem = {
  id: string;
  type: 'subscriber' | 'booking';
  student_name: string;
  student_phone?: string;
  date: string;
  time: string;
  duration_minutes: number;
  subject?: string;
  curriculum?: string;
  grade?: string;
  status: string;
  subscriber_id?: string;
  session_number?: number;
  package_sessions?: number;
  meet_link?: string;
};

const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function SchedulePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";

  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRange, setActiveRange] = useState<'today' | 'week' | 'all'>('week');
  const [activeType, setActiveType] = useState<'all' | 'subscribers' | 'bookings'>('all');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 6 }));

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Fetch subscriber sessions
    const { data: sessionsData } = await supabase
      .from("sessions")
      .select(`
        id,
        session_number,
        scheduled_date,
        scheduled_time,
        duration_minutes,
        status,
        meet_link,
        subscriber:subscribers (
          id,
          student_name,
          student_phone,
          subject,
          curriculum,
          grade,
          package_sessions
        )
      `)
      .in("status", ["scheduled"])
      .gte("scheduled_date", new Date().toISOString().split("T")[0])
      .order("scheduled_date", { ascending: true });

    // Fetch free trial bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .gte("start_time", new Date().toISOString())
      .in("status", ["confirmed"])
      .order("start_time", { ascending: true });

    const combined: ScheduleItem[] = [];

    if (sessionsData) {
      for (const s of sessionsData) {
        const sub = s.subscriber as any;
        if (!sub) continue;
        combined.push({
          id: s.id,
          type: 'subscriber',
          student_name: sub.student_name,
          student_phone: sub.student_phone,
          date: s.scheduled_date,
          time: s.scheduled_time || '16:00',
          duration_minutes: s.duration_minutes || 60,
          subject: sub.subject,
          curriculum: sub.curriculum,
          grade: sub.grade,
          status: s.status,
          subscriber_id: sub.id,
          session_number: s.session_number,
          package_sessions: sub.package_sessions,
          meet_link: s.meet_link,
        });
      }
    }

    if (bookingsData) {
      for (const b of bookingsData) {
        const startDate = parseISO(b.start_time);
        combined.push({
          id: b.id,
          type: 'booking',
          student_name: b.student_name,
          student_phone: b.student_phone,
          date: format(startDate, 'yyyy-MM-dd'),
          time: format(startDate, 'HH:mm'),
          duration_minutes: 60,
          subject: b.subject,
          curriculum: b.curriculum,
          grade: b.grade || b.child_age,
          status: 'confirmed',
        });
      }
    }

    combined.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    setItems(combined);
    setIsLoading(false);
  };

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by type
    if (activeType === 'subscribers') {
      result = result.filter(i => i.type === 'subscriber');
    } else if (activeType === 'bookings') {
      result = result.filter(i => i.type === 'booking');
    }

    // Filter by range
    if (activeRange === 'today') {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      result = result.filter(i => i.date === todayStr);
    } else if (activeRange === 'week') {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 6 });
      const startStr = format(currentWeekStart, 'yyyy-MM-dd');
      const endStr = format(weekEnd, 'yyyy-MM-dd');
      result = result.filter(i => i.date >= startStr && i.date <= endStr);
    }

    return result;
  }, [items, activeType, activeRange, currentWeekStart]);

  // Group items by date
  const groupedItems = useMemo(() => {
    const groups: Record<string, ScheduleItem[]> = {};
    for (const item of filteredItems) {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    }
    return groups;
  }, [filteredItems]);

  const todayCount = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return items.filter(i => i.date === todayStr).length;
  }, [items]);

  const weekCount = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 6 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 6 });
    const startStr = format(weekStart, 'yyyy-MM-dd');
    const endStr = format(weekEnd, 'yyyy-MM-dd');
    return items.filter(i => i.date >= startStr && i.date <= endStr).length;
  }, [items]);

  const subscriberCount = useMemo(() => items.filter(i => i.type === 'subscriber').length, [items]);
  const bookingCount = useMemo(() => items.filter(i => i.type === 'booking').length, [items]);

  const formatDisplayTime = (time24: string) => {
    if (!time24) return "04:00 PM";
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "اليوم";
    if (isTomorrow(date)) return "غداً";
    return format(date, "EEEE، d MMMM", { locale: ar });
  };

  if (isLoading) return <ScheduleSkeleton />;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-[#262626] font-extrabold text-2xl md:text-3xl leading-[120%] mb-2">
          الجدول والحصص القادمة
        </h1>
        <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] leading-[24px]">
          عرض شامل لجميع الحصص القادمة — المشتركين والحصص التجريبية.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5"
        >
          <div className="w-10 h-10 rounded-[20px] bg-[#fef0f8] flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-[#ef5da8]" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">حصص اليوم</p>
          <p className="text-2xl font-extrabold text-[#262626]">{todayCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5"
        >
          <div className="w-10 h-10 rounded-[20px] bg-blue-50 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">حصص الأسبوع</p>
          <p className="text-2xl font-extrabold text-[#262626]">{weekCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5"
        >
          <div className="w-10 h-10 rounded-[20px] bg-purple-50 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">مشتركين</p>
          <p className="text-2xl font-extrabold text-[#262626]">{subscriberCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5"
        >
          <div className="w-10 h-10 rounded-[20px] bg-green-50 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">حصص تجريبية</p>
          <p className="text-2xl font-extrabold text-[#262626]">{bookingCount}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Range Filter */}
        <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[60px] p-1.5">
          {[
            { key: 'today' as const, label: 'اليوم' },
            { key: 'week' as const, label: 'الأسبوع' },
            { key: 'all' as const, label: 'الكل' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveRange(f.key)}
              className={`px-4 py-2 rounded-[60px] text-[13px] font-bold transition-all duration-200 ${
                activeRange === f.key
                  ? 'bg-white text-[#262626] shadow-sm'
                  : 'text-[rgba(38,38,38,0.5)] hover:text-[#262626]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Week Navigation (only when week is selected) */}
        {activeRange === 'week' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeekStart(prev => addDays(prev, 7))}
              className="w-8 h-8 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#262626]" />
            </button>
            <span className="text-[13px] font-bold text-[rgba(38,38,38,0.6)]">
              {format(currentWeekStart, "d MMM", { locale: ar })} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 6 }), "d MMM", { locale: ar })}
            </span>
            <button
              onClick={() => setCurrentWeekStart(prev => addDays(prev, -7))}
              className="w-8 h-8 rounded-full bg-[#f8f9fa] hover:bg-[#e9ecef] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#262626]" />
            </button>
          </div>
        )}

        {/* Type Filter */}
        <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[60px] p-1.5 sm:mr-auto">
          {[
            { key: 'all' as const, label: 'الكل' },
            { key: 'subscribers' as const, label: 'مشتركين' },
            { key: 'bookings' as const, label: 'تجريبية' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveType(f.key)}
              className={`px-4 py-2 rounded-[60px] text-[13px] font-bold transition-all duration-200 ${
                activeType === f.key
                  ? 'bg-white text-[#262626] shadow-sm'
                  : 'text-[rgba(38,38,38,0.5)] hover:text-[#262626]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Content */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="bg-[#f8f9fa] rounded-[24px] p-12 text-center border border-[rgba(38,38,38,0.05)]">
          <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-8 h-8 text-[rgba(38,38,38,0.2)]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#262626] mb-2">لا توجد حصص في هذه الفترة</h3>
          <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)]">
            قم بتغيير الفلتر أو إضافة مشتركين جدد.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {Object.entries(groupedItems).map(([date, dateItems], groupIdx) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ delay: groupIdx * 0.05 }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-4 py-2 rounded-[60px] text-[13px] font-extrabold ${
                    isToday(parseISO(date))
                      ? 'bg-[#ef5da8] text-white'
                      : isTomorrow(parseISO(date))
                        ? 'bg-[#fef0f8] text-[#ef5da8]'
                        : 'bg-[#f8f9fa] text-[#262626]'
                  }`}>
                    {getDateLabel(date)}
                  </div>
                  <div className="flex-1 h-px bg-[rgba(38,38,38,0.06)]" />
                  <span className="text-[12px] font-bold text-[rgba(38,38,38,0.4)]">
                    {dateItems.length} {dateItems.length === 1 ? 'حصة' : 'حصص'}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {dateItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`bg-white rounded-[24px] border shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                        item.type === 'subscriber'
                          ? 'border-[rgba(38,38,38,0.08)]'
                          : 'border-green-100'
                      }`}
                    >
                      {/* Type Badge + Time */}
                      <div className="flex items-center gap-3 sm:w-48 shrink-0">
                        <div className={`w-10 h-10 rounded-[20px] flex items-center justify-center shrink-0 ${
                          item.type === 'subscriber' ? 'bg-[#fef0f8]' : 'bg-green-50'
                        }`}>
                          {item.type === 'subscriber' 
                            ? <Users className="w-5 h-5 text-[#ef5da8]" />
                            : <Sparkles className="w-5 h-5 text-green-500" />
                          }
                        </div>
                        <div>
                          <p className="text-[15px] font-extrabold text-[#262626]" dir="ltr">
                            {formatDisplayTime(item.time)}
                          </p>
                          <p className="text-[12px] font-medium text-[rgba(38,38,38,0.4)]">
                            {item.duration_minutes} دقيقة
                          </p>
                        </div>
                      </div>

                      {/* Student Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[15px] font-extrabold text-[#262626]">
                            {item.student_name}
                          </p>
                          <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-[60px] ${
                            item.type === 'subscriber'
                              ? 'bg-[#fef0f8] text-[#ef5da8]'
                              : 'bg-green-50 text-green-600'
                          }`}>
                            {item.type === 'subscriber' 
                              ? `حصة ${item.session_number}/${item.package_sessions}`
                              : 'تجريبية'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] font-medium text-[rgba(38,38,38,0.5)]">
                          {item.subject && <span>{item.subject}</span>}
                          {item.curriculum && <span>• {item.curriculum}</span>}
                          {item.grade && <span>• {item.grade}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.meet_link && (
                          <a
                            href={item.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-200"
                            title="رابط الحصة"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                        {item.student_phone && (
                          <a
                            href={`https://wa.me/${item.student_phone?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-200"
                            title="واتساب"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {item.type === 'subscriber' && item.subscriber_id && (
                          <Link
                            href={`/${locale}/dashboard/subscribers/${item.subscriber_id}`}
                            className="w-9 h-9 rounded-full bg-[#f8f9fa] text-[rgba(38,38,38,0.5)] hover:bg-[#262626] hover:text-white flex items-center justify-center transition-all duration-200"
                            title="تفاصيل المشترك"
                          >
                            <User className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-52 mb-2 animate-pulse" />
        <div className="h-5 bg-gray-100 rounded-lg w-full max-w-md animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5">
            <div className="w-10 h-10 rounded-[20px] bg-gray-100 animate-pulse mb-3" />
            <div className="h-3 bg-gray-100 rounded w-16 animate-pulse mb-2" />
            <div className="h-7 bg-gray-200 rounded w-10 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="h-10 bg-gray-100 rounded-[60px] w-48 animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-[60px] w-48 animate-pulse" />
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map(g => (
          <div key={g}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 bg-gray-100 rounded-[60px] w-24 animate-pulse" />
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-[20px] bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-48 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
                    <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
