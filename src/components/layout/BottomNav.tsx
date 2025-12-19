'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Briefcase, Globe, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSidebar } from '@/lib/sidebar';

export default function BottomNav() {
  const pathname = usePathname();
  const { locale, setLocale } = useI18n();
  const { isOpen, toggle } = useSidebar();

  const navItems = [
    {
      href: '/',
      icon: Home,
      labelEn: 'Home',
      labelJa: 'ホーム',
    },
    {
      href: '/search',
      icon: LayoutGrid,
      labelEn: 'Markets',
      labelJa: 'マーケット',
    },
    {
      href: '/portfolio',
      icon: Briefcase,
      labelEn: 'Portfolio',
      labelJa: 'ポートフォリオ',
    },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <>
      {/* Mobile Bottom Nav - Icons only, completely fixed */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          position: 'fixed',
          transform: 'translateZ(0)', // Force GPU layer for stability
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {/* Solid background - no transparency for stability */}
        <div className="absolute inset-0 bg-white border-t border-[var(--color-border)]" />

        {/* Safe area padding for notched devices */}
        <div className="relative flex items-center justify-around px-6 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-xl
                  transition-colors duration-150
                  ${isActive
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-bg)]'
                    : 'text-[var(--color-ink-muted)]'
                  }
                `}
              >
                <item.icon
                  size={24}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Nav - Clean Museum Style with Toggle */}
      <nav
        className={`hidden md:flex fixed left-0 top-0 bottom-0 flex-col py-8 bg-white border-r border-[var(--color-border)] z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-60 px-4' : 'w-16 px-2'
        }`}
      >
        {/* Toggle Button - Larger and more visible */}
        <button
          onClick={toggle}
          className="absolute -right-4 top-8 w-8 h-8 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-ink-muted)] transition-all shadow-md"
        >
          {isOpen ? (
            <PanelLeftClose size={18} className="text-[var(--color-ink-secondary)]" />
          ) : (
            <PanelLeft size={18} className="text-[var(--color-ink-secondary)]" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className={`flex items-center gap-3 mb-10 group ${isOpen ? 'px-3' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight">finango</span>
          )}
        </Link>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-3 py-3 rounded-xl transition-all duration-200
                  ${isOpen ? 'px-4' : 'justify-center px-2'}
                  ${isActive
                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]'
                  }
                `}
                title={!isOpen ? (locale === 'ja' ? item.labelJa : item.labelEn) : undefined}
              >
                {isActive && isOpen && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[var(--color-primary)]" />
                )}

                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {isOpen && (
                  <span className="text-sm">
                    {locale === 'ja' ? item.labelJa : item.labelEn}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          <button
            onClick={toggleLocale}
            className={`w-full flex items-center gap-3 py-3 rounded-xl text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)] transition-all duration-200 ${
              isOpen ? 'px-4' : 'justify-center px-2'
            }`}
            title={!isOpen ? (locale === 'ja' ? 'English' : '日本語') : undefined}
          >
            <Globe size={18} strokeWidth={1.5} />
            {isOpen && (
              <span className="text-sm">{locale === 'ja' ? 'English' : '日本語'}</span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
