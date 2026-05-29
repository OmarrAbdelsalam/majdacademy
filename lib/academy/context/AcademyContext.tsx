'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '../types';
import type { AcademyServices } from '../services';

interface AcademyContextValue {
  user: User;
  services: AcademyServices;
  locale: 'ar' | 'en';
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

export function AcademyProvider({
  user,
  services,
  locale,
  children,
}: AcademyContextValue & { children: ReactNode }) {
  return (
    <AcademyContext.Provider value={{ user, services, locale }}>
      {children}
    </AcademyContext.Provider>
  );
}

export function useAcademy(): AcademyContextValue {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
}
