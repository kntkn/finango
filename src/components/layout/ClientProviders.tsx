'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { LikesProvider } from '@/lib/likes';
import { SidebarProvider } from '@/lib/sidebar';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LikesProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </LikesProvider>
    </I18nProvider>
  );
}
