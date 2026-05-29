'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Student, ScheduleEntry } from '@/lib/academy/types';

const DAY_NAMES_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StudentSchedulePage() {
  const { user, services, locale } = useAcademy();
  const student = user as Student;
  const isRTL = locale === 'ar';

  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await services.schedule.getSchedule({ grade: student.grade });
        setSchedule(data);
      } catch (error) {
        console.error('Failed to load schedule:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, [services, student.grade]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  // Group schedule by day
  const scheduleByDay: Record<number, ScheduleEntry[]> = {};
  for (const entry of schedule) {
    if (!scheduleByDay[entry.dayOfWeek]) {
      scheduleByDay[entry.dayOfWeek] = [];
    }
    scheduleByDay[entry.dayOfWeek].push(entry);
  }

  // Sort entries within each day by start time
  for (const day of Object.keys(scheduleByDay)) {
    scheduleByDay[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  // Check if a class is currently active
  const now = new Date();
  const currentDay = now.getDay();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  function isActiveClass(entry: ScheduleEntry): boolean {
    return (
      entry.dayOfWeek === currentDay &&
      entry.startTime <= currentTimeStr &&
      entry.endTime > currentTimeStr
    );
  }

  const dayNames = isRTL ? DAY_NAMES_AR : DAY_NAMES_EN;
  // Show days 0-4 (Sunday to Thursday) for typical school week
  const schoolDays = [0, 1, 2, 3, 4];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'الجدول الأسبوعي' : 'Weekly Schedule'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'جدول حصصك الأسبوعي' : 'Your weekly class schedule'}
        </p>
      </div>

      <div className="space-y-4">
        {schoolDays.map((day) => {
          const entries = scheduleByDay[day] || [];
          const isToday = day === currentDay;

          return (
            <div
              key={day}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                isToday ? 'border-[#F0548B]/50 ring-1 ring-[#F0548B]/20' : 'border-gray-200'
              }`}
            >
              <div className={`px-4 py-3 ${isToday ? 'bg-[#fef0f5]' : 'bg-gray-50'} border-b border-gray-100`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{dayNames[day]}</h3>
                  {isToday && (
                    <span className="text-xs bg-[#F0548B] text-white px-2 py-0.5 rounded-full">
                      {isRTL ? 'اليوم' : 'Today'}
                    </span>
                  )}
                </div>
              </div>

              {entries.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-400">
                  {isRTL ? 'لا توجد حصص' : 'No classes'}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {entries.map((entry) => {
                    const active = isActiveClass(entry);
                    return (
                      <div
                        key={entry.id}
                        className={`p-4 flex items-center justify-between flex-wrap gap-2 ${
                          active ? 'bg-green-50 border-s-4 border-green-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center min-w-[60px]">
                            <p className="text-xs text-gray-500">{entry.startTime}</p>
                            <p className="text-[10px] text-gray-400">-</p>
                            <p className="text-xs text-gray-500">{entry.endTime}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{entry.subject}</p>
                            <p className="text-xs text-gray-500">{entry.teacherName}</p>
                            {entry.notes && (
                              <p className="text-xs text-blue-500 mt-0.5">{entry.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {active && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {isRTL ? 'الآن' : 'Now'}
                            </span>
                          )}
                          {entry.meetingLink && (
                            <a
                              href={entry.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                            >
                              {isRTL ? 'انضم' : 'Join'}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
