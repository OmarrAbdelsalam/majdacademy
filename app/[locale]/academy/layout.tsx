'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AcademyProvider } from '@/lib/academy/context/AcademyContext';
import { mockAcademyServices } from '@/lib/academy/services/mock-services';
import type { User, UserRole } from '@/lib/academy/types';

// Mock: default user for development (teacher-1)
// In production, this would come from a real auth service
const DEFAULT_MOCK_USER_ID = 'teacher-1';

interface AcademyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function AcademyLayout({ children, params }: AcademyLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract locale from params (Promise)
    params.then(({ locale: loc }) => {
      setLocale(loc === 'en' ? 'en' : 'ar');
    });
  }, [params]);

  useEffect(() => {
    // Simulate auth check using mock services
    async function checkAuth() {
      try {
        // Try to get current user from mock auth
        let currentUser = await mockAcademyServices.auth.getCurrentUser();

        // If no user is logged in, simulate login with default mock user
        if (!currentUser) {
          // In development, auto-login with mock user
          const mockUser = await mockAcademyServices.users.getUserById(DEFAULT_MOCK_USER_ID);
          if (mockUser) {
            // Simulate login
            await mockAcademyServices.auth.login(mockUser.email, 'mock-password');
            currentUser = mockUser;
          }
        }

        if (!currentUser) {
          // No user found - redirect to login
          router.replace(`/${locale}/login`);
          return;
        }

        setUser(currentUser);

        // Role-based redirect: if user is at /academy root, redirect to their role dashboard
        const academyBasePath = `/${locale}/academy`;
        if (pathname === academyBasePath || pathname === `${academyBasePath}/`) {
          router.replace(`${academyBasePath}/${currentUser.role}`);
        }
      } catch {
        // Auth error - redirect to login
        router.replace(`/${locale}/login`);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [locale, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#F0548B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Will redirect, show nothing
    return null;
  }

  return (
    <AcademyProvider user={user} services={mockAcademyServices} locale={locale}>
      {children}
    </AcademyProvider>
  );
}
