'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Parent, Student, Report, Notification } from '@/lib/academy/types';

export default function ParentReportsPage() {
  const { user, services, locale } = useAcademy();
  const parent = user as Parent;
  const isRTL = locale === 'ar';

  const [child, setChild] = useState<Student | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [newReportIds, setNewReportIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const childId = parent.childrenIds[0];
        if (!childId) {
          setLoading(false);
          return;
        }

        const childUser = await services.users.getUserById(childId);
        if (!childUser || childUser.role !== 'student') {
          setLoading(false);
          return;
        }
        setChild(childUser as Student);

        const [reportsData, notifications] = await Promise.all([
          services.reports.getReports({ studentId: childId }),
          services.notifications.getNotifications(user.id),
        ]);

        // Sort reports by date descending
        reportsData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReports(reportsData);

        // Find unread report notifications to mark new reports
        const unreadReportNotifs = notifications.filter(
          (n) => n.type === 'report_generated' && !n.isRead
        );
        // Extract report IDs from notification links (e.g., /academy/parent/reports)
        // Mark reports created after the oldest unread notification as "new"
        if (unreadReportNotifs.length > 0) {
          const oldestUnread = unreadReportNotifs.reduce((oldest, n) =>
            new Date(n.createdAt) < new Date(oldest.createdAt) ? n : oldest
          );
          const newIds = new Set<string>();
          for (const report of reportsData) {
            if (new Date(report.createdAt) >= new Date(oldestUnread.createdAt)) {
              newIds.add(report.id);
            }
          }
          setNewReportIds(newIds);
        }
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [services, parent.childrenIds, user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  if (!child) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="text-center py-12">
        <span className="text-4xl block mb-4">👨‍👩‍👧</span>
        <p className="text-gray-500">
          {isRTL ? 'لا يوجد طالب مرتبط بحسابك' : 'No student linked to your account'}
        </p>
      </div>
    );
  }

  const periodLabel = (period: string) => {
    switch (period) {
      case 'weekly': return isRTL ? 'أسبوعي' : 'Weekly';
      case 'monthly': return isRTL ? 'شهري' : 'Monthly';
      case 'term': return isRTL ? 'فصلي' : 'Term';
      default: return period;
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'التقارير' : 'Reports'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL
            ? `تقارير ${child.name} الدراسية`
            : `${child.name}'s academic reports`}
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">📄</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد تقارير حالياً' : 'No reports available'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const isExpanded = expandedId === report.id;
            const isNew = newReportIds.has(report.id);

            return (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Summary */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : report.id)}
                  className="w-full p-4 text-start hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-gray-800">{report.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {periodLabel(report.period)} • {new Date(report.periodStart).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')} - {new Date(report.periodEnd).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      {isNew && (
                        <span className="text-xs bg-[#F0548B] text-white px-2 py-0.5 rounded-full font-medium">
                          {isRTL ? 'جديد' : 'New'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${
                        report.averageScore >= 80 ? 'text-green-600' :
                        report.averageScore >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {report.averageScore}%
                      </span>
                      <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    {/* Score breakdown */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        {isRTL ? 'المعدل' : 'Average Score'}
                      </h4>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${report.averageScore}%`,
                            backgroundColor: report.averageScore >= 80 ? '#10b981' : report.averageScore >= 60 ? '#f59e0b' : '#ef4444' }}
                        />
                      </div>
                    </div>

                    {/* Attendance summary */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        {isRTL ? 'ملخص الحضور' : 'Attendance Summary'}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                          <p className="text-lg font-bold text-gray-800">{report.attendanceSummary.totalSessions}</p>
                          <p className="text-xs text-gray-500">{isRTL ? 'إجمالي' : 'Total'}</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                          <p className="text-lg font-bold text-green-600">{report.attendanceSummary.present}</p>
                          <p className="text-xs text-gray-500">{isRTL ? 'حاضر' : 'Present'}</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                          <p className="text-lg font-bold text-red-600">{report.attendanceSummary.absent}</p>
                          <p className="text-xs text-gray-500">{isRTL ? 'غائب' : 'Absent'}</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-gray-100">
                          <p className="text-lg font-bold text-amber-600">{report.attendanceSummary.late}</p>
                          <p className="text-xs text-gray-500">{isRTL ? 'متأخر' : 'Late'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Teacher comments */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        {isRTL ? 'ملاحظات المعلم' : 'Teacher Comments'}
                      </h4>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                        {report.teacherComments}
                      </p>
                    </div>

                    {/* Report date */}
                    <p className="text-xs text-gray-400 mt-3">
                      {isRTL ? 'تاريخ التقرير:' : 'Report date:'}{' '}
                      {new Date(report.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
