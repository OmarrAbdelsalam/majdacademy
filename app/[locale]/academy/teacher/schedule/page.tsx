'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { ScheduleEntry } from '@/lib/academy/types';

export default function TeacherSchedulePage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editLink, setEditLink] = useState('');

  const dayNames = isRTL
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    async function loadData() {
      try {
        const entries = await services.schedule.getSchedule({ teacherId: user.id });
        setSchedule(entries);
      } catch (error) {
        console.error('Failed to load schedule:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services, user.id]);

  function isActiveNow(entry: ScheduleEntry): boolean {
    const now = new Date();
    const currentDay = now.getDay();
    if (currentDay !== entry.dayOfWeek) return false;

    const [startH, startM] = entry.startTime.split(':').map(Number);
    const [endH, endM] = entry.endTime.split(':').map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  function getEntriesForDay(day: number): ScheduleEntry[] {
    return schedule
      .filter((e) => e.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  function startEditing(entry: ScheduleEntry) {
    setEditingEntry(entry.id);
    setEditNotes(entry.notes || '');
    setEditLink(entry.meetingLink || '');
  }

  async function saveEditing(entryId: string) {
    try {
      const updated = await services.schedule.updateScheduleEntry(entryId, {
        notes: editNotes || undefined,
        meetingLink: editLink || undefined,
      });
      setSchedule((prev) =>
        prev.map((e) => (e.id === entryId ? updated : e))
      );
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to update schedule entry:', error);
    }
  }

  // Show weekdays only (Sunday=0 to Thursday=4 for Middle East schedule)
  const weekDays = [0, 1, 2, 3, 4];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'جدول الحصص' : 'Teaching Schedule'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'جدولك الأسبوعي للحصص الدراسية' : 'Your weekly teaching schedule'}
        </p>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="space-y-4">
        {weekDays.map((day) => {
          const entries = getEntriesForDay(day);
          const isToday = new Date().getDay() === day;

          return (
            <div
              key={day}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                isToday ? 'border-[#F0548B]/50 ring-1 ring-[#F0548B]/20' : 'border-gray-200'
              }`}
            >
              {/* Day Header */}
              <div className={`px-4 py-3 border-b ${isToday ? 'bg-[#fef0f5] border-[#F0548B]/20' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${isToday ? 'text-[#F0548B]' : 'text-gray-700'}`}>
                    {dayNames[day]}
                  </h3>
                  {isToday && (
                    <span className="px-2 py-0.5 text-xs bg-[#F0548B] text-white rounded-full">
                      {isRTL ? 'اليوم' : 'Today'}
                    </span>
                  )}
                </div>
              </div>

              {/* Day Entries */}
              <div className="p-4">
                {entries.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    {isRTL ? 'لا توجد حصص' : 'No classes scheduled'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry) => {
                      const active = isActiveNow(entry);
                      const isEditing = editingEntry === entry.id;

                      return (
                        <div
                          key={entry.id}
                          className={`p-3 rounded-lg border transition-all ${
                            active
                              ? 'border-green-300 bg-green-50 ring-1 ring-green-200'
                              : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">
                                  {entry.subject}
                                </span>
                                {active && (
                                  <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full animate-pulse">
                                    {isRTL ? 'الآن' : 'Live'}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                <span>🕐 {entry.startTime} - {entry.endTime}</span>
                                <span>🎓 {entry.grade}</span>
                              </div>
                              {entry.notes && !isEditing && (
                                <p className="mt-1 text-xs text-gray-500 italic">📝 {entry.notes}</p>
                              )}
                              {entry.meetingLink && !isEditing && (
                                <a
                                  href={entry.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 inline-block text-xs text-blue-600 hover:text-blue-700"
                                >
                                  🔗 {isRTL ? 'رابط الحصة' : 'Meeting Link'}
                                </a>
                              )}
                            </div>

                            {!isEditing && (
                              <button
                                onClick={() => startEditing(entry)}
                                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                              >
                                ✏️
                              </button>
                            )}
                          </div>

                          {/* Edit Mode */}
                          {isEditing && (
                            <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                              <div>
                                <label className="text-xs text-gray-500">
                                  {isRTL ? 'ملاحظات' : 'Notes'}
                                </label>
                                <input
                                  type="text"
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#F0548B]"
                                  placeholder={isRTL ? 'أضف ملاحظة...' : 'Add a note...'}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  {isRTL ? 'رابط الاجتماع' : 'Meeting Link'}
                                </label>
                                <input
                                  type="url"
                                  value={editLink}
                                  onChange={(e) => setEditLink(e.target.value)}
                                  className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#F0548B]"
                                  placeholder="https://..."
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEditing(entry.id)}
                                  className="px-3 py-1 text-xs bg-[#F0548B] text-white rounded hover:bg-[#d6477a]"
                                >
                                  {isRTL ? 'حفظ' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingEntry(null)}
                                  className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                                >
                                  {isRTL ? 'إلغاء' : 'Cancel'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
