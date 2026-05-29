'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Notification } from '@/lib/academy/types';
import NotificationBell from './NotificationBell';

interface AcademyHeaderProps {
  user: User;
  locale: 'ar' | 'en';
  unreadCount: number;
  notifications?: Notification[];
}

export default function AcademyHeader({ user, locale, unreadCount, notifications = [] }: AcademyHeaderProps) {
  const pathname = usePathname();
  const isRTL = locale === 'ar';
  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  // Build the language switch URL by replacing the locale segment
  const getLanguageSwitchHref = () => {
    if (!pathname) return `/${otherLocale}/academy`;
    // Replace /ar/ or /en/ at the start of the path
    const newPath = pathname.replace(/^\/(ar|en)/, `/${otherLocale}`);
    return newPath;
  };

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-gray-200 shadow-sm"
    >
      {/* Left side - Page title area (can be extended) */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-800 hidden md:block">
          {isRTL ? 'أكاديمية مَجْد' : 'Majd Academy'}
        </h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Language switch */}
        <Link
          href={getLanguageSwitchHref()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
          aria-label={isRTL ? 'Switch to English' : 'التبديل للعربية'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
        </Link>

        {/* Notification bell */}
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          locale={locale}
        />

        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F0548B] to-[#f87aaa] flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {/* User name - hidden on small screens */}
          <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  );
}
