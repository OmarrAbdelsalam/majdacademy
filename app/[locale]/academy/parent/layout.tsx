'use client';

import { usePathname } from 'next/navigation';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import AcademySidebar from '@/app/components/academy/AcademySidebar';
import AcademyHeader from '@/app/components/academy/AcademyHeader';
import { useEffect, useState } from 'react';
import type { Notification } from '@/lib/academy/types';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { user, services, locale } = useAcademy();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      const notifs = await services.notifications.getNotifications(user.id);
      const count = await services.notifications.getUnreadCount(user.id);
      setNotifications(notifs);
      setUnreadCount(count);
    }
    loadNotifications();
  }, [services, user.id]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AcademySidebar role="parent" locale={locale} currentPath={pathname} />
      <div className="flex-1 flex flex-col min-w-0">
        <AcademyHeader
          user={user}
          locale={locale}
          unreadCount={unreadCount}
          notifications={notifications}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
