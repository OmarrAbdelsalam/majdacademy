'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import ProgressBar from '@/app/components/academy/ProgressBar';
import Badge from '@/app/components/academy/Badge';
import StatCard from '@/app/components/academy/StatCard';
import type { Student, ProgressStats, Exam, Homework } from '@/lib/academy/types';

export default function StudentHomePage() {
  const { user, services, locale } = useAcademy();
  const student = user as Student;
  const isRTL = locale === 'ar';

  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [pendingHomework, setPendingHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [progressData, exams, homework] = await Promise.all([
          services.progress.getProgressStats(user.id),
          services.exams.getExams({ assignedTo: user.id }),
          services.homework.getHomework({ studentId: user.id }),
        ]);

        setProgress(progressData);

        // Filter upcoming exams (published and not yet ended)
        const now = new Date();
        const upcoming = exams.filter(
          (e) => e.status === 'published' && new Date(e.endDate) >= now
        );
        setUpcomingExams(upcoming);

        // Filter pending homework (not yet due)
        const pending = homework.filter(
          (h) => new Date(h.dueDate) >= now
        );
        setPendingHomework(pending);
      } catch (error) {
        console.error('Failed to load student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [services, user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  const trendIcon = progress?.periodComparison.trend === 'up' ? '📈' : progress?.periodComparison.trend === 'down' ? '📉' : '➡️';
  const trendLabel = progress?.periodComparison.trend === 'up'
    ? (isRTL ? 'تحسن' : 'Improved')
    : progress?.periodComparison.trend === 'down'
      ? (isRTL ? 'تراجع' : 'Declined')
      : (isRTL ? 'مستقر' : 'Stable');

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? `مرحباً، ${user.name}` : `Welcome, ${user.name}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'إليك ملخص تقدمك الدراسي' : "Here's your academic progress summary"}
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          count={Math.round(progress?.overallAverage ?? 0)}
          label={isRTL ? 'المعدل العام' : 'Overall Average'}
          icon="🎯"
        />
        <StatCard
          count={progress?.subjectAverages.length ?? 0}
          label={isRTL ? 'المواد' : 'Subjects'}
          icon="📚"
        />
        <StatCard
          count={upcomingExams.length}
          label={isRTL ? 'اختبارات قادمة' : 'Upcoming Exams'}
          icon="📝"
        />
        <StatCard
          count={pendingHomework.length}
          label={isRTL ? 'واجبات معلقة' : 'Pending Homework'}
          icon="📋"
        />
      </div>

      {/* Period Comparison */}
      {progress?.periodComparison && (
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {isRTL ? 'مقارنة الفترات' : 'Period Comparison'}
          </h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{isRTL ? 'الفترة الحالية:' : 'Current:'}</span>
              <span className="text-lg font-bold text-gray-800">
                {Math.round(progress.periodComparison.currentAverage)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{isRTL ? 'الفترة السابقة:' : 'Previous:'}</span>
              <span className="text-lg font-bold text-gray-600">
                {Math.round(progress.periodComparison.previousAverage)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{trendIcon}</span>
              <span className={`text-sm font-medium ${
                progress.periodComparison.trend === 'up' ? 'text-green-600' :
                progress.periodComparison.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {trendLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Subject Averages */}
      {progress && progress.subjectAverages.length > 0 && (
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isRTL ? 'معدلات المواد' : 'Subject Averages'}
          </h2>
          <div className="space-y-4">
            {progress.subjectAverages.map((sa) => (
              <ProgressBar
                key={sa.subject}
                percentage={sa.average}
                label={sa.subject}
                showPercentage
                color={sa.average >= 80 ? '#10b981' : sa.average >= 60 ? '#f59e0b' : '#ef4444'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      {progress && progress.badges.length > 0 && (
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isRTL ? 'الإنجازات' : 'Achievements'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {progress.badges.map((badge) => (
              <Badge
                key={badge.id}
                icon={badge.icon}
                title={badge.title}
                description={badge.description}
                earnedAt={badge.earnedAt}
                size="md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Guardian Info - Only for regular students (Task 7.8) */}
      {student.studentType === 'regular' && student.parentId && (
        <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {isRTL ? 'معلومات ولي الأمر' : 'Guardian Information'}
          </h2>
          <p className="text-sm text-gray-600">
            {isRTL
              ? 'حسابك مرتبط بولي أمر يمكنه متابعة تقدمك الدراسي.'
              : 'Your account is linked to a guardian who can monitor your academic progress.'}
          </p>
        </div>
      )}

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
                    <div className="text-end">
                      <p className="text-xs text-gray-500">
                        {new Date(exam.startDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                      </p>
                      <Link
                        href={`/${locale}/academy/student/exams`}
                        className="text-xs text-[#F0548B] hover:underline"
                      >
                        {isRTL ? 'عرض' : 'View'}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pending Homework */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'الواجبات المعلقة' : 'Pending Homework'}
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {pendingHomework.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {isRTL ? 'لا توجد واجبات معلقة' : 'No pending homework'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pendingHomework.map((hw) => (
                <li key={hw.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{hw.title}</p>
                      <p className="text-xs text-gray-500">{hw.subject}</p>
                    </div>
                    <div className="text-end">
                      <p className="text-xs text-gray-500">
                        {isRTL ? 'الموعد النهائي:' : 'Due:'}{' '}
                        {new Date(hw.dueDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                      </p>
                      <Link
                        href={`/${locale}/academy/student/homework`}
                        className="text-xs text-[#F0548B] hover:underline"
                      >
                        {isRTL ? 'تسليم' : 'Submit'}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
