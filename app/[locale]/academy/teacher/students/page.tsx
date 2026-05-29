'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import { generateWhatsAppLink } from '@/lib/academy/services/utils';
import type { Student, Parent } from '@/lib/academy/types';

export default function TeacherStudentsPage() {
  const { services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [showGroupMessage, setShowGroupMessage] = useState(false);
  const [filterGrade, setFilterGrade] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [studentList, parentList] = await Promise.all([
          services.users.getStudents(),
          services.users.getParents(),
        ]);
        setStudents(studentList);
        setParents(parentList);
      } catch (error) {
        console.error('Failed to load students data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services]);

  function getParent(parentId?: string): Parent | undefined {
    if (!parentId) return undefined;
    return parents.find((p) => p.id === parentId);
  }

  function toggleContact(phone: string) {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(phone)) {
        next.delete(phone);
      } else {
        next.add(phone);
      }
      return next;
    });
  }

  function selectAllVisible() {
    const phones = new Set<string>();
    filteredStudents.forEach((s) => {
      if (s.phone) phones.add(s.phone);
      const parent = getParent(s.parentId);
      if (parent?.phone) phones.add(parent.phone);
    });
    setSelectedContacts(phones);
  }

  function clearSelection() {
    setSelectedContacts(new Set());
  }

  const uniqueGrades = [...new Set(students.map((s) => s.grade))];
  const filteredStudents = filterGrade
    ? students.filter((s) => s.grade === filterGrade)
    : students;

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
            {isRTL ? 'قائمة الطلاب' : 'Student List'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isRTL ? 'عرض الطلاب والتواصل عبر WhatsApp' : 'View students and communicate via WhatsApp'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F0548B] focus:border-transparent"
          >
            <option value="">{isRTL ? 'جميع الصفوف' : 'All Grades'}</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          {selectedContacts.size > 0 && (
            <button
              onClick={() => setShowGroupMessage(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              📱 {isRTL ? `رسالة جماعية (${selectedContacts.size})` : `Group Message (${selectedContacts.size})`}
            </button>
          )}
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={selectAllVisible}
          className="text-sm text-[#F0548B] hover:text-[#d6477a]"
        >
          {isRTL ? 'تحديد الكل' : 'Select All'}
        </button>
        <button
          onClick={clearSelection}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {isRTL ? 'إلغاء التحديد' : 'Clear Selection'}
        </button>
        <span className="text-sm text-gray-400">
          {filteredStudents.length} {isRTL ? 'طالب' : 'students'}
        </span>
      </div>

      {/* Student Cards */}
      <div className="space-y-3">
        {filteredStudents.map((student) => {
          const parent = getParent(student.parentId);
          const studentSelected = student.phone ? selectedContacts.has(student.phone) : false;
          const parentSelected = parent?.phone ? selectedContacts.has(parent.phone) : false;

          return (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{student.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      student.studentType === 'regular'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {student.studentType === 'regular'
                        ? (isRTL ? 'منهج' : 'Regular')
                        : (isRTL ? 'غير ناطق' : 'Non-Native')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span>🎓 {student.grade}</span>
                    <span>📧 {student.email}</span>
                    {student.phone && <span>📱 {student.phone}</span>}
                  </div>
                </div>

                {/* WhatsApp Buttons for Student */}
                <div className="flex items-center gap-2">
                  {student.phone && (
                    <>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={studentSelected}
                          onChange={() => toggleContact(student.phone!)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </label>
                      <a
                        href={generateWhatsAppLink(student.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        💬 {isRTL ? 'واتساب الطالب' : 'Student WhatsApp'}
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Parent Info */}
              {parent && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-400">{isRTL ? 'ولي الأمر:' : 'Parent:'}</span>{' '}
                        {parent.name}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
                        <span>📧 {parent.email}</span>
                        {parent.phone && <span>📱 {parent.phone}</span>}
                      </div>
                    </div>
                    {parent.phone && (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={parentSelected}
                            onChange={() => toggleContact(parent.phone!)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </label>
                        <a
                          href={generateWhatsAppLink(parent.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          💬 {isRTL ? 'واتساب ولي الأمر' : 'Parent WhatsApp'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Group Message Modal */}
      {showGroupMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isRTL ? 'رسالة جماعية عبر WhatsApp' : 'Group WhatsApp Message'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {isRTL
                ? 'اضغط على كل رابط لفتح محادثة WhatsApp مع كل جهة اتصال'
                : 'Click each link to open a WhatsApp chat with each contact'}
            </p>

            <div className="space-y-2 mb-4">
              {[...selectedContacts].map((phone) => {
                // Find the name for this phone
                const student = students.find((s) => s.phone === phone);
                const parent = parents.find((p) => p.phone === phone);
                const name = student?.name || parent?.name || phone;

                return (
                  <div key={phone} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{name}</p>
                      <p className="text-xs text-gray-400">{phone}</p>
                    </div>
                    <a
                      href={generateWhatsAppLink(phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {isRTL ? 'فتح' : 'Open'}
                    </a>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowGroupMessage(false)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isRTL ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
