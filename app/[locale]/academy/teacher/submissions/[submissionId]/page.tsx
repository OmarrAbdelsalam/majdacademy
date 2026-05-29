'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Submission, Exam, Student, Question, Answer } from '@/lib/academy/types';

interface GradeEntry {
  questionId: string;
  score: number;
  feedback: string;
}

export default function SubmissionDetailPage() {
  const { services, locale } = useAcademy();
  const params = useParams();
  const submissionId = params.submissionId as string;
  const isRTL = locale === 'ar';

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const sub = await services.submissions.getSubmissionById(submissionId);
        if (!sub) {
          setLoading(false);
          return;
        }
        setSubmission(sub);

        const [examData, students] = await Promise.all([
          services.exams.getExamById(sub.examId),
          services.users.getStudents(),
        ]);

        setExam(examData);
        const studentData = students.find((s: Student) => s.id === sub.studentId) || null;
        setStudent(studentData);

        // Initialize grades for questions that need manual grading
        if (examData) {
          const manualQuestions = examData.questions.filter(
            (q) => q.type === 'essay' || q.type === 'short_answer'
          );
          const existingGrades: GradeEntry[] = manualQuestions.map((q) => {
            const existingAnswer = sub.answers.find((a) => a.questionId === q.id);
            return {
              questionId: q.id,
              score: existingAnswer?.score ?? 0,
              feedback: existingAnswer?.feedback ?? '',
            };
          });
          setGrades(existingGrades);
        }
      } catch (error) {
        console.error('Failed to load submission:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services, submissionId]);

  function updateGrade(questionId: string, field: 'score' | 'feedback', value: string | number) {
    setGrades(grades.map((g) =>
      g.questionId === questionId ? { ...g, [field]: value } : g
    ));
    setSaved(false);
  }

  async function handleSaveGrades() {
    if (!submission) return;
    setSaving(true);
    try {
      const gradeData = grades.map((g) => ({
        questionId: g.questionId,
        score: g.score,
        feedback: g.feedback || undefined,
      }));
      const updated = await services.submissions.gradeSubmission(submission.id, gradeData);
      setSubmission(updated);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save grades:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  if (!submission || !exam) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="text-center py-12">
        <p className="text-gray-500">{isRTL ? 'التسليم غير موجود' : 'Submission not found'}</p>
        <Link href={`/${locale}/academy/teacher/submissions`} className="text-[#F0548B] hover:underline text-sm mt-2 inline-block">
          {isRTL ? '← العودة' : '← Back'}
        </Link>
      </div>
    );
  }

  // Calculate totals
  const autoGradedTotal = submission.autoGradedScore ?? 0;
  const manualTotal = grades.reduce((sum, g) => sum + g.score, 0);
  const totalScore = autoGradedTotal + manualTotal;
  const maxPoints = exam.totalPoints;
  const percentage = maxPoints > 0 ? Math.round((totalScore / maxPoints) * 100) : 0;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/${locale}/academy/teacher/submissions`} className="text-sm text-gray-500 hover:text-gray-700">
          {isRTL ? '← العودة للتسليمات' : '← Back to Submissions'}
        </Link>
      </div>

      {/* Student & Exam Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{student?.name || 'Unknown'}</h1>
            <p className="text-sm text-gray-500 mt-1">{exam.title}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
              <span>📚 {exam.subject}</span>
              <span>🎓 {student?.grade}</span>
              {submission.submittedAt && (
                <span>📅 {new Date(submission.submittedAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</span>
              )}
            </div>
          </div>
          <div className="text-end">
            <div className="text-2xl font-bold text-gray-800">{totalScore}/{maxPoints}</div>
            <div className="text-sm text-gray-500">{percentage}%</div>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-xs text-green-600 font-medium">{isRTL ? 'تصحيح تلقائي' : 'Auto-Graded'}</p>
          <p className="text-lg font-bold text-green-700">{autoGradedTotal}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">{isRTL ? 'تصحيح يدوي' : 'Manual Grade'}</p>
          <p className="text-lg font-bold text-blue-700">{manualTotal}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <p className="text-xs text-purple-600 font-medium">{isRTL ? 'المجموع' : 'Total'}</p>
          <p className="text-lg font-bold text-purple-700">{totalScore}/{maxPoints} ({percentage}%)</p>
        </div>
      </div>

      {/* Questions & Answers */}
      <div className="space-y-4 mb-6">
        {exam.questions.map((question, idx) => {
          const answer = submission.answers.find((a) => a.questionId === question.id);
          const isAutoGraded = question.type === 'multiple_choice' || question.type === 'true_false';
          const gradeEntry = grades.find((g) => g.questionId === question.id);

          return (
            <div key={question.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              {/* Question */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {idx + 1}. {question.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {question.type.replace('_', ' ')} • {question.points} {isRTL ? 'درجة' : 'pts'}
                  </p>
                </div>
                {isAutoGraded && answer && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    answer.score === question.points ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {answer.score}/{question.points}
                  </span>
                )}
              </div>

              {/* Student Answer */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {isRTL ? 'إجابة الطالب:' : 'Student Answer:'}
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700">
                  {answer ? (
                    Array.isArray(answer.value) ? answer.value.join(', ') : answer.value || (isRTL ? 'لم يُجب' : 'No answer')
                  ) : (
                    <span className="text-gray-400 italic">{isRTL ? 'لم يُجب' : 'No answer'}</span>
                  )}
                </div>
              </div>

              {/* Correct Answer (for auto-graded) */}
              {isAutoGraded && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {isRTL ? 'الإجابة الصحيحة:' : 'Correct Answer:'}
                  </p>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-sm text-green-700">
                    {question.type === 'multiple_choice' && question.options
                      ? question.options.find((o) => o.isCorrect)?.text || question.correctAnswer
                      : question.correctAnswer === 'true' ? (isRTL ? 'صح' : 'True') : (isRTL ? 'خطأ' : 'False')}
                  </div>
                </div>
              )}

              {/* Manual Grading Interface */}
              {!isAutoGraded && gradeEntry && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {isRTL ? 'الدرجة' : 'Score'} (0-{question.points})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={question.points}
                        value={gradeEntry.score}
                        onChange={(e) => updateGrade(question.id, 'score', Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {isRTL ? 'ملاحظات' : 'Feedback'}
                      </label>
                      <input
                        type="text"
                        value={gradeEntry.feedback}
                        onChange={(e) => updateGrade(question.id, 'feedback', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
                        placeholder={isRTL ? 'تغذية راجعة للطالب...' : 'Feedback for student...'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      {grades.length > 0 && (
        <div className="sticky bottom-4 flex items-center justify-center">
          <button
            onClick={handleSaveGrades}
            disabled={saving}
            className="px-6 py-3 text-sm font-medium text-white bg-[#F0548B] rounded-lg shadow-lg hover:bg-[#d4477a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving
              ? (isRTL ? 'جاري الحفظ...' : 'Saving...')
              : saved
              ? (isRTL ? '✓ تم الحفظ' : '✓ Saved')
              : (isRTL ? 'حفظ التصحيح' : 'Save Grades')}
          </button>
        </div>
      )}
    </div>
  );
}
