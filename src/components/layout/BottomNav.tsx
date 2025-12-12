'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, PieChart } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/markets', icon: LayoutGrid, label: 'Markets' },
  { href: '/portfolio', icon: PieChart, label: 'Portfolio' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom">
      <div className="max-w-lg mx-auto px-6 py-3">
        <div className="flex items-center justify-around">
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
                  flex flex-col items-center justify-center
                  w-16 h-12 rounded-2xl transition-all duration-300
                  ${isActive
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }
                `}
                aria-label={item.label}
              >
                <item.icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all duration-300"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
