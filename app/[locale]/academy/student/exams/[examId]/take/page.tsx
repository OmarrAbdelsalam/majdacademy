'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import { calculateRemainingTime } from '@/lib/academy/services/utils';
import type { Exam, Question, Answer } from '@/lib/academy/types';

export default function ExamTakingPage() {
  const { user, services, locale } = useAcademy();
  const params = useParams();
  const examId = params.examId as string;
  const isRTL = locale === 'ar';

  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadExam() {
      try {
        const examData = await services.exams.getExamById(examId);
        setExam(examData);
      } catch (error) {
        console.error('Failed to load exam:', error);
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [services, examId]);

  // Timer
  useEffect(() => {
    if (!started || !exam || submitted) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const newElapsed = prev + 1;
        const remaining = calculateRemainingTime(exam.duration, newElapsed);
        if (remaining <= 0) {
          // Auto-submit when timer reaches zero
          handleAutoSubmit();
        }
        return newElapsed;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, exam, submitted]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!started || submitted) return;

    autoSaveRef.current = setInterval(() => {
      console.log('[Auto-save] Saving answers:', answers);
    }, 30000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [started, submitted, answers]);

  const handleAutoSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    console.log('[Auto-submit] Timer reached zero. Submitting answers:', answers);
  }, [submitted, answers]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    console.log('[Submit] Student submitted exam. Answers:', answers);
  };

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">{isRTL ? 'الاختبار غير موجود' : 'Exam not found'}</p>
      </div>
    );
  }

  if (submitted) {
    const answeredCount = Object.keys(answers).length;
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-lg mx-auto text-center p-8">
        <span className="text-5xl mb-4 block">✅</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isRTL ? 'تم تسليم الاختبار' : 'Exam Submitted'}
        </h1>
        <p className="text-gray-500 mb-4">
          {isRTL
            ? `أجبت على ${answeredCount} من ${exam.questions.length} سؤال`
            : `You answered ${answeredCount} of ${exam.questions.length} questions`}
        </p>
        <a
          href={`/${locale}/academy/student/exams/history`}
          className="inline-block px-6 py-2.5 bg-[#F0548B] text-white rounded-lg font-medium hover:bg-[#d94478] transition-colors"
        >
          {isRTL ? 'عرض النتائج' : 'View Results'}
        </a>
      </div>
    );
  }

  // Instructions screen before starting
  if (!started) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{exam.title}</h1>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📚</span>
              <span>{isRTL ? 'المادة:' : 'Subject:'} {exam.subject}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>⏱️</span>
              <span>{isRTL ? 'المدة:' : 'Duration:'} {exam.duration} {isRTL ? 'دقيقة' : 'minutes'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>❓</span>
              <span>{isRTL ? 'عدد الأسئلة:' : 'Questions:'} {exam.questions.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🏆</span>
              <span>{isRTL ? 'مجموع النقاط:' : 'Total Points:'} {exam.totalPoints}</span>
            </div>
          </div>

          {exam.instructions && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-1">
                {isRTL ? 'التعليمات' : 'Instructions'}
              </h3>
              <p className="text-sm text-amber-700">{exam.instructions}</p>
            </div>
          )}

          <button
            onClick={() => setStarted(true)}
            className="w-full py-3 bg-[#F0548B] text-white rounded-lg font-medium hover:bg-[#d94478] transition-colors text-lg"
          >
            {isRTL ? 'ابدأ الاختبار' : 'Start Exam'}
          </button>
        </div>
      </div>
    );
  }

  // Exam taking view
  const currentQuestion = exam.questions[currentQuestionIndex];
  const remainingSeconds = calculateRemainingTime(exam.duration, elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = exam.questions.length - answeredCount;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto">
      {/* Top bar: Timer + Progress */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 rounded-t-xl mb-0 flex items-center justify-between flex-wrap gap-3">
        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          remainingSeconds < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          <span>⏱️</span>
          <span className="font-mono font-semibold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Progress indicator */}
        <div className="text-sm text-gray-600">
          {isRTL
            ? `${answeredCount} / ${exam.questions.length} تمت الإجابة`
            : `${answeredCount} / ${exam.questions.length} answered`}
        </div>

        {/* Submit button */}
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="px-4 py-1.5 bg-[#F0548B] text-white rounded-lg text-sm font-medium hover:bg-[#d94478] transition-colors"
        >
          {isRTL ? 'تسليم' : 'Submit'}
        </button>
      </div>

      {/* Question navigation */}
      <div className="bg-white border-x border-gray-200 p-3 flex flex-wrap gap-2">
        {exam.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                isCurrent
                  ? 'bg-[#F0548B] text-white'
                  : isAnswered
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              aria-label={`${isRTL ? 'سؤال' : 'Question'} ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Current Question */}
      <div className="bg-white border border-gray-200 rounded-b-xl p-6">
        <div className="mb-4">
          <span className="text-xs text-gray-400">
            {isRTL ? `سؤال ${currentQuestionIndex + 1} من ${exam.questions.length}` : `Question ${currentQuestionIndex + 1} of ${exam.questions.length}`}
            {' • '}
            {currentQuestion.points} {isRTL ? 'نقطة' : 'pts'}
          </span>
          <p className="text-lg font-medium text-gray-800 mt-2">{currentQuestion.text}</p>
        </div>

        {/* Render question based on type */}
        <QuestionInput
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
          isRTL={isRTL}
        />

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? 'السابق' : 'Previous'}
          </button>
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === exam.questions.length - 1}
            className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d94478] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {isRTL ? 'تأكيد التسليم' : 'Confirm Submission'}
            </h3>
            <div className="space-y-2 mb-5">
              <p className="text-sm text-gray-600">
                {isRTL ? 'الأسئلة المجاب عليها:' : 'Answered questions:'}{' '}
                <span className="font-semibold text-green-600">{answeredCount}</span>
              </p>
              <p className="text-sm text-gray-600">
                {isRTL ? 'الأسئلة غير المجاب عليها:' : 'Unanswered questions:'}{' '}
                <span className="font-semibold text-red-600">{unansweredCount}</span>
              </p>
            </div>
            {unansweredCount > 0 && (
              <p className="text-xs text-amber-600 mb-4">
                {isRTL
                  ? '⚠️ لديك أسئلة لم تُجب عليها. هل أنت متأكد من التسليم؟'
                  : '⚠️ You have unanswered questions. Are you sure you want to submit?'}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleSubmit();
                }}
                className="flex-1 py-2.5 bg-[#F0548B] text-white rounded-lg font-medium hover:bg-[#d94478] transition-colors"
              >
                {isRTL ? 'تسليم' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Question Input Component ===

function QuestionInput({
  question,
  value,
  onChange,
  isRTL,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
  isRTL: boolean;
}) {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const isSelected = value === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onChange(option.id)}
                className={`w-full text-start p-4 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-[#F0548B] bg-[#fef0f5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm text-gray-800">{option.text}</span>
              </button>
            );
          })}
        </div>
      );

    case 'true_false':
      return (
        <div className="flex gap-4">
          {['true', 'false'].map((opt) => {
            const isSelected = value === opt;
            const label = opt === 'true' ? (isRTL ? 'صح' : 'True') : (isRTL ? 'خطأ' : 'False');
            return (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`flex-1 py-4 rounded-lg border-2 font-medium transition-colors ${
                  isSelected
                    ? 'border-[#F0548B] bg-[#fef0f5] text-[#F0548B]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      );

    case 'short_answer':
      return (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isRTL ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
          className="w-full p-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0548B] focus:ring-1 focus:ring-[#F0548B]"
        />
      );

    case 'essay':
      return (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isRTL ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
          rows={6}
          className="w-full p-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0548B] focus:ring-1 focus:ring-[#F0548B] resize-y"
        />
      );

    case 'matching':
      return <MatchingQuestion question={question} value={value as string[] | undefined} onChange={onChange} isRTL={isRTL} />;

    default:
      return null;
  }
}

// === Matching Question Component ===

function MatchingQuestion({
  question,
  value,
  onChange,
  isRTL,
}: {
  question: Question;
  value: string[] | undefined;
  onChange: (val: string[]) => void;
  isRTL: boolean;
}) {
  const pairs = question.matchingPairs || [];
  const rightOptions = pairs.map((p) => p.right);
  const currentMatches = value || [];

  const handleMatch = (leftIndex: number, right: string) => {
    const newMatches = [...currentMatches];
    newMatches[leftIndex] = `${pairs[leftIndex].left}-${right}`;
    onChange(newMatches);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 mb-2">
        {isRTL ? 'اختر الإجابة المناسبة لكل عنصر:' : 'Select the matching answer for each item:'}
      </p>
      {pairs.map((pair, idx) => {
        const currentMatch = currentMatches[idx]?.split('-').slice(1).join('-') || '';
        return (
          <div key={idx} className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700 min-w-[100px]">{pair.left}</span>
            <span className="text-gray-400">→</span>
            <select
              value={currentMatch}
              onChange={(e) => handleMatch(idx, e.target.value)}
              className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0548B]"
            >
              <option value="">{isRTL ? 'اختر...' : 'Select...'}</option>
              {rightOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
