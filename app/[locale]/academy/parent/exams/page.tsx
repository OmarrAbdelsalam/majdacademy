'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Parent, Student, Submission, Exam } from '@/lib/academy/types';

interface ExamResult {
  submission: Submission;
  exam: Exam;
}

export default function ParentExamHistoryPage() {
  const { user, services, locale } = useAcademy();
  const parent = user as Parent;
  const isRTL = locale === 'ar';

  const [child, setChild] = useState<Student | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);

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

        const [submissions, exams] = await Promise.all([
          services.submissions.getSubmissions({ studentId: childId }),
          services.exams.getExams({ assignedTo: childId }),
        ]);

        const completedSubs = submissions.filter(
          (s) => s.status === 'graded' || s.status === 'partially_graded' || s.status === 'submitted'
        );

        const examResults: ExamResult[] = [];
        const subjectSet = new Set<string>();

        for (const sub of completedSubs) {
          const exam = exams.find((e) => e.id === sub.examId);
          if (exam) {
            examResults.push({ submission: sub, exam });
            subjectSet.add(exam.subject);
          }
        }

        // Sort by date descending
        examResults.sort((a, b) => {
          const dateA = a.submission.submittedAt || a.submission.startedAt;
          const dateB = b.submission.submittedAt || b.submission.startedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setResults(examResults);
        setSubjects(Array.from(subjectSet));
      } catch (error) {
        console.error('Failed to load exam history:', error);
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

  const filteredResults = filterSubject
    ? results.filter((r) => r.exam.subject === filterSubject)
    : results;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'سجل الاختبارات' : 'Exam History'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL
            ? `سجل اختبارات ${child.name}`
            : `${child.name}'s exam history`}
        </p>
      </div>

      {/* Filter */}
      {subjects.length > 0 && (
        <div className="mb-4">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0548B] focus:ring-1 focus:ring-[#F0548B] bg-white"
          >
            <option value="">{isRTL ? 'جميع المواد' : 'All Subjects'}</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Results */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">📝</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد اختبارات مكتملة' : 'No completed exams'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
            <span>{isRTL ? 'الاختبار' : 'Exam'}</span>
            <span>{isRTL ? 'المادة' : 'Subject'}</span>
            <span>{isRTL ? 'التاريخ' : 'Date'}</span>
            <span>{isRTL ? 'الدرجة' : 'Score'}</span>
            <span>{isRTL ? 'النسبة' : 'Percentage'}</span>
          </div>

          <ul className="divide-y divide-gray-100">
            {filteredResults.map(({ exam, submission }) => {
              const date = submission.submittedAt || submission.startedAt;
              return (
                <li key={submission.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {/* Mobile layout */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800">{exam.title}</p>
                      <span className={`text-lg font-bold ${
                        (submission.percentage ?? 0) >= 80 ? 'text-green-600' :
                        (submission.percentage ?? 0) >= 60 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {submission.percentage != null ? `${Math.round(submission.percentage)}%` : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{exam.subject}</span>
                      <span>•</span>
                      <span>{new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                      <span>•</span>
                      <span>{submission.totalScore ?? 0}/{exam.totalPoints}</span>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-5 gap-4 items-center">
                    <span className="text-sm font-medium text-gray-800">{exam.title}</span>
                    <span className="text-sm text-gray-600">{exam.subject}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </span>
                    <span className="text-sm text-gray-700">
                      {submission.totalScore ?? 0}/{exam.totalPoints}
                    </span>
                    <span className={`text-sm font-bold ${
                      (submission.percentage ?? 0) >= 80 ? 'text-green-600' :
                      (submission.percentage ?? 0) >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {submission.percentage != null ? `${Math.round(submission.percentage)}%` : '—'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
