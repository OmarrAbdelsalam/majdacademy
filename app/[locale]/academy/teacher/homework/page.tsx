'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Homework, HomeworkSubmission, Student } from '@/lib/academy/types';

export default function TeacherHomeworkPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [homework, setHomework] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, HomeworkSubmission[]>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newFileType, setNewFileType] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [hwList, studentList] = await Promise.all([
          services.homework.getHomework({ teacherId: user.id }),
          services.users.getStudents(),
        ]);
        setHomework(hwList);
        setStudents(studentList);

        // Load submissions for each homework
        const subsMap: Record<string, HomeworkSubmission[]> = {};
        for (const hw of hwList) {
          const subs = await services.homework.getHomeworkSubmissions(hw.id);
          subsMap[hw.id] = subs;
        }
        setSubmissions(subsMap);
      } catch (error) {
        console.error('Failed to load homework data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services, user.id]);

  async function handleCreateHomework(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await services.homework.createHomework({
        title: newTitle,
        description: newDescription,
        teacherId: user.id,
        grade: newGrade,
        subject: newSubject,
        dueDate: new Date(newDueDate).toISOString(),
        fileTypeRequirements: newFileType || undefined,
      });
      setHomework((prev) => [created, ...prev]);
      setShowCreateForm(false);
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
      setNewGrade('');
      setNewSubject('');
      setNewFileType('');
    } catch (error) {
      console.error('Failed to create homework:', error);
    }
  }

  function getStudentName(studentId: string): string {
    const student = students.find((s) => s.id === studentId);
    return student?.name || studentId;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isDuePassed(dueDate: string): boolean {
    return new Date(dueDate).getTime() < Date.now();
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isRTL ? 'إدارة الواجبات' : 'Homework Management'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isRTL ? 'إنشاء ومتابعة الواجبات المنزلية' : 'Create and track homework assignments'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-[#F0548B] text-white rounded-lg hover:bg-[#d6477a] transition-colors"
        >
          {isRTL ? '+ واجب جديد' : '+ New Homework'}
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isRTL ? 'إنشاء واجب جديد' : 'Create New Homework'}
            </h2>
            <form onSubmit={handleCreateHomework} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'العنوان' : 'Title'}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'المادة' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'الصف' : 'Grade'}
                  </label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'تاريخ التسليم' : 'Due Date'}
                </label>
                <input
                  type="datetime-local"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'نوع الملف المطلوب (اختياري)' : 'File Type Requirements (optional)'}
                </label>
                <input
                  type="text"
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  placeholder={isRTL ? 'مثال: PDF أو Google Doc' : 'e.g. PDF or Google Doc'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F0548B] text-white rounded-lg hover:bg-[#d6477a] transition-colors"
                >
                  {isRTL ? 'إنشاء' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework List */}
      <div className="space-y-4">
        {homework.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {isRTL ? 'لا توجد واجبات بعد' : 'No homework assignments yet'}
          </div>
        ) : (
          homework.map((hw) => {
            const hwSubs = submissions[hw.id] || [];
            const isExpanded = selectedHomework === hw.id;
            const duePassed = isDuePassed(hw.dueDate);

            return (
              <div
                key={hw.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Homework Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedHomework(isExpanded ? null : hw.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{hw.title}</h3>
                        {duePassed && (
                          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                            {isRTL ? 'انتهى الموعد' : 'Past Due'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{hw.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        <span>📚 {hw.subject}</span>
                        <span>🎓 {hw.grade}</span>
                        <span>📅 {isRTL ? 'التسليم:' : 'Due:'} {formatDate(hw.dueDate)}</span>
                        {hw.fileTypeRequirements && (
                          <span>📎 {hw.fileTypeRequirements}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {hwSubs.length} {isRTL ? 'تسليم' : 'submissions'}
                      </span>
                      <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>

                {/* Submissions List */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {isRTL ? 'التسليمات' : 'Submissions'} ({hwSubs.length})
                    </h4>
                    {hwSubs.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        {isRTL ? 'لا توجد تسليمات بعد' : 'No submissions yet'}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {hwSubs.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#fef0f5] flex items-center justify-center text-sm">
                                👤
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {getStudentName(sub.studentId)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(sub.submittedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {sub.isLate && (
                                <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                                  {isRTL ? 'متأخر' : 'Late'}
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  sub.status === 'reviewed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {sub.status === 'reviewed'
                                  ? isRTL ? 'تمت المراجعة' : 'Reviewed'
                                  : isRTL ? 'بانتظار المراجعة' : 'Pending'}
                              </span>
                              <a
                                href={sub.googleDriveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-xs bg-[#F0548B] text-white rounded-lg hover:bg-[#d6477a] transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {isRTL ? 'فتح الرابط' : 'Open Link'}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
