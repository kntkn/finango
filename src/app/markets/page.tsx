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
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-[var(--color-accent)]" />
            <h1 className="text-xl font-bold">{t('markets.title')}</h1>
          </div>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-border)] text-sm font-medium"
          >
            <Globe size={14} />
            <span className="uppercase">{locale}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{t('markets.explore')}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {locale === 'ja' ? '厳選された実物資産のコレクション' : 'Curated collections of real-world assets'}
            </p>
          </div>

          {/* Category Grid - Mobile: List, Desktop: Grid */}
          <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
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
