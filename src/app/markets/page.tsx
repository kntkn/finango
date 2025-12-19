'use client';

import { categories } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import CategoryCard from '@/components/markets/CategoryCard';
import { Globe, LayoutGrid } from 'lucide-react';

export default function MarketsPage() {
  const { t, locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header - Premium Glass Style */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)] px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Mobile: Show Finango logo */}
          <h1 className="md:hidden font-display text-xl font-bold text-[var(--color-primary)] tracking-tight">finango</h1>
          {/* Desktop: Show page title */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <LayoutGrid size={18} className="text-[var(--color-accent)]" />
            </div>
            <h1 className="font-display text-xl font-bold text-[var(--color-text)] tracking-tight">{t('markets.title')}</h1>
          </div>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-bg)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors duration-300"
          >
            <Globe size={12} />
            <span className="uppercase tracking-wide">{locale}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 stagger-1">
            <h2 className="font-display text-2xl font-bold text-[var(--color-text)] tracking-tight">{t('markets.explore')}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
              {locale === 'ja' ? '厳選された実物資産のコレクション' : 'Curated collections of real-world assets'}
            </p>
          </div>

          {/* Category Grid - Mobile: List, Desktop: Grid */}
          <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:space-y-0">
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
