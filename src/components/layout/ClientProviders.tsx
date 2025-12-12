'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { LikesProvider } from '@/lib/likes';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LikesProvider>
        {children}
      </LikesProvider>
    </I18nProvider>
  );
}
