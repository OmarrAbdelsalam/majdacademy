'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import type { Notification } from '@/lib/academy/types';

const NOTIFICATION_ICONS: Record<string, string> = {
  exam_published: '📝',
  exam_graded: '✅',
  report_generated: '📊',
  homework_reminder: '📋',
  attendance_alert: '⚠️',
};

export default function ParentNotificationsPage() {
  const { user, services, locale } = useAcademy();
  const router = useRouter();
  const isRTL = locale === 'ar';

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await services.notifications.getNotifications(user.id);
        // Sort by date descending
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [services, user.id]);

  const handleClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await services.notifications.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate to relevant page
    if (notification.link) {
      router.push(`/${locale}${notification.link}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filter notifications - parent primarily sees reports and attendance alerts
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isRTL ? 'الإشعارات' : 'Notifications'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isRTL
              ? `لديك ${unreadCount} إشعار غير مقروء`
              : `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="flex items-center justify-center w-8 h-8 bg-[#F0548B] text-white text-sm font-bold rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { key: 'all', label: isRTL ? 'الكل' : 'All' },
          { key: 'report_generated', label: isRTL ? 'التقارير' : 'Reports' },
          { key: 'attendance_alert', label: isRTL ? 'الحضور' : 'Attendance' },
          { key: 'exam_graded', label: isRTL ? 'الاختبارات' : 'Exams' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-[#F0548B] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <span className="text-4xl mb-4 block">🔔</span>
          <p className="text-gray-500">
            {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => handleClick(notification)}
                  className={`w-full text-start p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <span className="text-xl mt-0.5">
                      {NOTIFICATION_ICONS[notification.type] || '🔔'}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-800' : 'font-medium text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#F0548B] rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatTimeAgo(notification.createdAt, isRTL)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span className="text-gray-300 mt-1">
                      {isRTL ? '←' : '→'}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string, isRTL: boolean): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  }
  if (diffDays > 0) {
    return isRTL ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
  }
  if (diffMins > 0) {
    return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
  }
  return isRTL ? 'الآن' : 'Just now';
}
