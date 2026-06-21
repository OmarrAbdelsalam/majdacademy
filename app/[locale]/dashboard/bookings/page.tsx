"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Video } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("start_time", { ascending: true })
      .gte("start_time", new Date().toISOString());

    if (!error && data && data.length > 0) {
      setBookings(data);
    } else {
      // Dummy data for testing
      setBookings([
        {
          id: 'test-1',
          student_name: 'أحمد محمود',
          start_time: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          course_type: 'تأسيس لغة عربية',
          student_level: 'المرحلة الابتدائية - الصف الثالث',
          package_name: 'الباقة الماسية',
          student_phone: '+966 50 123 4567',
          student_email: 'ahmed@example.com',
          google_event_id: 'test_event_1'
        },
        {
          id: 'test-2',
          student_name: 'سارة خالد',
          start_time: new Date(Date.now() + 86400000 * 2).toISOString(), // day after tomorrow
          course_type: 'متابعة المنهج',
          student_level: 'المرحلة الإعدادية - الصف الثاني',
          package_name: 'الباقة الذهبية',
          student_phone: '+966 55 987 6543',
          student_email: 'sara@example.com',
          google_event_id: 'test_event_2'
        },
        {
          id: 'test-3',
          student_name: 'عمر ياسر',
          start_time: new Date(Date.now() + 86400000 * 4).toISOString(), 
          course_type: 'نطق سليم (نور البيان)',
          student_level: 'مرحلة الروضة',
          package_name: 'الباقة الفضية',
          student_phone: '+966 56 111 2222',
          student_email: 'omar@example.com',
          google_event_id: 'test_event_3'
        }
      ]);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <BookingsSkeleton />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      <div>
        <h1 className="text-[#262626] font-extrabold text-2xl md:text-3xl leading-[120%] mb-2">
          الحجوزات القادمة
        </h1>
        <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)] leading-[24px]">
          هنا تظهر جميع الحصص التجريبية التي تم حجزها من قبل الطلاب.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-[#f8f9fa] rounded-[24px] p-12 text-center border border-[rgba(38,38,38,0.05)]">
          <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-8 h-8 text-[rgba(38,38,38,0.2)]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#262626] mb-2">لا توجد حجوزات قادمة</h3>
          <p className="text-[14px] font-medium text-[rgba(38,38,38,0.6)]">عندما يقوم الطلاب بالحجز ستظهر تفاصيل حصصهم هنا.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => {
            const startDate = parseISO(booking.start_time);
            
            return (
              <div key={booking.id} className="bg-white rounded-[24px] border border-[rgba(38,38,38,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-6 flex flex-col gap-5">
                {/* Header: Date & Time */}
                <div className="flex items-start justify-between border-b border-[rgba(38,38,38,0.05)] pb-4">
                  <div>
                    <p className="text-[#ef5da8] font-extrabold text-[13px] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {format(startDate, "EEEE، d MMMM", { locale: ar })}
                    </p>
                    <p className="text-[#262626] font-extrabold text-[18px] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[rgba(38,38,38,0.4)]" />
                      {format(startDate, "h:mm a")}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-[#fef0f8] text-[#ef5da8] text-[12px] font-extrabold rounded-[60px]">
                    مؤكد
                  </span>
                </div>

                {/* Student Details */}
                <div className="flex-1 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[20px] bg-[#f8f9fa] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-5 h-5 text-[rgba(38,38,38,0.6)]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold text-[#262626] mb-1">{booking.student_name}</p>
                      <div className="text-[13px] text-[rgba(38,38,38,0.6)] font-medium space-y-1">
                        <p><span className="text-[rgba(38,38,38,0.4)]">الدولة/المنهج:</span> {booking.curriculum || 'غير محدد'}</p>
                        <p><span className="text-[rgba(38,38,38,0.4)]">الصف/العمر:</span> {booking.grade || booking.child_age || 'غير محدد'}</p>
                        <p><span className="text-[rgba(38,38,38,0.4)]">النوع:</span> {booking.course_type || 'غير محدد'}</p>
                        <p><span className="text-[rgba(38,38,38,0.4)]">المادة/المستوى:</span> {booking.subject || booking.student_level || 'غير محدد'}</p>
                        <p><span className="text-[rgba(38,38,38,0.4)]">الباقة:</span> {booking.package_name || 'غير محدد'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[20px] bg-[#f8f9fa] flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-[rgba(38,38,38,0.6)]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-extrabold text-[#262626]" dir="ltr">{booking.student_phone}</p>
                        <p className="text-[12px] font-medium text-[rgba(38,38,38,0.6)] truncate max-w-[150px]">{booking.student_email}</p>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://wa.me/${booking.student_phone?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-[20px] bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center shrink-0 transition-all duration-200"
                      title="مراسلة عبر واتساب"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12.0003 2.00018C6.47715 2.00018 2 6.47733 2 12.0005C2 13.9161 2.54133 15.7061 3.47952 17.2094L2.00427 22.0002L6.90317 20.5316C8.35165 21.3658 10.108 21.8493 12.0003 21.8493C17.5234 21.8493 22.0006 17.3722 22.0006 11.849C22.0006 6.32587 17.5234 2.00018 12.0003 2.00018ZM17.1856 16.2736C16.9697 16.8837 15.932 17.3722 15.2891 17.4727C14.8194 17.5458 14.1287 17.6554 11.6669 16.636C8.51357 15.3308 6.46747 12.1288 6.30906 11.9187C6.15065 11.7085 5.0005 10.1804 5.0005 8.59972C5.0005 7.01901 5.80936 6.24237 6.13289 5.91851C6.42048 5.6311 6.88851 5.50022 7.32049 5.50022C7.46445 5.50022 7.59404 5.50753 7.70923 5.51484C8.04033 5.53676 8.20593 5.55869 8.42186 6.07641C8.68097 6.69466 9.3144 8.23938 9.38638 8.39288C9.45835 8.54638 9.5591 8.76566 9.44391 8.99226C9.33592 9.21153 9.22792 9.32847 9.06951 9.51121C8.9111 9.69395 8.75988 9.84013 8.60147 10.0375C8.4575 10.2056 8.2919 10.3883 8.47188 10.6953C8.65185 11.0022 9.30002 12.062 10.2575 12.9103C11.4944 14.0063 12.4947 14.3571 12.8258 14.5033C13.1569 14.6495 13.5168 14.6202 13.7328 14.3863C13.9919 14.1086 14.3086 13.6335 14.6321 13.1584C14.8625 12.8222 15.136 12.7783 15.4236 12.888C15.7112 12.9976 17.2371 13.7505 17.5395 13.904C17.8419 14.0575 18.0434 14.1306 18.1154 14.2548C18.1874 14.379 18.1874 15.0003 17.1856 16.2736Z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 mt-auto">
                  <a 
                    href={`https://calendar.google.com/calendar/u/0/r/eventedit/${booking.google_event_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#4285F4]/5 text-[#4285F4] hover:bg-[#4285F4] hover:text-white font-bold text-[14px] rounded-[60px] transition-all duration-200"
                  >
                    <Video className="w-[18px] h-[18px]" />
                    فتح في Google Calendar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-0" dir="rtl">
      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-gray-100 rounded-lg w-full max-w-md animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between border-b border-gray-50 pb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-6 w-12 bg-gray-100 rounded-[60px] animate-pulse"></div>
            </div>

            <div className="flex-1 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[20px] bg-gray-100 shrink-0 animate-pulse"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-28 animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-[20px] bg-gray-100 shrink-0 animate-pulse"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-[20px] bg-gray-100 shrink-0 animate-pulse"></div>
              </div>
            </div>

            <div className="pt-2 mt-auto">
              <div className="w-full h-[44px] bg-gray-100 rounded-[60px] animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
