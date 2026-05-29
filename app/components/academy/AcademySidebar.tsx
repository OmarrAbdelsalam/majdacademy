'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@/lib/academy/types';

// Navigation items per role with bilingual labels
const navigationItems: Record<
  UserRole,
  Array<{ key: string; href: string; icon: string; label: { ar: string; en: string } }>
> = {
  teacher: [
    { key: 'home', href: '', icon: '🏠', label: { ar: 'الرئيسية', en: 'Home' } },
    { key: 'exams', href: '/exams', icon: '📝', label: { ar: 'الاختبارات', en: 'Exams' } },
    { key: 'question-bank', href: '/question-bank', icon: '📚', label: { ar: 'بنك الأسئلة', en: 'Question Bank' } },
    { key: 'submissions', href: '/submissions', icon: '📋', label: { ar: 'التسليمات', en: 'Submissions' } },
    { key: 'homework', href: '/homework', icon: '📖', label: { ar: 'الواجبات', en: 'Homework' } },
    { key: 'reports', href: '/reports', icon: '📊', label: { ar: 'التقارير', en: 'Reports' } },
    { key: 'attendance', href: '/attendance', icon: '✅', label: { ar: 'الحضور', en: 'Attendance' } },
    { key: 'analytics', href: '/analytics', icon: '📈', label: { ar: 'الإحصائيات', en: 'Analytics' } },
    { key: 'schedule', href: '/schedule', icon: '🗓️', label: { ar: 'الجدول', en: 'Schedule' } },
    { key: 'students', href: '/students', icon: '👨‍🎓', label: { ar: 'الطلاب', en: 'Students' } },
  ],
  student: [
    { key: 'home', href: '', icon: '🏠', label: { ar: 'الرئيسية', en: 'Home' } },
    { key: 'exams', href: '/exams', icon: '📝', label: { ar: 'الاختبارات', en: 'Exams' } },
    { key: 'exam-history', href: '/exams/history', icon: '📜', label: { ar: 'سجل الاختبارات', en: 'Exam History' } },
    { key: 'homework', href: '/homework', icon: '📖', label: { ar: 'الواجبات', en: 'Homework' } },
    { key: 'reports', href: '/reports', icon: '📊', label: { ar: 'التقارير', en: 'Reports' } },
    { key: 'schedule', href: '/schedule', icon: '🗓️', label: { ar: 'الجدول', en: 'Schedule' } },
    { key: 'notifications', href: '/notifications', icon: '🔔', label: { ar: 'الإشعارات', en: 'Notifications' } },
  ],
  parent: [
    { key: 'home', href: '', icon: '🏠', label: { ar: 'الرئيسية', en: 'Home' } },
    { key: 'exam-history', href: '/exams', icon: '📜', label: { ar: 'سجل الاختبارات', en: 'Exam History' } },
    { key: 'reports', href: '/reports', icon: '📊', label: { ar: 'التقارير', en: 'Reports' } },
    { key: 'homework', href: '/homework', icon: '📖', label: { ar: 'الواجبات', en: 'Homework' } },
    { key: 'progress', href: '/progress', icon: '📈', label: { ar: 'التقدم', en: 'Progress' } },
    { key: 'notifications', href: '/notifications', icon: '🔔', label: { ar: 'الإشعارات', en: 'Notifications' } },
  ],
};

const roleLabels: Record<UserRole, { ar: string; en: string }> = {
  teacher: { ar: 'لوحة المعلم', en: 'Teacher Panel' },
  student: { ar: 'لوحة الطالب', en: 'Student Panel' },
  parent: { ar: 'لوحة ولي الأمر', en: 'Parent Panel' },
};

interface AcademySidebarProps {
  role: UserRole;
  locale: 'ar' | 'en';
  currentPath?: string;
}

export default function AcademySidebar({ role, locale, currentPath = '' }: AcademySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isRTL = locale === 'ar';
  const items = navigationItems[role];
  const basePath = `/${locale}/academy/${role}`;

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger toggle button - visible only on mobile (< 1024px) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors ${
            isRTL ? 'right-4' : 'left-4'
          }`}
          aria-label={isOpen ? (locale === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (locale === 'ar' ? 'فتح القائمة' : 'Open menu')}
        >
          {isOpen ? (
            <span className="block w-6 h-6 text-center text-lg leading-6">✕</span>
          ) : (
            <span className="block w-6 h-6 text-center text-lg leading-6">☰</span>
          )}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed top-0 h-full z-40 flex flex-col bg-white border-gray-200 shadow-lg transition-transform duration-300 ease-in-out w-64 ${
          isRTL ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          isOpen
            ? 'translate-x-0'
            : isRTL
            ? 'translate-x-full'
            : '-translate-x-full'
        } ${!isMobile ? 'lg:translate-x-0 lg:static lg:shadow-none' : ''}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F0548B] to-[#f87aaa] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {isRTL ? 'م' : 'M'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800">
              {isRTL ? 'مَجْد أكاديمي' : 'Majd Academy'}
            </span>
            <span className="text-xs text-gray-500">
              {roleLabels[role][locale]}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {items.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive =
                currentPath === href ||
                (item.href === '' && currentPath === basePath);

              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#fef0f5] text-[#F0548B]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span>{item.label[locale]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            {isRTL ? '© أكاديمية مَجْد' : '© Majd Academy'}
          </p>
        </div>
      </aside>
    </>
  );
}
