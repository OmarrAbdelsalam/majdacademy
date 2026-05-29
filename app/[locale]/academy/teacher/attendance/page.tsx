'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Student, AttendanceStatus, AttendanceSummary } from '@/lib/academy/types';

interface StudentAttendanceRow {
  student: Student;
  status: AttendanceStatus;
  stats: AttendanceSummary | null;
}

export default function TeacherAttendancePage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<StudentAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const studentList = await services.users.getStudents();
        setStudents(studentList);

        // Load attendance stats for each student
        const rows: StudentAttendanceRow[] = [];
        for (const student of studentList) {
          const stats = await services.attendance.getAttendanceStats(student.id);
          rows.push({
            student,
            status: 'present',
            stats,
          });
        }
        setAttendanceRows(rows);
      } catch (error) {
        console.error('Failed to load attendance data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services]);

  function updateStatus(studentId: string, status: AttendanceStatus) {
    setAttendanceRows((prev) =>
      prev.map((row) =>
        row.student.id === studentId ? { ...row, status } : row
      )
    );
    setSaved(false);
  }

  async function handleSaveAttendance() {
    if (!session) return;
    setSaving(true);
    try {
      const records = attendanceRows.map((row) => ({
        studentId: row.student.id,
        teacherId: user.id,
        date: selectedDate,
        session,
        status: row.status,
      }));
      await services.attendance.saveAttendance(records);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setSaving(false);
    }
  }

  function getAttendancePercentage(stats: AttendanceSummary | null): number {
    if (!stats || stats.totalSessions === 0) return 0;
    return Math.round((stats.present / stats.totalSessions) * 100);
  }

  function getStatusColor(status: AttendanceStatus): string {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
    }
  }

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
          {isRTL ? 'تسجيل الحضور والغياب' : 'Attendance Tracking'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'سجّل حضور الطلاب لكل حصة' : 'Record student attendance for each session'}
        </p>
      </div>

      {/* Date and Session Selection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'التاريخ' : 'Date'}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSaved(false); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isRTL ? 'الحصة' : 'Session'}
            </label>
            <input
              type="text"
              value={session}
              onChange={(e) => { setSession(e.target.value); setSaved(false); }}
              placeholder={isRTL ? 'مثال: اللغة العربية - الحصة الأولى' : 'e.g. Math - Period 1'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSaveAttendance}
              disabled={saving || !session}
              className="w-full px-4 py-2 bg-[#F0548B] text-white rounded-lg hover:bg-[#d6477a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...')
                : saved
                  ? (isRTL ? '✓ تم الحفظ' : '✓ Saved')
                  : (isRTL ? 'حفظ الحضور' : 'Save Attendance')}
            </button>
          </div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600">
                  {isRTL ? 'الطالب' : 'Student'}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600">
                  {isRTL ? 'الصف' : 'Grade'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  {isRTL ? 'الحالة' : 'Status'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  {isRTL ? 'نسبة الحضور' : 'Attendance %'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  {isRTL ? 'الإحصائيات' : 'Stats'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceRows.map((row) => {
                const percentage = getAttendancePercentage(row.stats);
                return (
                  <tr key={row.student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#fef0f5] flex items-center justify-center text-sm">
                          👤
                        </div>
                        <span className="text-sm font-medium text-gray-800">{row.student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{row.student.grade}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateStatus(row.student.id, 'present')}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            row.status === 'present'
                              ? 'bg-green-500 text-white'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {isRTL ? 'حاضر' : 'Present'}
                        </button>
                        <button
                          onClick={() => updateStatus(row.student.id, 'absent')}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            row.status === 'absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {isRTL ? 'غائب' : 'Absent'}
                        </button>
                        <button
                          onClick={() => updateStatus(row.student.id, 'late')}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            row.status === 'late'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          }`}
                        >
                          {isRTL ? 'متأخر' : 'Late'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.stats && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="text-green-600">✓{row.stats.present}</span>
                          <span className="text-red-600">✗{row.stats.absent}</span>
                          <span className="text-yellow-600">⏱{row.stats.late}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
