'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Briefcase, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';

export default function BottomNav() {
  const pathname = usePathname();
  const { locale, setLocale } = useI18n();
  const { likes } = useLikes();

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
      badge: likes.length > 0 ? likes.length : undefined
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
      {/* Mobile Bottom Nav - Clean Museum Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
        <div className="absolute inset-0 bg-white/95 backdrop-blur-lg border-t border-[var(--color-border)]" />

        <div className="relative flex items-center justify-around px-4 py-2">
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
                  relative flex flex-col items-center justify-center gap-1 py-2 px-4
                  transition-all duration-200
                  ${isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                  }
                `}
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-[var(--color-mint)] text-[var(--color-ink)] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {locale === 'ja' ? item.labelJa : item.labelEn}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Nav - Clean Museum Style */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col py-8 px-4 bg-white border-r border-[var(--color-border)] z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-10 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight">finango</span>
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
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[var(--color-primary)]" />
                )}

                <div className="relative">
                  <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-[var(--color-mint)] text-[var(--color-ink)] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-sm">
                  {locale === 'ja' ? item.labelJa : item.labelEn}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          <button
            onClick={toggleLocale}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)] transition-all duration-200"
          >
            <Globe size={18} strokeWidth={1.5} />
            <span className="text-sm">{locale === 'ja' ? 'English' : '日本語'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
