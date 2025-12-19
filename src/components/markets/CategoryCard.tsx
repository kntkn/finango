'use client';

import Link from 'next/link';
import { Category } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import { ArrowRight, CheckCircle } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const { t, locale } = useI18n();

  return (
    <Link
      href={`/markets/${category.id}`}
      className="group block p-5 rounded-xl bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}10` }}
        >
          <CategoryIcon icon={category.icon} size={22} color={category.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors duration-200">
            {locale === 'ja' ? category.nameJa : category.name}
          </h3>
          <p className="text-sm text-[var(--color-ink-muted)] mt-1 line-clamp-2 leading-relaxed">
            {locale === 'ja' ? category.descriptionJa : category.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--color-mint-bg)] text-[var(--color-mint-dark)] text-xs font-semibold">
              <CheckCircle size={10} />
              {category.assetCount} {t('markets.assets')}
            </span>
            <span className="text-xs text-[var(--color-ink-muted)] group-hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center gap-1">
              {locale === 'ja' ? '詳細を見る' : 'View details'}
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
