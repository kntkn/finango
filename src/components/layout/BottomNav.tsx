'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, User, Globe } from 'lucide-react';
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
      isMain: false
    },
    {
      href: '/search',
      icon: Store,
      labelEn: 'Marketplace',
      labelJa: 'マーケット',
      isMain: true,
      badge: likes.length > 0 ? likes.length : undefined
    },
    {
      href: '/portfolio',
      icon: User,
      labelEn: 'My Page',
      labelJa: 'マイページ',
      isMain: false
    },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <>
      {/* Mobile Bottom Nav - Premium Glass Morphism */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
        {/* Glass background with blur */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-[var(--color-border)]" />

        <div className="relative flex items-center justify-around px-6 py-3">
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
                  relative flex items-center justify-center
                  transition-all duration-300 ease-[var(--ease-out-expo)]
                  ${item.isMain
                    ? 'w-14 h-14 -mt-6 rounded-2xl shadow-[var(--shadow-glow)] ' +
                      (isActive
                        ? 'bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white scale-105'
                        : 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white hover:scale-105')
                    : 'w-12 h-12 rounded-xl ' +
                      (isActive
                        ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/8'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5')
                  }
                `}
              >
                <item.icon
                  size={item.isMain ? 22 : 20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}

                {/* Active indicator dot */}
                {isActive && !item.isMain && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Nav - Editorial Style */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col py-8 px-5 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50">
        {/* Logo with gradient accent */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-10 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <span className="text-white font-display font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-display font-bold text-[var(--color-text)] tracking-tight">finango</span>
        </Link>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-1.5">
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
                  relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ease-[var(--ease-out-expo)]
                  ${isActive
                    ? item.isMain
                      ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white font-semibold shadow-md'
                      : 'bg-[var(--color-primary)]/8 text-[var(--color-primary)] font-semibold'
                    : item.isMain
                      ? 'text-[var(--color-text)] hover:bg-[var(--color-accent)]/8 font-medium'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)]'
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && !item.isMain && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[var(--color-primary)]" />
                )}

                <div className="relative">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-sm">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[15px] tracking-wide">
                  {locale === 'ja' ? item.labelJa : item.labelEn}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[var(--color-border)]/50 pt-5 mt-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLocale}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text)] transition-all duration-300 ease-[var(--ease-out-expo)]"
          >
            <Globe size={18} strokeWidth={1.8} />
            <span className="text-sm tracking-wide">{locale === 'ja' ? 'English' : '日本語'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
