'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Restore from localStorage
    const stored = localStorage.getItem('finango-sidebar-open');
    if (stored !== null) {
      setIsOpen(stored === 'true');
    }
  }, []);

  const toggle = () => {
    setIsOpen(prev => {
      const next = !prev;
      localStorage.setItem('finango-sidebar-open', String(next));
      return next;
    });
  };

  const setOpen = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem('finango-sidebar-open', String(open));
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
