'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import StatCard from '@/app/components/academy/StatCard';
import type { Parent, Student, Submission, Exam, Report } from '@/lib/academy/types';

export default function ParentHomePage() {
  const { user, services, locale } = useAcademy();
  const parent = user as Parent;
  const isRTL = locale === 'ar';

  const [child, setChild] = useState<Student | null>(null);
  const [recentScores, setRecentScores] = useState<{ exam: Exam; submission: Submission }[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Get first child
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

        const [submissions, exams, reports] = await Promise.all([
          services.submissions.getSubmissions({ studentId: childId }),
          services.exams.getExams({ assignedTo: childId }),
          services.reports.getReports({ studentId: childId }),
        ]);

        // Recent graded submissions (last 5)
        const graded = submissions
          .filter((s) => s.status === 'graded' || s.status === 'partially_graded')
          .sort((a, b) => {
            const dateA = a.submittedAt || a.startedAt;
            const dateB = b.submittedAt || b.startedAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
          .slice(0, 5);

        const recentResults = graded
          .map((sub) => {
            const exam = exams.find((e) => e.id === sub.examId);
            return exam ? { exam, submission: sub } : null;
          })
          .filter(Boolean) as { exam: Exam; submission: Submission }[];

        setRecentScores(recentResults);

        // Upcoming exams
        const now = new Date();
        const upcoming = exams
          .filter((e) => e.status === 'published' && new Date(e.endDate) >= now)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 5);
        setUpcomingExams(upcoming);

        // Latest report
        if (reports.length > 0) {
          const sorted = [...reports].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setLatestReport(sorted[0]);
        }
      } catch (error) {
        console.error('Failed to load parent dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [services, parent.childrenIds]);

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

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? `مرحباً، ${user.name}` : `Welcome, ${user.name}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL
            ? `متابعة تقدم ${child.name} الدراسي`
            : `Monitoring ${child.name}'s academic progress`}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          count={recentScores.length}
          label={isRTL ? 'اختبارات مكتملة' : 'Completed Exams'}
          icon="✅"
        />
        <StatCard
          count={upcomingExams.length}
          label={isRTL ? 'اختبارات قادمة' : 'Upcoming Exams'}
          icon="📝"
        />
        <StatCard
          count={latestReport ? Math.round(latestReport.averageScore) : 0}
          label={isRTL ? 'آخر معدل' : 'Latest Average'}
          icon="📊"
        />
      </div>

      {/* Recent Exam Scores */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isRTL ? 'آخر درجات الاختبارات' : 'Recent Exam Scores'}
          </h2>
          <Link
            href={`/${locale}/academy/parent/exams`}
            className="text-sm text-[#F0548B] hover:underline"
          >
            {isRTL ? 'عرض الكل' : 'View All'}
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {recentScores.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {isRTL ? 'لا توجد درجات بعد' : 'No scores yet'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentScores.map(({ exam, submission }) => (
                <li key={submission.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{exam.title}</p>
                      <p className="text-xs text-gray-500">{exam.subject}</p>
                    </div>
                    <div className="text-end">
                      <p className={`text-lg font-bold ${
                        (submission.percentage ?? 0) >= 80 ? 'text-green-600' :
                        (submission.percentage ?? 0) >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {submission.percentage != null ? `${Math.round(submission.percentage)}%` : '—'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {submission.totalScore ?? 0}/{exam.totalPoints}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'الاختبارات القادمة' : 'Upcoming Exams'}
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {upcomingExams.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {isRTL ? 'لا توجد اختبارات قادمة' : 'No upcoming exams'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingExams.map((exam) => (
                <li key={exam.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{exam.title}</p>
                      <p className="text-xs text-gray-500">
                        {exam.subject} • {exam.duration} {isRTL ? 'دقيقة' : 'min'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(exam.startDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Latest Report */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isRTL ? 'آخر تقرير' : 'Latest Report'}
          </h2>
          <Link
            href={`/${locale}/academy/parent/reports`}
            className="text-sm text-[#F0548B] hover:underline"
          >
            {isRTL ? 'عرض الكل' : 'View All'}
          </Link>
        </div>
        {latestReport ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <p className="font-medium text-gray-800">{latestReport.subject}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {latestReport.period === 'weekly' ? (isRTL ? 'أسبوعي' : 'Weekly') :
                   latestReport.period === 'monthly' ? (isRTL ? 'شهري' : 'Monthly') :
                   (isRTL ? 'فصلي' : 'Term')}
                  {' • '}
                  {new Date(latestReport.periodStart).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  {' - '}
                  {new Date(latestReport.periodEnd).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                </p>
              </div>
              <span className={`text-xl font-bold ${
                latestReport.averageScore >= 80 ? 'text-green-600' :
                latestReport.averageScore >= 60 ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {latestReport.averageScore}%
              </span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {latestReport.teacherComments}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-400">
            {isRTL ? 'لا توجد تقارير بعد' : 'No reports yet'}
          </div>
        )}
      </div>
    </div>
  );
}
