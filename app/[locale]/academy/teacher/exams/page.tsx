'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Exam } from '@/lib/academy/types';

export default function TeacherExamsPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function loadExams() {
      try {
        const data = await services.exams.getExams({ teacherId: user.id });
        setExams(data);
      } catch (error) {
        console.error('Failed to load exams:', error);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, [services, user.id]);

  const filteredExams = statusFilter === 'all'
    ? exams
    : exams.filter((e) => e.status === statusFilter);

  function statusBadge(status: Exam['status']) {
    const config = {
      draft: { label: isRTL ? 'مسودة' : 'Draft', color: 'bg-gray-100 text-gray-600' },
      published: { label: isRTL ? 'منشور' : 'Published', color: 'bg-green-100 text-green-700' },
      closed: { label: isRTL ? 'مغلق' : 'Closed', color: 'bg-red-100 text-red-600' },
    };
    const c = config[status];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
        {c.label}
      </span>
    );
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'الاختبارات' : 'Exams'}
        </h1>
        <Link
          href={`/${locale}/academy/teacher/exams/create`}
          className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] transition-colors"
        >
          {isRTL ? '+ إنشاء اختبار' : '+ Create Exam'}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'draft', 'published', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === status
                ? 'bg-[#F0548B] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' && (isRTL ? 'الكل' : 'All')}
            {status === 'draft' && (isRTL ? 'مسودة' : 'Draft')}
            {status === 'published' && (isRTL ? 'منشور' : 'Published')}
            {status === 'closed' && (isRTL ? 'مغلق' : 'Closed')}
          </button>
        ))}
      </div>

      {/* Exam List */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {isRTL ? 'لا توجد اختبارات' : 'No exams found'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExams.map((exam) => (
            <Link
              key={exam.id}
              href={`/${locale}/academy/teacher/exams/${exam.id}`}
              className="block p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F0548B]/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{exam.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>📚 {exam.subject}</span>
                    <span>🎓 {exam.grade}</span>
                    <span>📝 {exam.questions.length} {isRTL ? 'سؤال' : 'questions'}</span>
                    <span>⏱ {exam.duration} {isRTL ? 'دقيقة' : 'min'}</span>
                    <span>⭐ {exam.totalPoints} {isRTL ? 'درجة' : 'pts'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {statusBadge(exam.status)}
                  <span className="text-xs text-gray-400">
                    {new Date(exam.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
