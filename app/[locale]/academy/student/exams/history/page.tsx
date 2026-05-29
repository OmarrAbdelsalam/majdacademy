'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import { ScoreTrendChart } from '@/app/components/academy/Charts';
import type { Submission, Exam } from '@/lib/academy/types';

interface ExamResult {
  submission: Submission;
  exam: Exam;
}

export default function ExamHistoryPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const [submissions, exams] = await Promise.all([
          services.submissions.getSubmissions({ studentId: user.id }),
          services.exams.getExams({ assignedTo: user.id }),
        ]);

        // Only show graded/submitted submissions
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

        // Sort by submission date descending
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
    loadHistory();
  }, [services, user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  const filteredResults = filterSubject
    ? results.filter((r) => r.exam.subject === filterSubject)
    : results;

  // Build score trend data per subject
  const trendData = filteredResults
    .filter((r) => r.submission.percentage !== undefined)
    .sort((a, b) => {
      const dateA = a.submission.submittedAt || a.submission.startedAt;
      const dateB = b.submission.submittedAt || b.submission.startedAt;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    })
    .map((r) => ({
      label: r.exam.title.length > 12 ? r.exam.title.slice(0, 12) + '…' : r.exam.title,
      value: r.submission.percentage ?? 0,
    }));

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'سجل الاختبارات' : 'Exam History'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'نتائج اختباراتك السابقة' : 'Your past exam results'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0548B]"
        >
          <option value="">{isRTL ? 'جميع المواد' : 'All Subjects'}</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Score Trend Chart */}
      {trendData.length > 1 && (
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {isRTL ? 'اتجاه الدرجات' : 'Score Trend'}
          </h2>
          <ScoreTrendChart data={trendData} locale={locale} />
        </div>
      )}

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">📊</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد نتائج اختبارات' : 'No exam results found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map(({ submission, exam }) => {
            const isExpanded = expandedId === submission.id;
            const date = submission.submittedAt || submission.startedAt;

            return (
              <div
                key={submission.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Summary row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                  className="w-full p-4 text-start hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-gray-800">{exam.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {exam.subject} • {new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {submission.percentage !== undefined && (
                        <span className={`text-lg font-bold ${
                          submission.percentage >= 80 ? 'text-green-600' :
                          submission.percentage >= 60 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {Math.round(submission.percentage)}%
                        </span>
                      )}
                      {submission.totalScore !== undefined && (
                        <span className="text-sm text-gray-500">
                          {submission.totalScore}/{exam.totalPoints}
                        </span>
                      )}
                      <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      {isRTL ? 'تفاصيل الإجابات' : 'Answer Details'}
                    </h4>
                    <div className="space-y-3">
                      {exam.questions.map((question, qIdx) => {
                        const answer = submission.answers.find(
                          (a) => a.questionId === question.id
                        );
                        const isCorrect = answer?.score !== undefined && answer.score > 0;
                        const hasAnswer = answer !== undefined;

                        return (
                          <div
                            key={question.id}
                            className={`p-3 rounded-lg border ${
                              !hasAnswer
                                ? 'border-gray-200 bg-white'
                                : isCorrect
                                  ? 'border-green-200 bg-green-50'
                                  : 'border-red-200 bg-red-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">{qIdx + 1}.</span> {question.text}
                                </p>
                                {hasAnswer && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {isRTL ? 'إجابتك:' : 'Your answer:'}{' '}
                                    {Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}
                                  </p>
                                )}
                                {answer?.feedback && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {isRTL ? 'ملاحظة:' : 'Feedback:'} {answer.feedback}
                                  </p>
                                )}
                              </div>
                              <div className="text-end">
                                {hasAnswer ? (
                                  <span className={`text-xs font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {answer.score ?? 0}/{question.points}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    {isRTL ? 'لم تُجب' : 'Not answered'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
