'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Exam } from '@/lib/academy/types';

export default function StudentExamsPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      try {
        const allExams = await services.exams.getExams({ assignedTo: user.id });
        // Filter visible exams: published and within start/end date window
        const now = new Date();
        const visible = allExams.filter(
          (e) =>
            e.status === 'published' &&
            new Date(e.startDate) <= now &&
            new Date(e.endDate) >= now
        );
        setExams(visible);
      } catch (error) {
        console.error('Failed to load exams:', error);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, [services, user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'الاختبارات المتاحة' : 'Available Exams'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'الاختبارات المتاحة لك حالياً' : 'Exams currently available for you'}
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">📝</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد اختبارات متاحة حالياً' : 'No exams available at this time'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{exam.subject}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {isRTL ? 'متاح' : 'Available'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>⏱️</span>
                  <span>{exam.duration} {isRTL ? 'دقيقة' : 'minutes'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>❓</span>
                  <span>{exam.questions.length} {isRTL ? 'سؤال' : 'questions'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🏆</span>
                  <span>{exam.totalPoints} {isRTL ? 'نقطة' : 'points'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📅</span>
                  <span>
                    {isRTL ? 'ينتهي:' : 'Ends:'}{' '}
                    {new Date(exam.endDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/academy/student/exams/${exam.id}/take`}
                className="block w-full text-center py-2.5 bg-[#F0548B] text-white rounded-lg font-medium hover:bg-[#d94478] transition-colors"
              >
                {isRTL ? 'ابدأ الاختبار' : 'Start Exam'}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Link to exam history */}
      <div className="mt-6 text-center">
        <Link
          href={`/${locale}/academy/student/exams/history`}
          className="text-sm text-[#F0548B] hover:underline"
        >
          {isRTL ? 'عرض سجل الاختبارات السابقة' : 'View exam history'}
        </Link>
      </div>
    </div>
  );
}
