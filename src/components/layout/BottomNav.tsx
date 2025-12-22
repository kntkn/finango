'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutGrid, Briefcase, Globe, PanelLeftClose, PanelLeft, LogIn, LogOut, User } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSidebar } from '@/lib/sidebar';
import { useAuth } from '@/lib/auth';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useI18n();
  const { isOpen, toggle } = useSidebar();
  const { isAuthenticated, logout } = useAuth();

  // Don't show nav on login page or home page (mobile)
  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  const navItems = [
    {
      href: '/',
      icon: Home,
      labelEn: 'Home',
      labelJa: 'ホーム',
      requiresAuth: false,
    },
    {
      href: '/search',
      icon: LayoutGrid,
      labelEn: 'Markets',
      labelJa: 'マーケット',
      requiresAuth: false, // Markets should be browsable without login
    },
    {
      href: '/portfolio',
      icon: Briefcase,
      labelEn: 'Portfolio',
      labelJa: 'ポートフォリオ',
      requiresAuth: true,
    },
  ];

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Bottom Nav - Super stable fixed positioning */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-[var(--color-border)]">
        {/* Safe area padding for notched devices */}
        <div
          className="flex items-center justify-around"
          style={{
            paddingTop: '12px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            // If requires auth and not authenticated, show muted
            const isDisabled = item.requiresAuth && !isAuthenticated;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`
                  flex flex-col items-center justify-center gap-1 min-w-[60px] py-1
                  ${isActive && !isDisabled
                    ? 'text-[var(--color-primary)]'
                    : isDisabled
                    ? 'text-[var(--color-ink-muted)]/40'
                    : 'text-[var(--color-ink-muted)]'
                  }
                `}
              >
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {locale === 'ja' ? item.labelJa : item.labelEn}
                </span>
              </Link>
            );
          })}

          {/* Login/User button on mobile */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 text-[var(--color-ink-muted)]"
            >
              <User size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">
                {locale === 'ja' ? 'マイページ' : 'Account'}
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className={`
                flex flex-col items-center justify-center gap-1 min-w-[60px] py-1
                ${pathname === '/login'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-ink-muted)]'
                }
              `}
            >
              <LogIn size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">
                {locale === 'ja' ? 'ログイン' : 'Login'}
              </span>
            </Link>
          )}
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

            const isDisabled = item.requiresAuth && !isAuthenticated;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`
                  relative flex items-center gap-3 py-3 rounded-xl transition-all duration-200
                  ${isOpen ? 'px-4' : 'justify-center px-2'}
                  ${isActive && !isDisabled
                    ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-semibold'
                    : isDisabled
                    ? 'text-[var(--color-ink-muted)]/40 cursor-not-allowed'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-ink)]'
                  }
                `}
                title={!isOpen ? (locale === 'ja' ? item.labelJa : item.labelEn) : undefined}
              >
                {isActive && isOpen && !isDisabled && (
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
        <div className="border-t border-[var(--color-border)] pt-4 mt-4 space-y-1">
          {/* User / Login */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 py-3 rounded-xl text-[var(--color-ink-muted)] hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
                isOpen ? 'px-4' : 'justify-center px-2'
              }`}
              title={!isOpen ? (locale === 'ja' ? 'ログアウト' : 'Logout') : undefined}
            >
              <LogOut size={18} strokeWidth={1.5} />
              {isOpen && (
                <span className="text-sm">{locale === 'ja' ? 'ログアウト' : 'Logout'}</span>
              )}
            </button>
          ) : (
            <Link
              href="/login"
              className={`w-full flex items-center gap-3 py-3 rounded-xl text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)] transition-all duration-200 ${
                isOpen ? 'px-4' : 'justify-center px-2'
              }`}
              title={!isOpen ? (locale === 'ja' ? 'ログイン' : 'Login') : undefined}
            >
              <LogIn size={18} strokeWidth={1.5} />
              {isOpen && (
                <span className="text-sm font-medium">{locale === 'ja' ? 'ログイン' : 'Login'}</span>
              )}
            </Link>
          )}

          {/* Language Toggle */}
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
