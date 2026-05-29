'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Question, QuestionType } from '@/lib/academy/types';

export default function QuestionBankPage() {
  const { services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New question form state
  const [newType, setNewType] = useState<QuestionType>('multiple_choice');
  const [newText, setNewText] = useState('');
  const [newPoints, setNewPoints] = useState(1);
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    async function loadQuestions() {
      try {
        const filters: Record<string, string> = {};
        if (subjectFilter) filters.subject = subjectFilter;
        if (gradeFilter) filters.grade = gradeFilter;
        if (difficultyFilter) filters.difficulty = difficultyFilter;
        if (typeFilter) filters.type = typeFilter;

        let data: Question[];
        if (searchQuery.trim()) {
          data = await services.questions.searchQuestions(searchQuery, filters as any);
        } else {
          data = await services.questions.getQuestions(filters as any);
        }
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [services, subjectFilter, gradeFilter, difficultyFilter, typeFilter, searchQuery]);

  async function handleSaveQuestion() {
    try {
      const newQuestion = await services.questions.saveQuestion({
        type: newType,
        text: newText,
        points: newPoints,
        metadata: {
          subject: newSubject,
          grade: newGrade,
          difficulty: newDifficulty,
        },
      });
      setQuestions([newQuestion, ...questions]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  }

  function resetForm() {
    setNewType('multiple_choice');
    setNewText('');
    setNewPoints(1);
    setNewSubject('');
    setNewGrade('');
    setNewDifficulty('medium');
  }

  function difficultyBadge(difficulty: string) {
    const config: Record<string, { label: string; color: string }> = {
      easy: { label: isRTL ? 'سهل' : 'Easy', color: 'bg-green-100 text-green-700' },
      medium: { label: isRTL ? 'متوسط' : 'Medium', color: 'bg-yellow-100 text-yellow-700' },
      hard: { label: isRTL ? 'صعب' : 'Hard', color: 'bg-red-100 text-red-700' },
    };
    const c = config[difficulty] || config.medium;
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
  }

  function typeLabel(type: QuestionType): string {
    const labels: Record<QuestionType, [string, string]> = {
      multiple_choice: ['اختيار من متعدد', 'MCQ'],
      true_false: ['صح/خطأ', 'T/F'],
      short_answer: ['إجابة قصيرة', 'Short'],
      essay: ['مقالي', 'Essay'],
      matching: ['مطابقة', 'Match'],
    };
    return isRTL ? labels[type][0] : labels[type][1];
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
          {isRTL ? 'بنك الأسئلة' : 'Question Bank'}
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] transition-colors"
        >
          {showAddForm ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? '+ سؤال جديد' : '+ New Question')}
        </button>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {isRTL ? 'إضافة سؤال جديد' : 'Add New Question'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? 'النوع' : 'Type'}</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value as QuestionType)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
                  <option value="multiple_choice">{isRTL ? 'اختيار من متعدد' : 'Multiple Choice'}</option>
                  <option value="true_false">{isRTL ? 'صح / خطأ' : 'True / False'}</option>
                  <option value="short_answer">{isRTL ? 'إجابة قصيرة' : 'Short Answer'}</option>
                  <option value="essay">{isRTL ? 'مقالي' : 'Essay'}</option>
                  <option value="matching">{isRTL ? 'مطابقة' : 'Matching'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? 'المادة' : 'Subject'}</label>
                <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
                  <option value="">{isRTL ? 'اختر' : 'Select'}</option>
                  <option value="اللغة العربية">اللغة العربية</option>
                  <option value="الرياضيات">الرياضيات</option>
                  <option value="العلوم">العلوم</option>
                  <option value="English">English</option>
                  <option value="التربية الإسلامية">التربية الإسلامية</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? 'الصف' : 'Grade'}</label>
                <select value={newGrade} onChange={(e) => setNewGrade(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
                  <option value="">{isRTL ? 'اختر' : 'Select'}</option>
                  <option value="الصف السادس">الصف السادس</option>
                  <option value="الصف السابع">الصف السابع</option>
                  <option value="الصف الثامن">الصف الثامن</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? 'الصعوبة' : 'Difficulty'}</label>
                <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
                  <option value="easy">{isRTL ? 'سهل' : 'Easy'}</option>
                  <option value="medium">{isRTL ? 'متوسط' : 'Medium'}</option>
                  <option value="hard">{isRTL ? 'صعب' : 'Hard'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? 'الدرجة' : 'Points'}</label>
                <input type="number" min={1} value={newPoints} onChange={(e) => setNewPoints(Number(e.target.value))} className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? 'نص السؤال' : 'Question Text'} *</label>
              <textarea value={newText} onChange={(e) => setNewText(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30" placeholder={isRTL ? 'اكتب السؤال...' : 'Enter question text...'} />
            </div>
            <button
              onClick={handleSaveQuestion}
              disabled={!newText.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#F0548B] rounded-lg hover:bg-[#d4477a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRTL ? 'حفظ السؤال' : 'Save Question'}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث...' : 'Search...'}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30"
          />
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
            <option value="">{isRTL ? 'كل المواد' : 'All Subjects'}</option>
            <option value="اللغة العربية">اللغة العربية</option>
            <option value="الرياضيات">الرياضيات</option>
            <option value="العلوم">العلوم</option>
            <option value="English">English</option>
            <option value="التربية الإسلامية">التربية الإسلامية</option>
          </select>
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
            <option value="">{isRTL ? 'كل الصفوف' : 'All Grades'}</option>
            <option value="الصف السادس">الصف السادس</option>
            <option value="الصف السابع">الصف السابع</option>
            <option value="الصف الثامن">الصف الثامن</option>
          </select>
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
            <option value="">{isRTL ? 'كل المستويات' : 'All Levels'}</option>
            <option value="easy">{isRTL ? 'سهل' : 'Easy'}</option>
            <option value="medium">{isRTL ? 'متوسط' : 'Medium'}</option>
            <option value="hard">{isRTL ? 'صعب' : 'Hard'}</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F0548B]/30">
            <option value="">{isRTL ? 'كل الأنواع' : 'All Types'}</option>
            <option value="multiple_choice">{isRTL ? 'اختيار من متعدد' : 'MCQ'}</option>
            <option value="true_false">{isRTL ? 'صح/خطأ' : 'T/F'}</option>
            <option value="short_answer">{isRTL ? 'إجابة قصيرة' : 'Short'}</option>
            <option value="essay">{isRTL ? 'مقالي' : 'Essay'}</option>
            <option value="matching">{isRTL ? 'مطابقة' : 'Match'}</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {isRTL ? 'لا توجد أسئلة مطابقة' : 'No matching questions'}
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{q.text}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                      {typeLabel(q.type)}
                    </span>
                    {difficultyBadge(q.metadata.difficulty)}
                    <span className="text-xs text-gray-400">📚 {q.metadata.subject}</span>
                    <span className="text-xs text-gray-400">🎓 {q.metadata.grade}</span>
                    <span className="text-xs text-gray-400">⭐ {q.points} {isRTL ? 'د' : 'pts'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Count */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        {isRTL ? `${questions.length} سؤال` : `${questions.length} questions`}
      </div>
    </div>
  );
}
