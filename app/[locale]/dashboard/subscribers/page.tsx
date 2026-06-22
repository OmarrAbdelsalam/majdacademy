"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Users, UserPlus, Search, Phone, Calendar, Plus, X, TrendingUp, BarChart3, Clock, ArrowLeft, MoreVertical, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscribersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const router = useRouter();

  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToConvert, setBookingToConvert] = useState<any>(null);

  // Stats
  const [stats, setStats] = useState({
    activeCount: 0,
    totalSessionsThisMonth: 0,
    completedThisWeek: 0,
    postponementRate: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // 1. Fetch active subscribers
      const res = await fetch(`/api/subscribers?status=active`);
      if (res.ok) {
        const { data } = await res.json();
        setSubscribers(data || []);
        
        // Calculate basic stats
        if (data) {
          setStats(prev => ({ ...prev, activeCount: data.length }));
        }
      }

      // 2. Fetch recent bookings for quick add
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
        
      if (recentBookings) {
        setBookings(recentBookings);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.student_phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-[#fef0f8] text-[#ef5da8] px-3 py-1 text-xs font-bold rounded-full">نشط</span>;
      case 'paused': return <span className="bg-amber-50 text-amber-600 px-3 py-1 text-xs font-bold rounded-full">موقف</span>;
      case 'completed': return <span className="bg-green-50 text-green-600 px-3 py-1 text-xs font-bold rounded-full">مكتمل</span>;
      case 'cancelled': return <span className="bg-red-50 text-red-500 px-3 py-1 text-xs font-bold rounded-full">ملغي</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  const handleConvertBooking = (booking: any) => {
    setBookingToConvert(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[#262626] font-extrabold text-2xl md:text-3xl leading-[120%] mb-2">
            إدارة المشتركين
          </h1>
          <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] leading-[24px]">
            تتبع اشتراكات الطلاب وجداول حصصهم وإدارة الباقات.
          </p>
        </div>
        <button 
          onClick={() => {
            setBookingToConvert(null);
            setIsModalOpen(true);
          }}
          className="bg-[#262626] text-white hover:bg-[#3a3a3a] px-5 py-2.5 rounded-[60px] font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مشترك جديد</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
          <div className="w-10 h-10 rounded-[20px] bg-[#fef0f8] flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-[#ef5da8]" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">مشتركين نشطين</p>
          <p className="text-2xl font-extrabold text-[#262626]">{stats.activeCount}</p>
        </div>
        <div className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
          <div className="w-10 h-10 rounded-[20px] bg-blue-50 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">إجمالي الحصص (الشهر)</p>
          <p className="text-2xl font-extrabold text-[#262626]">-</p>
        </div>
        <div className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
          <div className="w-10 h-10 rounded-[20px] bg-green-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">حصص مكتملة (الأسبوع)</p>
          <p className="text-2xl font-extrabold text-[#262626]">-</p>
        </div>
        <div className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
          <div className="w-10 h-10 rounded-[20px] bg-amber-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[13px] font-bold text-[rgba(38,38,38,0.5)] mb-1">نسبة التأجيلات</p>
          <p className="text-2xl font-extrabold text-[#262626]">-%</p>
        </div>
      </div>

      {/* Quick Add Section */}
      {bookings.length > 0 && (
        <section className="bg-[#f8f9fa] rounded-[24px] p-5 sm:p-6 border border-[rgba(38,38,38,0.05)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-[16px] bg-[#fef0f8] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#ef5da8]" />
            </div>
            <h2 className="text-[16px] font-extrabold text-[#262626]">إضافة سريعة من الحصص المجانية</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 snap-x custom-scrollbar">
            {bookings.map(booking => (
              <div key={booking.id} className="min-w-[280px] bg-white rounded-[20px] p-4 shadow-sm border border-[rgba(38,38,38,0.08)] snap-start shrink-0 flex flex-col justify-between">
                <div>
                  <p className="font-extrabold text-[#262626] text-[15px] mb-1 truncate">{booking.student_name}</p>
                  <p className="text-[12px] font-medium text-[rgba(38,38,38,0.5)] mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(parseISO(booking.start_time), 'EEEE، d MMMM', { locale: ar })}
                  </p>
                </div>
                <button 
                  onClick={() => handleConvertBooking(booking)}
                  className="w-full bg-[#fef0f8] text-[#ef5da8] hover:bg-[#ef5da8] hover:text-white rounded-[60px] py-2 text-[13px] font-bold transition-colors"
                >
                  تحويل لمشترك
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(38,38,38,0.4)]" />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو الرقم..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f8f9fa] rounded-[60px] py-2.5 pr-10 pl-4 text-[14px] font-medium text-[#262626] outline-none focus:ring-2 focus:ring-[#ef5da8]/20 transition-all border-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'active', label: 'نشط' },
            { id: 'paused', label: 'موقف' },
            { id: 'completed', label: 'مكتمل' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id)}
              className={`px-4 py-2 rounded-[60px] text-[13px] font-bold whitespace-nowrap transition-colors ${
                filterStatus === filter.id 
                  ? 'bg-[#262626] text-white' 
                  : 'bg-[#f8f9fa] text-[rgba(38,38,38,0.6)] hover:text-[#262626]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscribers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-[24px] p-5 h-48 border border-gray-100 shadow-sm animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 w-16 bg-gray-100 rounded-[60px]"></div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/3 mb-6"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4 mt-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="bg-[#f8f9fa] rounded-[24px] p-12 text-center border border-[rgba(38,38,38,0.05)]">
          <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-[rgba(38,38,38,0.2)]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#262626] mb-2">لا يوجد مشتركين</h3>
          <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)]">لا توجد نتائج مطابقة للبحث أو الفلتر الحالي.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscribers.map(sub => (
            <div 
              key={sub.id}
              onClick={() => router.push(`/${locale}/dashboard/subscribers/${sub.id}`)}
              className="cursor-pointer bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 group h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[16px] font-extrabold text-[#262626] group-hover:text-[#ef5da8] transition-colors line-clamp-1">{sub.student_name}</h3>
                {getStatusBadge(sub.status)}
              </div>
              
              <p className="text-[13px] font-medium text-[rgba(38,38,38,0.5)] mb-4">
                {sub.package_sessions} حصص • {sub.subject || 'غير محدد'}
              </p>
              
              <div className="mt-auto mb-5">
                <div className="flex justify-between text-[12px] font-bold text-[rgba(38,38,38,0.6)] mb-2">
                  <span>التقدم</span>
                  <span>{sub.completed_sessions || 0} / {sub.total_sessions || sub.package_sessions}</span>
                </div>
                <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
                  <div 
                    className="h-full bg-[#ef5da8] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(0, ((sub.completed_sessions || 0) / (sub.total_sessions || sub.package_sessions || 1)) * 100))}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex gap-2">
                  <a 
                    href={`https://wa.me/${sub.student_phone?.replace(/[^0-9]/g, '')}`} 
                    target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[rgba(38,38,38,0.4)] group-hover:bg-[#fef0f8] group-hover:text-[#ef5da8] transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <SubscriberModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            bookingData={bookingToConvert}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// The Modal component
function SubscriberModal({ isOpen, onClose, bookingData, onSuccess }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_name: bookingData?.student_name || '',
    student_phone: bookingData?.student_phone || '',
    student_email: bookingData?.student_email || '',
    parent_phone: '',
    child_age: bookingData?.child_age || bookingData?.grade || '',
    grade: bookingData?.grade || '',
    curriculum: bookingData?.curriculum || '',
    subject: bookingData?.subject || '',
    course_type: bookingData?.course_type || '',
    package_sessions: 8,
    package_price: 1300,
    session_days: [] as number[],
    preferred_time: '16:00',
    session_duration: 60,
    start_date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    booking_id: bookingData?.id || null,
    source: bookingData ? 'free_trial' : 'manual'
  });

  const handleSessionsChange = (val: number) => {
    let price = val === 6 ? 1000 : val === 10 ? 1600 : Math.round((val / 6) * 1000);
    setFormData({ ...formData, package_sessions: val, package_price: price });
  };

  const toggleDay = (day: number) => {
    const days = [...formData.session_days];
    if (days.includes(day)) {
      setFormData({ ...formData, session_days: days.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, session_days: [...days, day] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_name || !formData.student_phone || formData.session_days.length === 0) {
      alert("الرجاء إدخال الاسم ورقم الهاتف واختيار يوم واحد على الأقل.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[20px] bg-[#fef0f8] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#ef5da8]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#262626]">إضافة مشترك جديد</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="add-subscriber-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">اسم الطالب <span className="text-red-500">*</span></label>
                <input type="text" value={formData.student_name} onChange={e => setFormData({...formData, student_name: e.target.value})} required className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">رقم هاتف الطالب (واتساب) <span className="text-red-500">*</span></label>
                <input type="text" value={formData.student_phone} onChange={e => setFormData({...formData, student_phone: e.target.value})} required dir="ltr" className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30 text-right" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">رقم ولي الأمر (اختياري)</label>
                <input type="text" value={formData.parent_phone} onChange={e => setFormData({...formData, parent_phone: e.target.value})} dir="ltr" className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30 text-right" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">البريد الإلكتروني</label>
                <input type="email" value={formData.student_email} onChange={e => setFormData({...formData, student_email: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">الصف/العمر</label>
                <input type="text" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">المنهج</label>
                <input type="text" value={formData.curriculum} onChange={e => setFormData({...formData, curriculum: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">المادة</label>
                <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#262626]">نوع الحصة</label>
                <input type="text" value={formData.course_type} onChange={e => setFormData({...formData, course_type: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4">
              <h3 className="text-[15px] font-extrabold text-[#262626]">تفاصيل الباقة والجدول</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#262626]">عدد الحصص</label>
                  <div className="flex gap-2">
                    <input type="number" value={formData.package_sessions} onChange={e => handleSessionsChange(parseInt(e.target.value)||0)} className="w-20 bg-[#f8f9fa] border-none rounded-xl px-3 py-2.5 text-sm text-center outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
                    <div className="flex gap-1">
                      {[6, 8, 10, 12].map(num => (
                        <button type="button" key={num} onClick={() => handleSessionsChange(num)} className={`px-3 rounded-xl text-[12px] font-bold transition-colors ${formData.package_sessions === num ? 'bg-[#262626] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#262626]">السعر (درهم)</label>
                  <input type="number" value={formData.package_price} onChange={e => setFormData({...formData, package_price: parseFloat(e.target.value)||0})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#262626]">أيام الحصص <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {daysAr.map((day, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleDay(idx)}
                      className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-colors ${
                        formData.session_days.includes(idx) 
                          ? 'bg-[#fef0f8] text-[#ef5da8] border border-[#ef5da8]/30' 
                          : 'bg-[#f8f9fa] text-gray-600 border border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#262626]">تاريخ البداية</label>
                  <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#262626]">الوقت المفضل</label>
                  <input type="time" value={formData.preferred_time} onChange={e => setFormData({...formData, preferred_time: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#262626]">مدة الحصة (دقيقة)</label>
                  <input type="number" value={formData.session_duration} onChange={e => setFormData({...formData, session_duration: parseInt(e.target.value)||60})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#262626]">ملاحظات (اختياري)</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#f8f9fa] border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#ef5da8]/30 min-h-[80px] resize-none" placeholder="أي ملاحظات إضافية..." />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-[60px] text-[14px] font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            إلغاء
          </button>
          <button 
            type="submit" 
            form="add-subscriber-form" 
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-[60px] text-[14px] font-bold text-white bg-[#262626] hover:bg-[#3a3a3a] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ وإضافة'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
