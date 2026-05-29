'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Notification } from '@/lib/academy/types';

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  locale: 'ar' | 'en';
}

const typeLabels: Record<string, { ar: string; en: string }> = {
  exam_published: { ar: 'اختبار جديد', en: 'New Exam' },
  exam_graded: { ar: 'نتيجة اختبار', en: 'Exam Graded' },
  report_generated: { ar: 'تقرير جديد', en: 'New Report' },
  homework_reminder: { ar: 'تذكير واجب', en: 'Homework Reminder' },
  attendance_alert: { ar: 'تنبيه حضور', en: 'Attendance Alert' },
};

const typeIcons: Record<string, string> = {
  exam_published: '📝',
  exam_graded: '✅',
  report_generated: '📊',
  homework_reminder: '📖',
  attendance_alert: '⚠️',
};

export default function NotificationBell({ notifications, unreadCount, locale }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'ar';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 5);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return isRTL ? 'الآن' : 'Just now';
    if (diffMins < 60) return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={isRTL ? 'الإشعارات' : 'Notifications'}
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#F0548B] rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`absolute top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        >
          {/* Dropdown header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-[#F0548B] font-medium">
                {unreadCount} {isRTL ? 'غير مقروء' : 'unread'}
              </span>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                    !notification.isRead ? 'bg-[#fef8fa]' : ''
                  }`}
                >
                  {/* Icon */}
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {typeIcons[notification.type] || '🔔'}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#F0548B]">
                        {typeLabels[notification.type]?.[locale] || notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#F0548B] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium mt-0.5 truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {notification.body}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* View all link */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <Link
                href={`/${locale}/academy/student/notifications`}
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#F0548B] font-medium hover:underline block text-center"
              >
                {isRTL ? 'عرض جميع الإشعارات' : 'View all notifications'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
