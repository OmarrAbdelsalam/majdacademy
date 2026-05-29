'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Exam } from '@/lib/academy/types';

export default function ExamDetailPage() {
  const { services, locale } = useAcademy();
  const params = useParams();
  const examId = params.examId as string;
  const isRTL = locale === 'ar';

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editInstructions, setEditInstructions] = useState('');

  useEffect(() => {
    async function loadExam() {
      try {
        const data = await services.exams.getExamById(examId);
        setExam(data);
        if (data) {
          setEditTitle(data.title);
          setEditInstructions(data.instructions || '');
        }
      } catch (error) {
        console.error('Failed to load exam:', error);
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [services, examId]);

  async function handleSave() {
    if (!exam) return;
    try {
      const updated = await services.exams.updateExam(exam.id, {
        title: editTitle,
        instructions: editInstructions,
      });
      setExam(updated);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update exam:', error);
    }
  }

  async function handlePublish() {
    if (!exam) return;
    try {
      const updated = await services.exams.publishExam(exam.id);
      setExam(updated);
    } catch (error) {
      console.error('Failed to publish exam:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="text-center py-12">
        <p className="text-gray-500">{isRTL ? 'الاختبار غير موجود' : 'Exam not found'}</p>
        <Link href={`/${locale}/academy/teacher/exams`} className="text-[#F0548B] hover:underline text-sm mt-2 inline-block">
          {isRTL ? '← العودة للاختبارات' : '← Back to exams'}
        </Link>
      </div>
    );
  }

  const statusConfig = {
    draft: { label: isRTL ? 'مسودة' : 'Draft', color: 'bg-gray-100 text-gray-600' },
    published: { label: isRTL ? 'منشور' : 'Published', color: 'bg-green-100 text-green-700' },
    closed: { label: isRTL ? 'مغلق' : 'Closed', color: 'bg-red-100 text-red-600' },
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/${locale}/academy/teacher/exams`} className="text-sm text-gray-500 hover:text-gray-700">
          {isRTL ? '← العودة' : '← Back'}
        </Link>
        <div className="flex items-center gap-2">
          {exam.status === 'draft' && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              {isRTL ? 'نشر' : 'Publish'}
            </button>
          )}
          {exam.status === 'draft' && (
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {editing ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'تعديل' : 'Edit')}
            </button>
          )}
        </div>
      </div>

      {/* Exam Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRTL ? 'العنوان' : 'Title'}
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRTL ? 'التعليمات' : 'Instructions'}
              </label>
              <textarea
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] transition-colors"
            >
              {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[exam.status].color}`}>
                {statusConfig[exam.status].label}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span>📚 {exam.subject}</span>
              <span>🎓 {exam.grade}</span>
              <span>⏱ {exam.duration} {isRTL ? 'دقيقة' : 'min'}</span>
              <span>📝 {exam.questions.length} {isRTL ? 'سؤال' : 'questions'}</span>
              <span>⭐ {exam.totalPoints} {isRTL ? 'درجة' : 'points'}</span>
            </div>

            {exam.instructions && (
              <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {exam.instructions}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
              <span>{isRTL ? 'البدء: ' : 'Start: '}{new Date(exam.startDate).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</span>
              <span>{isRTL ? 'الانتهاء: ' : 'End: '}{new Date(exam.endDate).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</span>
              <span>{isRTL ? 'أُنشئ: ' : 'Created: '}{new Date(exam.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
            </div>
          </>
        )}
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'الأسئلة' : 'Questions'}
        </h2>
        <div className="space-y-4">
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-800">
                  {idx + 1}. {q.text}
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap ms-2">
                  {q.points} {isRTL ? 'د' : 'pts'} • {q.type.replace('_', ' ')}
                </span>
              </div>

              {q.type === 'multiple_choice' && q.options && (
                <div className="mt-2 ms-4 space-y-1">
                  {q.options.map((opt) => (
                    <div key={opt.id} className={`text-xs flex items-center gap-2 ${opt.isCorrect ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      <span>{opt.isCorrect ? '✓' : '○'}</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'true_false' && (
                <p className="mt-1 ms-4 text-xs text-green-600">
                  {isRTL ? 'الإجابة: ' : 'Answer: '}{q.correctAnswer === 'true' ? (isRTL ? 'صح' : 'True') : (isRTL ? 'خطأ' : 'False')}
                </p>
              )}

              {q.type === 'matching' && q.matchingPairs && (
                <div className="mt-2 ms-4 space-y-1">
                  {q.matchingPairs.map((pair, i) => (
                    <p key={i} className="text-xs text-gray-500">{pair.left} ↔ {pair.right}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
