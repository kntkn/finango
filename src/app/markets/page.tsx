'use client';

import { categories } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import CategoryCard from '@/components/markets/CategoryCard';
import { Globe, LayoutGrid, Flag } from 'lucide-react';

export default function MarketsPage() {
  const { t, locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header - Clean Museum Style */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-[var(--color-border)] px-4 py-3 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Mobile: Show Finango logo */}
          <h1 className="md:hidden text-xl font-bold text-[var(--color-primary)] tracking-tight">finango</h1>
          {/* Desktop: Show page title */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-bg)] flex items-center justify-center">
              <LayoutGrid size={18} className="text-[var(--color-primary)]" />
            </div>
            <h1 className="text-lg font-semibold text-[var(--color-ink)]">{t('markets.title')}</h1>
          </div>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-subtle)] text-sm font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-border)] transition-colors duration-200"
          >
            <Globe size={14} />
            <span className="uppercase text-xs tracking-wide">{locale}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header with Badge */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Flag size={14} className="text-[var(--color-mint-dark)]" />
              <span className="text-sm font-semibold text-[var(--color-mint-dark)]">
                {locale === 'ja' ? 'カテゴリから探す' : 'Browse by Category'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight">{t('markets.explore')}</h2>
            <p className="text-base text-[var(--color-ink-secondary)] mt-2 leading-relaxed">
              {locale === 'ja' ? '厳選された現実資産（RWA）のコレクション' : 'Curated collections of real-world assets'}
            </p>
          </div>

          {/* Category Grid - Gallery style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
