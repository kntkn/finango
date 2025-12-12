'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, Globe } from 'lucide-react';
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
      icon: ShoppingBag,
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
      {/* Mobile Bottom Nav - Icons Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] safe-bottom">
        <div className="flex items-center justify-around px-6 py-2">
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
                  transition-all duration-200
                  ${item.isMain
                    ? 'w-14 h-14 -mt-5 rounded-full shadow-lg ' +
                      (isActive
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-primary)] text-white')
                    : 'w-12 h-12 rounded-xl ' +
                      (isActive
                        ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'text-[var(--color-text-muted)]')
                  }
                `}
              >
                <item.icon
                  size={item.isMain ? 24 : 22}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Nav - X/Twitter Style */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col py-6 px-4 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-[var(--color-text)]">finango</span>
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
                  relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? item.isMain
                      ? 'bg-[var(--color-accent)] text-white font-semibold'
                      : 'bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-semibold'
                    : item.isMain
                      ? 'text-[var(--color-text)] hover:bg-[var(--color-accent)]/10 font-medium'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
                  }
                `}
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[15px]">
                  {locale === 'ja' ? item.labelJa : item.labelEn}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[var(--color-border)] pt-4 mt-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLocale}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)] transition-all duration-200"
          >
            <Globe size={20} strokeWidth={1.8} />
            <span className="text-[15px]">{locale === 'ja' ? 'English' : '日本語'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
