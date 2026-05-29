'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Submission, Exam, Student } from '@/lib/academy/types';

interface EnrichedSubmission {
  submission: Submission;
  studentName: string;
  examTitle: string;
  examSubject: string;
  studentGrade: string;
}

export default function SubmissionsListPage() {
  const { services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [enrichedSubmissions, setEnrichedSubmissions] = useState<EnrichedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [examFilter, setExamFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [submissions, allExams, students] = await Promise.all([
          services.submissions.getSubmissions(),
          services.exams.getExams(),
          services.users.getStudents(),
        ]);

        setExams(allExams);

        const enriched: EnrichedSubmission[] = submissions
          .sort((a, b) => {
            const dateA = a.submittedAt || a.startedAt;
            const dateB = b.submittedAt || b.startedAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
          .map((sub) => {
            const student = students.find((s: Student) => s.id === sub.studentId);
            const exam = allExams.find((e: Exam) => e.id === sub.examId);
            return {
              submission: sub,
              studentName: student?.name || 'Unknown',
              examTitle: exam?.title || 'Unknown',
              examSubject: exam?.subject || '',
              studentGrade: student?.grade || '',
            };
          });

        setEnrichedSubmissions(enriched);
      } catch (error) {
        console.error('Failed to load submissions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services]);

  const filtered = enrichedSubmissions.filter((item) => {
    if (statusFilter !== 'all' && item.submission.status !== statusFilter) return false;
    if (examFilter && item.submission.examId !== examFilter) return false;
    if (gradeFilter && item.studentGrade !== gradeFilter) return false;
    return true;
  });

  function statusBadge(status: string) {
    const config: Record<string, { label: string; color: string }> = {
      submitted: { label: isRTL ? 'بانتظار المراجعة' : 'Pending', color: 'bg-amber-100 text-amber-700' },
      graded: { label: isRTL ? 'مُصحح' : 'Graded', color: 'bg-green-100 text-green-700' },
      partially_graded: { label: isRTL ? 'مصحح جزئياً' : 'Partial', color: 'bg-blue-100 text-blue-700' },
      in_progress: { label: isRTL ? 'قيد التنفيذ' : 'In Progress', color: 'bg-gray-100 text-gray-600' },
    };
    const c = config[status] || config.submitted;
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
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
          {isRTL ? 'مراجعة التسليمات' : 'Submissions Review'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isRTL
            ? `${filtered.length} تسليم`
            : `${filtered.length} submissions`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          >
            <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
            <option value="submitted">{isRTL ? 'بانتظار المراجعة' : 'Pending'}</option>
            <option value="graded">{isRTL ? 'مُصحح' : 'Graded'}</option>
            <option value="partially_graded">{isRTL ? 'مصحح جزئياً' : 'Partially Graded'}</option>
            <option value="in_progress">{isRTL ? 'قيد التنفيذ' : 'In Progress'}</option>
          </select>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          >
            <option value="">{isRTL ? 'كل الاختبارات' : 'All Exams'}</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          >
            <option value="">{isRTL ? 'كل الصفوف' : 'All Grades'}</option>
            <option value="الصف السادس">الصف السادس</option>
            <option value="الصف السابع">الصف السابع</option>
            <option value="الصف الثامن">الصف الثامن</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {isRTL ? 'لا توجد تسليمات' : 'No submissions found'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.submission.id}
              href={`/${locale}/academy/teacher/submissions/${item.submission.id}`}
              className="block p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F0548B]/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{item.studentName}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.examTitle}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>📚 {item.examSubject}</span>
                    <span>🎓 {item.studentGrade}</span>
                    {item.submission.submittedAt && (
                      <span>
                        📅 {new Date(item.submission.submittedAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {statusBadge(item.submission.status)}
                  {item.submission.totalScore !== undefined && (
                    <span className="text-sm font-medium text-gray-700">
                      {item.submission.percentage?.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
