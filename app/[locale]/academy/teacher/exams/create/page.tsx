'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Question, QuestionType, AnswerOption, MatchingPair, ExamAssignment } from '@/lib/academy/types';

type WizardStep = 'metadata' | 'questions' | 'assign' | 'preview' | 'publish';

interface ExamMetadata {
  title: string;
  subject: string;
  grade: string;
  duration: number;
  instructions: string;
  startDate: string;
  endDate: string;
}

interface DraftQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options: AnswerOption[];
  correctAnswer: string | string[];
  matchingPairs: MatchingPair[];
}

const STEPS: WizardStep[] = ['metadata', 'questions', 'assign', 'preview', 'publish'];

export default function ExamCreatePage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [currentStep, setCurrentStep] = useState<WizardStep>('metadata');
  const [metadata, setMetadata] = useState<ExamMetadata>({
    title: '',
    subject: '',
    grade: '',
    duration: 30,
    instructions: '',
    startDate: '',
    endDate: '',
  });
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [assignment, setAssignment] = useState<ExamAssignment>({ type: 'all' });
  const [assignGrade, setAssignGrade] = useState('');
  const [assignStudentIds, setAssignStudentIds] = useState<string[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DraftQuestion | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const stepIndex = STEPS.indexOf(currentStep);

  const stepLabels: Record<WizardStep, string> = {
    metadata: isRTL ? 'بيانات الاختبار' : 'Exam Details',
    questions: isRTL ? 'الأسئلة' : 'Questions',
    assign: isRTL ? 'تعيين الطلاب' : 'Assign Students',
    preview: isRTL ? 'معاينة' : 'Preview',
    publish: isRTL ? 'نشر' : 'Publish',
  };

  function nextStep() {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
  }

  function prevStep() {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  }

  function createEmptyQuestion(): DraftQuestion {
    return {
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'multiple_choice',
      text: '',
      points: 1,
      options: [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
      ],
      correctAnswer: '',
      matchingPairs: [{ left: '', right: '' }],
    };
  }

  function addQuestion(q: DraftQuestion) {
    if (editingQuestion) {
      setQuestions(questions.map((existing) => (existing.id === q.id ? q : existing)));
    } else {
      setQuestions([...questions, q]);
    }
    setShowQuestionForm(false);
    setEditingQuestion(null);
  }

  function removeQuestion(id: string) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const examQuestions: Question[] = questions.map((q) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        points: q.points,
        options: q.type === 'multiple_choice' ? q.options : undefined,
        correctAnswer: q.type === 'matching' ? undefined : q.correctAnswer,
        matchingPairs: q.type === 'matching' ? q.matchingPairs : undefined,
        metadata: { subject: metadata.subject, grade: metadata.grade, difficulty: 'medium' as const },
      }));

      const totalPoints = examQuestions.reduce((sum, q) => sum + q.points, 0);

      let finalAssignment = assignment;
      if (assignment.type === 'grade') {
        finalAssignment = { type: 'grade', grade: assignGrade };
      } else if (assignment.type === 'students') {
        finalAssignment = { type: 'students', studentIds: assignStudentIds };
      }

      await services.exams.createExam({
        title: metadata.title,
        subject: metadata.subject,
        grade: metadata.grade,
        teacherId: user.id,
        duration: metadata.duration,
        instructions: metadata.instructions,
        questions: examQuestions,
        startDate: metadata.startDate,
        endDate: metadata.endDate,
        status: 'published',
        assignedTo: finalAssignment,
        totalPoints,
      });

      setPublished(true);
    } catch (error) {
      console.error('Failed to publish exam:', error);
    } finally {
      setPublishing(false);
    }
  }

  if (published) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-800">
          {isRTL ? 'تم نشر الاختبار بنجاح!' : 'Exam Published Successfully!'}
        </h2>
        <Link
          href={`/${locale}/academy/teacher/exams`}
          className="px-4 py-2 bg-[#F0548B] text-white rounded-lg hover:bg-[#d4477a] transition-colors"
        >
          {isRTL ? 'عرض الاختبارات' : 'View Exams'}
        </Link>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'إنشاء اختبار جديد' : 'Create New Exam'}
        </h1>
        <Link
          href={`/${locale}/academy/teacher/exams`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {isRTL ? '← العودة' : '← Back'}
        </Link>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => setCurrentStep(step)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                idx === stepIndex
                  ? 'bg-[#F0548B] text-white'
                  : idx < stepIndex
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs border border-current">
                {idx < stepIndex ? '✓' : idx + 1}
              </span>
              <span className="hidden sm:inline">{stepLabels[step]}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 mx-1 ${idx < stepIndex ? 'bg-green-300' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {currentStep === 'metadata' && (
          <MetadataStep metadata={metadata} setMetadata={setMetadata} isRTL={isRTL} />
        )}

        {currentStep === 'questions' && (
          <QuestionsStep
            questions={questions}
            showForm={showQuestionForm}
            setShowForm={setShowQuestionForm}
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            createEmptyQuestion={createEmptyQuestion}
            isRTL={isRTL}
          />
        )}

        {currentStep === 'assign' && (
          <AssignStep
            assignment={assignment}
            setAssignment={setAssignment}
            assignGrade={assignGrade}
            setAssignGrade={setAssignGrade}
            assignStudentIds={assignStudentIds}
            setAssignStudentIds={setAssignStudentIds}
            isRTL={isRTL}
          />
        )}

        {currentStep === 'preview' && (
          <PreviewStep metadata={metadata} questions={questions} assignment={assignment} assignGrade={assignGrade} isRTL={isRTL} />
        )}

        {currentStep === 'publish' && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-700 mb-6">
              {isRTL
                ? `هل أنت متأكد من نشر الاختبار "${metadata.title}" مع ${questions.length} سؤال؟`
                : `Are you sure you want to publish "${metadata.title}" with ${questions.length} questions?`}
            </p>
            <button
              onClick={handlePublish}
              disabled={publishing || !metadata.title || questions.length === 0}
              className="px-6 py-3 bg-[#F0548B] text-white rounded-lg font-medium hover:bg-[#d4477a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {publishing
                ? isRTL ? 'جاري النشر...' : 'Publishing...'
                : isRTL ? 'نشر الاختبار' : 'Publish Exam'}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={stepIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isRTL ? 'السابق' : 'Previous'}
        </button>
        {currentStep !== 'publish' && (
          <button
            onClick={nextStep}
            className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] transition-colors"
          >
            {isRTL ? 'التالي' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
}


// === Step Components ===

function MetadataStep({
  metadata,
  setMetadata,
  isRTL,
}: {
  metadata: ExamMetadata;
  setMetadata: (m: ExamMetadata) => void;
  isRTL: boolean;
}) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'عنوان الاختبار' : 'Exam Title'} *
        </label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          placeholder={isRTL ? 'مثال: اختبار النحو - الوحدة الأولى' : 'e.g. Grammar Quiz - Unit 1'}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'المادة' : 'Subject'} *
          </label>
          <select
            value={metadata.subject}
            onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          >
            <option value="">{isRTL ? 'اختر المادة' : 'Select subject'}</option>
            <option value="اللغة العربية">اللغة العربية</option>
            <option value="التربية الإسلامية">التربية الإسلامية</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'الصف' : 'Grade'} *
          </label>
          <select
            value={metadata.grade}
            onChange={(e) => setMetadata({ ...metadata, grade: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          >
            <option value="">{isRTL ? 'اختر الصف' : 'Select grade'}</option>
            <option value="الصف السادس">الصف السادس</option>
            <option value="الصف السابع">الصف السابع</option>
            <option value="الصف الثامن">الصف الثامن</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'المدة (دقائق)' : 'Duration (min)'}
          </label>
          <input
            type="number"
            min={5}
            max={180}
            value={metadata.duration}
            onChange={(e) => setMetadata({ ...metadata, duration: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'تاريخ البدء' : 'Start Date'}
          </label>
          <input
            type="datetime-local"
            value={metadata.startDate}
            onChange={(e) => setMetadata({ ...metadata, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
          </label>
          <input
            type="datetime-local"
            value={metadata.endDate}
            onChange={(e) => setMetadata({ ...metadata, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isRTL ? 'التعليمات' : 'Instructions'}
        </label>
        <textarea
          value={metadata.instructions}
          onChange={(e) => setMetadata({ ...metadata, instructions: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30 focus:border-[#F0548B]"
          placeholder={isRTL ? 'تعليمات الاختبار للطلاب...' : 'Exam instructions for students...'}
        />
      </div>
    </div>
  );
}


function QuestionsStep({
  questions,
  showForm,
  setShowForm,
  editingQuestion,
  setEditingQuestion,
  addQuestion,
  removeQuestion,
  createEmptyQuestion,
  isRTL,
}: {
  questions: DraftQuestion[];
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  editingQuestion: DraftQuestion | null;
  setEditingQuestion: (q: DraftQuestion | null) => void;
  addQuestion: (q: DraftQuestion) => void;
  removeQuestion: (id: string) => void;
  createEmptyQuestion: () => DraftQuestion;
  isRTL: boolean;
}) {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            {isRTL ? `الأسئلة (${questions.length})` : `Questions (${questions.length})`}
          </h3>
          <p className="text-sm text-gray-500">
            {isRTL ? `إجمالي الدرجات: ${totalPoints}` : `Total points: ${totalPoints}`}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditingQuestion(null); setShowForm(true); }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] transition-colors"
          >
            {isRTL ? '+ إضافة سؤال' : '+ Add Question'}
          </button>
        )}
      </div>

      {showForm && (
        <QuestionForm
          question={editingQuestion || createEmptyQuestion()}
          onSave={addQuestion}
          onCancel={() => { setShowForm(false); setEditingQuestion(null); }}
          isRTL={isRTL}
        />
      )}

      {!showForm && questions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          {isRTL ? 'لم تتم إضافة أسئلة بعد' : 'No questions added yet'}
        </div>
      )}

      {!showForm && questions.length > 0 && (
        <ul className="space-y-3">
          {questions.map((q, idx) => (
            <li key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F0548B]/10 text-[#F0548B] text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">{q.text || (isRTL ? 'سؤال بدون نص' : 'Untitled question')}</p>
                  <p className="text-xs text-gray-400">
                    {questionTypeLabel(q.type, isRTL)} • {q.points} {isRTL ? 'درجة' : 'pts'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingQuestion(q); setShowForm(true); }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {isRTL ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function questionTypeLabel(type: QuestionType, isRTL: boolean): string {
  const labels: Record<QuestionType, [string, string]> = {
    multiple_choice: ['اختيار من متعدد', 'MCQ'],
    true_false: ['صح/خطأ', 'True/False'],
    short_answer: ['إجابة قصيرة', 'Short Answer'],
    essay: ['مقالي', 'Essay'],
    matching: ['مطابقة', 'Matching'],
  };
  return isRTL ? labels[type][0] : labels[type][1];
}


function QuestionForm({
  question,
  onSave,
  onCancel,
  isRTL,
}: {
  question: DraftQuestion;
  onSave: (q: DraftQuestion) => void;
  onCancel: () => void;
  isRTL: boolean;
}) {
  const [draft, setDraft] = useState<DraftQuestion>(question);

  function addOption() {
    if (draft.options.length >= 6) return;
    setDraft({
      ...draft,
      options: [...draft.options, { id: `opt-${Date.now()}`, text: '', isCorrect: false }],
    });
  }

  function removeOption(id: string) {
    if (draft.options.length <= 2) return;
    setDraft({ ...draft, options: draft.options.filter((o) => o.id !== id) });
  }

  function updateOption(id: string, updates: Partial<AnswerOption>) {
    setDraft({
      ...draft,
      options: draft.options.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    });
  }

  function setCorrectOption(id: string) {
    setDraft({
      ...draft,
      options: draft.options.map((o) => ({ ...o, isCorrect: o.id === id })),
    });
  }

  function addMatchingPair() {
    setDraft({ ...draft, matchingPairs: [...draft.matchingPairs, { left: '', right: '' }] });
  }

  function removeMatchingPair(idx: number) {
    if (draft.matchingPairs.length <= 1) return;
    setDraft({ ...draft, matchingPairs: draft.matchingPairs.filter((_, i) => i !== idx) });
  }

  function updateMatchingPair(idx: number, field: 'left' | 'right', value: string) {
    setDraft({
      ...draft,
      matchingPairs: draft.matchingPairs.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isRTL ? 'نوع السؤال' : 'Question Type'}
          </label>
          <select
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value as QuestionType })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          >
            <option value="multiple_choice">{isRTL ? 'اختيار من متعدد' : 'Multiple Choice'}</option>
            <option value="true_false">{isRTL ? 'صح / خطأ' : 'True / False'}</option>
            <option value="short_answer">{isRTL ? 'إجابة قصيرة' : 'Short Answer'}</option>
            <option value="essay">{isRTL ? 'مقالي' : 'Essay'}</option>
            <option value="matching">{isRTL ? 'مطابقة' : 'Matching'}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isRTL ? 'الدرجة' : 'Points'}
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={draft.points}
            onChange={(e) => setDraft({ ...draft, points: Number(e.target.value) })}
            className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {isRTL ? 'نص السؤال' : 'Question Text'} *
        </label>
        <textarea
          value={draft.text}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          placeholder={isRTL ? 'اكتب السؤال هنا...' : 'Enter question text...'}
        />
      </div>

      {/* MCQ Options */}
      {draft.type === 'multiple_choice' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            {isRTL ? 'الخيارات (2-6)' : 'Options (2-6)'}
          </label>
          <div className="space-y-2">
            {draft.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${draft.id}`}
                  checked={opt.isCorrect}
                  onChange={() => setCorrectOption(opt.id)}
                  className="accent-[#F0548B]"
                  title={isRTL ? 'الإجابة الصحيحة' : 'Correct answer'}
                />
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => updateOption(opt.id, { text: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
                  placeholder={isRTL ? 'نص الخيار' : 'Option text'}
                />
                {draft.options.length > 2 && (
                  <button onClick={() => removeOption(opt.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                )}
              </div>
            ))}
          </div>
          {draft.options.length < 6 && (
            <button onClick={addOption} className="mt-2 text-xs text-[#F0548B] hover:underline">
              {isRTL ? '+ إضافة خيار' : '+ Add option'}
            </button>
          )}
        </div>
      )}

      {/* True/False */}
      {draft.type === 'true_false' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            {isRTL ? 'الإجابة الصحيحة' : 'Correct Answer'}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`tf-${draft.id}`}
                checked={draft.correctAnswer === 'true'}
                onChange={() => setDraft({ ...draft, correctAnswer: 'true' })}
                className="accent-[#F0548B]"
              />
              <span className="text-sm">{isRTL ? 'صح' : 'True'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`tf-${draft.id}`}
                checked={draft.correctAnswer === 'false'}
                onChange={() => setDraft({ ...draft, correctAnswer: 'false' })}
                className="accent-[#F0548B]"
              />
              <span className="text-sm">{isRTL ? 'خطأ' : 'False'}</span>
            </label>
          </div>
        </div>
      )}

      {/* Short Answer */}
      {draft.type === 'short_answer' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {isRTL ? 'الإجابة الصحيحة' : 'Correct Answer'}
          </label>
          <input
            type="text"
            value={typeof draft.correctAnswer === 'string' ? draft.correctAnswer : ''}
            onChange={(e) => setDraft({ ...draft, correctAnswer: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
            placeholder={isRTL ? 'الإجابة المتوقعة' : 'Expected answer'}
          />
        </div>
      )}

      {/* Matching */}
      {draft.type === 'matching' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            {isRTL ? 'أزواج المطابقة' : 'Matching Pairs'}
          </label>
          <div className="space-y-2">
            {draft.matchingPairs.map((pair, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={pair.left}
                  onChange={(e) => updateMatchingPair(idx, 'left', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
                  placeholder={isRTL ? 'العنصر' : 'Item'}
                />
                <span className="text-gray-400">↔</span>
                <input
                  type="text"
                  value={pair.right}
                  onChange={(e) => updateMatchingPair(idx, 'right', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
                  placeholder={isRTL ? 'المطابق' : 'Match'}
                />
                {draft.matchingPairs.length > 1 && (
                  <button onClick={() => removeMatchingPair(idx)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addMatchingPair} className="mt-2 text-xs text-[#F0548B] hover:underline">
            {isRTL ? '+ إضافة زوج' : '+ Add pair'}
          </button>
        </div>
      )}

      {/* Essay - no correct answer needed */}
      {draft.type === 'essay' && (
        <p className="text-xs text-gray-400 mb-4">
          {isRTL ? 'الأسئلة المقالية تُصحح يدوياً' : 'Essay questions are graded manually'}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => onSave(draft)}
          disabled={!draft.text.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRTL ? 'حفظ السؤال' : 'Save Question'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {isRTL ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}


function AssignStep({
  assignment,
  setAssignment,
  assignGrade,
  setAssignGrade,
  assignStudentIds,
  setAssignStudentIds,
  isRTL,
}: {
  assignment: ExamAssignment;
  setAssignment: (a: ExamAssignment) => void;
  assignGrade: string;
  setAssignGrade: (g: string) => void;
  assignStudentIds: string[];
  setAssignStudentIds: (ids: string[]) => void;
  isRTL: boolean;
}) {
  return (
    <div className="max-w-xl space-y-4">
      <h3 className="font-semibold text-gray-800 mb-2">
        {isRTL ? 'تعيين الاختبار للطلاب' : 'Assign Exam to Students'}
      </h3>

      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="assignment"
            checked={assignment.type === 'all'}
            onChange={() => setAssignment({ type: 'all' })}
            className="accent-[#F0548B]"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">{isRTL ? 'جميع الطلاب' : 'All Students'}</p>
            <p className="text-xs text-gray-400">{isRTL ? 'سيظهر لجميع الطلاب المسجلين' : 'Visible to all enrolled students'}</p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="assignment"
            checked={assignment.type === 'grade'}
            onChange={() => setAssignment({ type: 'grade', grade: assignGrade })}
            className="accent-[#F0548B]"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{isRTL ? 'صف محدد' : 'Specific Grade'}</p>
            {assignment.type === 'grade' && (
              <select
                value={assignGrade}
                onChange={(e) => { setAssignGrade(e.target.value); setAssignment({ type: 'grade', grade: e.target.value }); }}
                className="mt-2 w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
              >
                <option value="">{isRTL ? 'اختر الصف' : 'Select grade'}</option>
                <option value="الصف السادس">الصف السادس</option>
                <option value="الصف السابع">الصف السابع</option>
                <option value="الصف الثامن">الصف الثامن</option>
              </select>
            )}
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="assignment"
            checked={assignment.type === 'students'}
            onChange={() => setAssignment({ type: 'students', studentIds: assignStudentIds })}
            className="accent-[#F0548B]"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{isRTL ? 'طلاب محددون' : 'Specific Students'}</p>
            {assignment.type === 'students' && (
              <p className="text-xs text-gray-400 mt-1">
                {isRTL
                  ? `${assignStudentIds.length} طالب محدد`
                  : `${assignStudentIds.length} students selected`}
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

function PreviewStep({
  metadata,
  questions,
  assignment,
  assignGrade,
  isRTL,
}: {
  metadata: ExamMetadata;
  questions: DraftQuestion[];
  assignment: ExamAssignment;
  assignGrade: string;
  isRTL: boolean;
}) {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">
        {isRTL ? 'معاينة الاختبار (كما يراه الطالب)' : 'Exam Preview (Student View)'}
      </h3>

      {/* Exam Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800">{metadata.title || (isRTL ? 'بدون عنوان' : 'Untitled')}</h4>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          <span>📚 {metadata.subject || '—'}</span>
          <span>🎓 {metadata.grade || '—'}</span>
          <span>⏱ {metadata.duration} {isRTL ? 'دقيقة' : 'min'}</span>
          <span>📝 {questions.length} {isRTL ? 'سؤال' : 'questions'}</span>
          <span>⭐ {totalPoints} {isRTL ? 'درجة' : 'points'}</span>
        </div>
        {metadata.instructions && (
          <p className="mt-3 text-sm text-gray-600 bg-white p-3 rounded border border-gray-100">
            {metadata.instructions}
          </p>
        )}
        <div className="mt-2 text-xs text-gray-400">
          {isRTL ? 'التعيين: ' : 'Assigned to: '}
          {assignment.type === 'all' && (isRTL ? 'جميع الطلاب' : 'All students')}
          {assignment.type === 'grade' && (assignGrade || (isRTL ? 'صف غير محدد' : 'No grade selected'))}
          {assignment.type === 'students' && (isRTL ? 'طلاب محددون' : 'Specific students')}
        </div>
      </div>

      {/* Questions Preview */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-gray-800">
                {idx + 1}. {q.text}
              </p>
              <span className="text-xs text-gray-400 whitespace-nowrap ms-2">
                ({q.points} {isRTL ? 'د' : 'pts'})
              </span>
            </div>

            {q.type === 'multiple_choice' && (
              <div className="space-y-1 ms-4">
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full border border-gray-300" />
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
            )}

            {q.type === 'true_false' && (
              <div className="flex gap-4 ms-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border border-gray-300" /> {isRTL ? 'صح' : 'True'}</span>
                <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border border-gray-300" /> {isRTL ? 'خطأ' : 'False'}</span>
              </div>
            )}

            {q.type === 'short_answer' && (
              <div className="ms-4 mt-2">
                <div className="w-full h-8 border-b border-gray-300" />
              </div>
            )}

            {q.type === 'essay' && (
              <div className="ms-4 mt-2">
                <div className="w-full h-20 border border-gray-200 rounded bg-gray-50" />
              </div>
            )}

            {q.type === 'matching' && (
              <div className="ms-4 mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="space-y-1">
                  {q.matchingPairs.map((p, i) => (
                    <div key={i} className="p-1.5 bg-gray-50 rounded border border-gray-100">{p.left}</div>
                  ))}
                </div>
                <div className="space-y-1">
                  {q.matchingPairs.map((p, i) => (
                    <div key={i} className="p-1.5 bg-gray-50 rounded border border-gray-100">{p.right}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
