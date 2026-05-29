'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import { ScoreTrendChart } from '@/app/components/academy/Charts';
import type { Parent, Student, Submission, Exam } from '@/lib/academy/types';

interface SubjectScores {
  subject: string;
  data: { label: string; value: number }[];
}

export default function ParentProgressPage() {
  const { user, services, locale } = useAcademy();
  const parent = user as Parent;
  const isRTL = locale === 'ar';

  const [child, setChild] = useState<Student | null>(null);
  const [subjectScores, setSubjectScores] = useState<SubjectScores[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);

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

        // Only graded submissions
        const graded = submissions.filter(
          (s) => s.status === 'graded' || s.status === 'partially_graded'
        );

        // Group by subject and sort by date
        const subjectMap = new Map<string, { label: string; value: number; date: string }[]>();

        for (const sub of graded) {
          const exam = exams.find((e) => e.id === sub.examId);
          if (!exam || sub.percentage == null) continue;

          if (!subjectMap.has(exam.subject)) {
            subjectMap.set(exam.subject, []);
          }

          const date = sub.submittedAt || sub.startedAt;
          subjectMap.get(exam.subject)!.push({
            label: exam.title.length > 12 ? exam.title.slice(0, 12) + '…' : exam.title,
            value: Math.round(sub.percentage),
            date,
          });
        }

        // Sort each subject's scores by date ascending
        const result: SubjectScores[] = [];
        for (const [subject, scores] of subjectMap) {
          scores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          result.push({
            subject,
            data: scores.map(({ label, value }) => ({ label, value })),
          });
        }

        setSubjectScores(result);
        if (result.length > 0) {
          setSelectedSubject(result[0].subject);
        }
      } catch (error) {
        console.error('Failed to load progress data:', error);
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

  const currentSubjectData = subjectScores.find((s) => s.subject === selectedSubject);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'تقدم الأداء' : 'Performance Progress'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL
            ? `مخطط أداء ${child.name} عبر الزمن`
            : `${child.name}'s performance trend over time`}
        </p>
      </div>

      {subjectScores.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">📈</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد بيانات أداء بعد' : 'No performance data yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Subject selector */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {subjectScores.map((s) => (
                <button
                  key={s.subject}
                  onClick={() => setSelectedSubject(s.subject)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSubject === s.subject
                      ? 'bg-[#F0548B] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s.subject}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {isRTL ? `أداء ${selectedSubject}` : `${selectedSubject} Performance`}
            </h3>
            {currentSubjectData && currentSubjectData.data.length > 0 ? (
              <ScoreTrendChart
                data={currentSubjectData.data}
                height={250}
                color="#F0548B"
                locale={locale}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                {isRTL ? 'لا توجد بيانات لهذه المادة' : 'No data for this subject'}
              </div>
            )}
          </div>

          {/* Summary stats */}
          {currentSubjectData && currentSubjectData.data.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(
                    currentSubjectData.data.reduce((sum, d) => sum + d.value, 0) /
                      currentSubjectData.data.length
                  )}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'المعدل' : 'Average'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...currentSubjectData.data.map((d) => d.value))}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'أعلى درجة' : 'Highest'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {currentSubjectData.data.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'عدد الاختبارات' : 'Total Exams'}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
