'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import StatCard from '@/app/components/academy/StatCard';
import type { Submission, Student, Exam } from '@/lib/academy/types';

interface RecentActivity {
  id: string;
  studentName: string;
  action: string;
  detail: string;
  time: string;
}

export default function TeacherHomePage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [totalStudents, setTotalStudents] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [students, submissions, exams] = await Promise.all([
          services.users.getStudents(),
          services.submissions.getSubmissions({ status: 'submitted' }),
          services.exams.getExams({ teacherId: user.id }),
        ]);

        setTotalStudents(students.length);
        setPendingSubmissions(submissions.length);

        const now = new Date();
        const upcoming = exams.filter(
          (e: Exam) => e.status === 'published' && new Date(e.startDate) >= now
        );
        setUpcomingExams(upcoming.length);

        // Build recent activities from submissions
        const activities: RecentActivity[] = [];
        const sortedSubs = [...submissions]
          .sort((a, b) => {
            const dateA = a.submittedAt || a.startedAt;
            const dateB = b.submittedAt || b.startedAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
          .slice(0, 5);

        for (const sub of sortedSubs) {
          const student = students.find((s: Student) => s.id === sub.studentId);
          const exam = exams.find((e: Exam) => e.id === sub.examId);
          if (student && exam) {
            activities.push({
              id: sub.id,
              studentName: student.name,
              action: isRTL ? 'أرسل إجابة' : 'Submitted',
              detail: exam.title,
              time: sub.submittedAt || sub.startedAt,
            });
          }
        }
        setRecentActivities(activities);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [services, user.id, isRTL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  const quickActions = [
    {
      label: isRTL ? 'إنشاء اختبار' : 'Create Exam',
      icon: '📝',
      href: `/${locale}/academy/teacher/exams/create`,
    },
    {
      label: isRTL ? 'مراجعة التسليمات' : 'Review Submissions',
      icon: '📋',
      href: `/${locale}/academy/teacher/submissions`,
    },
    {
      label: isRTL ? 'إنشاء تقرير' : 'Generate Report',
      icon: '📊',
      href: `/${locale}/academy/teacher/reports`,
    },
  ];

  function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    }
    if (diffHours > 0) {
      return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    }
    return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? `مرحباً، ${user.name}` : `Welcome, ${user.name}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'إليك ملخص نشاطاتك اليوم' : "Here's your activity summary for today"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          count={totalStudents}
          label={isRTL ? 'إجمالي الطلاب' : 'Total Students'}
          icon="👨‍🎓"
        />
        <StatCard
          count={pendingSubmissions}
          label={isRTL ? 'تسليمات بانتظار المراجعة' : 'Pending Submissions'}
          icon="📬"
          trend={pendingSubmissions > 0 ? { direction: 'up', value: `${pendingSubmissions}` } : undefined}
        />
        <StatCard
          count={upcomingExams}
          label={isRTL ? 'اختبارات قادمة' : 'Upcoming Exams'}
          icon="📅"
        />
        <StatCard
          count={recentActivities.length}
          label={isRTL ? 'نشاطات حديثة' : 'Recent Activity'}
          icon="⚡"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F0548B]/30 transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Notification Badge for Unreviewed Submissions */}
      {pendingSubmissions > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white text-sm font-bold rounded-full">
            {pendingSubmissions}
          </span>
          <div>
            <p className="font-medium text-amber-800">
              {isRTL
                ? `لديك ${pendingSubmissions} تسليمات بحاجة للمراجعة`
                : `You have ${pendingSubmissions} submissions awaiting review`}
            </p>
            <Link
              href={`/${locale}/academy/teacher/submissions`}
              className="text-sm text-amber-600 hover:text-amber-700 underline"
            >
              {isRTL ? 'مراجعة الآن' : 'Review now'}
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'آخر نشاطات الطلاب' : 'Recent Student Activities'}
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {recentActivities.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              {isRTL ? 'لا توجد نشاطات حديثة' : 'No recent activities'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#fef0f5] flex items-center justify-center text-sm">
                        👤
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {activity.studentName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.action} — {activity.detail}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(activity.time)}
                    </span>
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
