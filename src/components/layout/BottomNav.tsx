'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Briefcase, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';

export default function BottomNav() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const { likes } = useLikes();

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/search', icon: Search, label: locale === 'ja' ? '探す' : 'Search', badge: likes.length > 0 ? likes.length : undefined },
    { href: '/portfolio', icon: Briefcase, label: t('nav.portfolio') },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--color-surface)]/95 backdrop-blur-sm border-t border-[var(--color-border)] safe-bottom">
        <div className="flex items-center justify-around px-4 py-2">
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
                  relative flex flex-col items-center justify-center
                  flex-1 h-14 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)]'
                  }
                `}
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Nav */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
        </Link>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col items-center gap-2">
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
                  relative flex flex-col items-center justify-center
                  w-14 h-14 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-secondary)]'
                  }
                `}
                title={item.label}
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Language Toggle */}
        <button
          onClick={toggleLocale}
          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-secondary)] transition-all duration-200"
          title={locale === 'en' ? '日本語に切り替え' : 'Switch to English'}
        >
          <Globe size={20} strokeWidth={1.8} />
          <span className="text-[10px] mt-1 font-medium uppercase">{locale}</span>
        </button>
      </nav>
    </>
  );
}
