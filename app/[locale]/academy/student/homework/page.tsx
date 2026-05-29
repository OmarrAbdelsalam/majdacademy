'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import { isValidGoogleDriveUrl } from '@/lib/academy/services/utils';
import type { Homework, HomeworkSubmission } from '@/lib/academy/types';

export default function StudentHomeworkPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [homework, setHomework] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, HomeworkSubmission>>({});
  const [loading, setLoading] = useState(true);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const hwList = await services.homework.getHomework({ studentId: user.id });
        setHomework(hwList);

        // Load submissions for each homework
        const subsMap: Record<string, HomeworkSubmission> = {};
        for (const hw of hwList) {
          const hwSubs = await services.homework.getHomeworkSubmissions(hw.id);
          const mySub = hwSubs.find((s) => s.studentId === user.id);
          if (mySub) {
            subsMap[hw.id] = mySub;
          }
        }
        setSubmissions(subsMap);
      } catch (error) {
        console.error('Failed to load homework:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services, user.id]);

  const handleSubmit = async (homeworkId: string) => {
    const link = linkInputs[homeworkId]?.trim();

    if (!link) {
      setErrors((prev) => ({
        ...prev,
        [homeworkId]: isRTL ? 'الرجاء إدخال الرابط' : 'Please enter a link',
      }));
      return;
    }

    if (!isValidGoogleDriveUrl(link)) {
      setErrors((prev) => ({
        ...prev,
        [homeworkId]: isRTL
          ? 'الرابط غير صالح. يجب أن يكون رابط Google Drive أو Google Docs'
          : 'Invalid URL. Must be a Google Drive or Google Docs link',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [homeworkId]: '' }));
    setSubmitting(homeworkId);

    try {
      const sub = await services.homework.submitHomework({
        homeworkId,
        studentId: user.id,
        googleDriveLink: link,
      });
      setSubmissions((prev) => ({ ...prev, [homeworkId]: sub }));
      setLinkInputs((prev) => ({ ...prev, [homeworkId]: '' }));
    } catch (error) {
      console.error('Failed to submit homework:', error);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  const now = new Date();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'الواجبات' : 'Homework'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'الواجبات المطلوبة منك' : 'Your assigned homework'}
        </p>
      </div>

      {homework.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد واجبات حالياً' : 'No homework assigned'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {homework.map((hw) => {
            const submission = submissions[hw.id];
            const isPastDue = new Date(hw.dueDate) < now;
            const isLate = submission?.isLate;

            return (
              <div
                key={hw.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{hw.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{hw.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLate && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {isRTL ? 'متأخر' : 'Late'}
                      </span>
                    )}
                    {submission && !isLate && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {isRTL ? 'تم التسليم' : 'Submitted'}
                      </span>
                    )}
                    {!submission && isPastDue && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {isRTL ? 'فات الموعد' : 'Overdue'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{hw.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 flex-wrap">
                  <span>📅 {isRTL ? 'الموعد النهائي:' : 'Due:'} {new Date(hw.dueDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                  {hw.fileTypeRequirements && (
                    <span>📎 {hw.fileTypeRequirements}</span>
                  )}
                </div>

                {/* Submission section */}
                {submission ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      {isRTL ? 'الرابط المُسلّم:' : 'Submitted link:'}
                    </p>
                    <a
                      href={submission.googleDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#F0548B] hover:underline break-all"
                    >
                      {submission.googleDriveLink}
                    </a>
                    {submission.feedback && (
                      <p className="text-xs text-blue-600 mt-2">
                        {isRTL ? 'ملاحظة المعلم:' : 'Teacher feedback:'} {submission.feedback}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {isRTL ? 'تاريخ التسليم:' : 'Submitted:'}{' '}
                      {new Date(submission.submittedAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={linkInputs[hw.id] || ''}
                        onChange={(e) => {
                          setLinkInputs((prev) => ({ ...prev, [hw.id]: e.target.value }));
                          setErrors((prev) => ({ ...prev, [hw.id]: '' }));
                        }}
                        placeholder={isRTL ? 'الصق رابط Google Drive هنا...' : 'Paste Google Drive link here...'}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F0548B] focus:ring-1 focus:ring-[#F0548B]"
                      />
                      <button
                        onClick={() => handleSubmit(hw.id)}
                        disabled={submitting === hw.id}
                        className="px-4 py-2 bg-[#F0548B] text-white rounded-lg text-sm font-medium hover:bg-[#d94478] disabled:opacity-50 transition-colors"
                      >
                        {submitting === hw.id
                          ? (isRTL ? '...' : '...')
                          : (isRTL ? 'تسليم' : 'Submit')}
                      </button>
                    </div>
                    {errors[hw.id] && (
                      <p className="text-xs text-red-500 mt-1">{errors[hw.id]}</p>
                    )}
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
