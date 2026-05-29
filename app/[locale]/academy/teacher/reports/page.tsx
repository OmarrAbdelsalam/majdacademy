'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Report, Student, ReportPeriod } from '@/lib/academy/types';

export default function TeacherReportsPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [reports, setReports] = useState<Report[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  // Generate form state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('monthly');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [teacherComments, setTeacherComments] = useState('');
  const [generateForClass, setGenerateForClass] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [reportList, studentList] = await Promise.all([
          services.reports.getReports({ teacherId: user.id }),
          services.users.getStudents(),
        ]);
        setReports(reportList);
        setStudents(studentList);
      } catch (error) {
        console.error('Failed to load reports data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services, user.id]);

  function getStudentName(studentId: string): string {
    const student = students.find((s) => s.id === studentId);
    return student?.name || studentId;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function getPeriodLabel(period: ReportPeriod): string {
    const labels: Record<ReportPeriod, { ar: string; en: string }> = {
      weekly: { ar: 'أسبوعي', en: 'Weekly' },
      monthly: { ar: 'شهري', en: 'Monthly' },
      term: { ar: 'فصلي', en: 'Term' },
    };
    return isRTL ? labels[period].ar : labels[period].en;
  }

  async function handleGenerateReport(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (generateForClass) {
        // Generate for all students in the selected grade
        const classStudents = students.filter((s) => s.grade === selectedGrade);
        for (const student of classStudents) {
          const attendanceStats = await services.attendance.getAttendanceStats(student.id);
          await services.reports.generateReport({
            studentId: student.id,
            teacherId: user.id,
            subject: selectedSubject,
            period: selectedPeriod,
            periodStart,
            periodEnd,
            averageScore: Math.round(Math.random() * 40 + 60), // Mock average
            attendanceSummary: attendanceStats,
            teacherComments,
          });
        }
      } else {
        const attendanceStats = await services.attendance.getAttendanceStats(selectedStudentId);
        await services.reports.generateReport({
          studentId: selectedStudentId,
          teacherId: user.id,
          subject: selectedSubject,
          period: selectedPeriod,
          periodStart,
          periodEnd,
          averageScore: Math.round(Math.random() * 40 + 60), // Mock average
          attendanceSummary: attendanceStats,
          teacherComments,
        });
      }

      // Reload reports
      const updatedReports = await services.reports.getReports({ teacherId: user.id });
      setReports(updatedReports);
      setShowGenerateForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  }

  function resetForm() {
    setSelectedStudentId('');
    setSelectedSubject('');
    setSelectedPeriod('monthly');
    setPeriodStart('');
    setPeriodEnd('');
    setTeacherComments('');
    setGenerateForClass(false);
    setSelectedGrade('');
  }

  async function handleExportPdf(reportId: string) {
    try {
      const blob = await services.reports.exportReportPdf(reportId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  }

  const uniqueGrades = [...new Set(students.map((s) => s.grade))];

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isRTL ? 'التقارير' : 'Reports'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isRTL ? 'إنشاء وإدارة تقارير الطلاب' : 'Generate and manage student reports'}
          </p>
        </div>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="px-4 py-2 bg-[#F0548B] text-white rounded-lg hover:bg-[#d6477a] transition-colors"
        >
          {isRTL ? '+ إنشاء تقرير' : '+ Generate Report'}
        </button>
      </div>

      {/* Generate Form Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isRTL ? 'إنشاء تقرير جديد' : 'Generate New Report'}
            </h2>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              {/* Toggle: Individual or Class */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!generateForClass}
                    onChange={() => setGenerateForClass(false)}
                    className="text-[#F0548B]"
                  />
                  <span className="text-sm">{isRTL ? 'طالب محدد' : 'Individual Student'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={generateForClass}
                    onChange={() => setGenerateForClass(true)}
                    className="text-[#F0548B]"
                  />
                  <span className="text-sm">{isRTL ? 'صف كامل' : 'Entire Class'}</span>
                </label>
              </div>

              {generateForClass ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'الصف' : 'Grade'}
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                  >
                    <option value="">{isRTL ? 'اختر الصف' : 'Select Grade'}</option>
                    {uniqueGrades.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'الطالب' : 'Student'}
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                  >
                    <option value="">{isRTL ? 'اختر الطالب' : 'Select Student'}</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'المادة' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الفترة' : 'Period'}
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                >
                  <option value="weekly">{isRTL ? 'أسبوعي' : 'Weekly'}</option>
                  <option value="monthly">{isRTL ? 'شهري' : 'Monthly'}</option>
                  <option value="term">{isRTL ? 'فصلي' : 'Term'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'من' : 'From'}
                  </label>
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'إلى' : 'To'}
                  </label>
                  <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'ملاحظات المعلم' : 'Teacher Comments'}
                </label>
                <textarea
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F0548B] text-white rounded-lg hover:bg-[#d6477a] transition-colors"
                >
                  {isRTL ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowGenerateForm(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {isRTL ? 'لا توجد تقارير بعد' : 'No reports generated yet'}
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {getStudentName(report.studentId)}
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                      {getPeriodLabel(report.period)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                    <span>📚 {report.subject}</span>
                    <span>📅 {formatDate(report.periodStart)} — {formatDate(report.periodEnd)}</span>
                    <span>🗓️ {isRTL ? 'أُنشئ:' : 'Created:'} {formatDate(report.createdAt)}</span>
                  </div>

                  {/* Report Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">{isRTL ? 'المعدل' : 'Average Score'}</p>
                      <p className="text-lg font-bold text-blue-800">{report.averageScore}%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">{isRTL ? 'الحضور' : 'Attendance'}</p>
                      <p className="text-lg font-bold text-green-800">
                        {report.attendanceSummary.present}/{report.attendanceSummary.totalSessions}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-600">{isRTL ? 'التأخير/الغياب' : 'Late/Absent'}</p>
                      <p className="text-lg font-bold text-orange-800">
                        {report.attendanceSummary.late + report.attendanceSummary.absent}
                      </p>
                    </div>
                  </div>

                  {report.teacherComments && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">{isRTL ? 'ملاحظات المعلم' : 'Teacher Comments'}</p>
                      <p className="text-sm text-gray-700">{report.teacherComments}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleExportPdf(report.id)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  📄 {isRTL ? 'تصدير PDF' : 'Export PDF'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
