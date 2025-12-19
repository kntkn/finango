'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/lib/sidebar';

export default function MainContent({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <main
      className={`min-h-screen pb-20 md:pb-0 transition-all duration-300 ease-in-out ${
        isOpen ? 'md:pl-60' : 'md:pl-16'
      }`}
    >
      {children}
    </main>
  );
}
