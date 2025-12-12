'use client';

import Link from 'next/link';
import { Category, Asset } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import AssetCard from '@/components/markets/AssetCard';
import { ChevronLeft, Globe } from 'lucide-react';

interface CategoryDetailClientProps {
  category: Category;
  assets: Asset[];
}

export default function CategoryDetailClient({ category, assets }: CategoryDetailClientProps) {
  const { t, locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/markets"
              className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{locale === 'ja' ? category.nameJa : category.name}</span>
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                {assets.length} {t('markets.assets')}
              </p>
            </div>
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
          {/* Description */}
          <p className="text-[var(--color-text-secondary)] mb-6">
            {locale === 'ja' ? category.descriptionJa : category.description}
          </p>

          {/* Asset Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {assets.map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={index}
              />
            ))}
          </div>

          {/* Empty State */}
          {assets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)]">
                {locale === 'ja'
                  ? 'このカテゴリにはまだ資産がありません'
                  : 'No assets available in this category yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
