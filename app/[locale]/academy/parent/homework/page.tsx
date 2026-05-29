'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Parent, Student, Homework, HomeworkSubmission } from '@/lib/academy/types';

export default function ParentHomeworkPage() {
  const { user, services, locale } = useAcademy();
  const parent = user as Parent;
  const isRTL = locale === 'ar';

  const [child, setChild] = useState<Student | null>(null);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, HomeworkSubmission>>({});
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

        const hwList = await services.homework.getHomework({ studentId: childId });
        setHomework(hwList);

        // Load submissions for each homework
        const subsMap: Record<string, HomeworkSubmission> = {};
        for (const hw of hwList) {
          const hwSubs = await services.homework.getHomeworkSubmissions(hw.id);
          const childSub = hwSubs.find((s) => s.studentId === childId);
          if (childSub) {
            subsMap[hw.id] = childSub;
          }
        }
        setSubmissions(subsMap);
      } catch (error) {
        console.error('Failed to load homework data:', error);
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

  const now = new Date();

  // Separate into pending and completed
  const pendingHomework = homework.filter((hw) => !submissions[hw.id]);
  const completedHomework = homework.filter((hw) => submissions[hw.id]);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'الواجبات' : 'Homework'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL
            ? `حالة واجبات ${child.name}`
            : `${child.name}'s homework status`}
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
        <>
          {/* Pending Homework */}
          {pendingHomework.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                {isRTL ? 'واجبات لم تُسلّم' : 'Not Submitted'}
                <span className="text-sm font-normal text-gray-500">({pendingHomework.length})</span>
              </h2>
              <div className="space-y-3">
                {pendingHomework.map((hw) => {
                  const isPastDue = new Date(hw.dueDate) < now;
                  return (
                    <div
                      key={hw.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{hw.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{hw.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isPastDue ? (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              {isRTL ? 'فات الموعد' : 'Overdue'}
                            </span>
                          ) : (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                              {isRTL ? 'معلق' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                        <span>
                          📅 {isRTL ? 'الموعد النهائي:' : 'Due:'}{' '}
                          {new Date(hw.dueDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </span>
                        {hw.fileTypeRequirements && (
                          <span>📎 {hw.fileTypeRequirements}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Homework */}
          {completedHomework.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {isRTL ? 'واجبات مُسلّمة' : 'Submitted'}
                <span className="text-sm font-normal text-gray-500">({completedHomework.length})</span>
              </h2>
              <div className="space-y-3">
                {completedHomework.map((hw) => {
                  const submission = submissions[hw.id];
                  return (
                    <div
                      key={hw.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{hw.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{hw.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.isLate ? (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              {isRTL ? 'متأخر' : 'Late'}
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {isRTL ? 'تم التسليم' : 'Submitted'}
                            </span>
                          )}
                          {submission.status === 'reviewed' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {isRTL ? 'تمت المراجعة' : 'Reviewed'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 flex-wrap">
                        <span>
                          📅 {isRTL ? 'الموعد النهائي:' : 'Due:'}{' '}
                          {new Date(hw.dueDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </span>
                        <span>
                          ✅ {isRTL ? 'تاريخ التسليم:' : 'Submitted:'}{' '}
                          {new Date(submission.submittedAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </span>
                      </div>
                      {submission.feedback && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-700">
                            <span className="font-medium">{isRTL ? 'ملاحظة المعلم:' : 'Teacher feedback:'}</span>{' '}
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
