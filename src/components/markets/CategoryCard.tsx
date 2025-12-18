'use client';

import Link from 'next/link';
import { Category } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import { ArrowUpRight } from 'lucide-react';
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
      className={`group block p-5 md:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-transparent hover:shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-out-expo)] stagger-${Math.min(index + 1, 8)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Icon with gradient background */}
          <div
            className="relative w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${category.color}12` }}
          >
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg, ${category.color}20 0%, transparent 100%)` }}
            />
            <CategoryIcon icon={category.icon} size={24} color={category.color} />
          </div>

          {/* Content */}
          <div>
            <h3 className="font-display font-semibold text-lg text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
              {locale === 'ja' ? category.nameJa : category.name}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.assetCount} {t('markets.assets')}
            </p>
          </div>
        </div>

        {/* Arrow with animation */}
        <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-all duration-300">
          <ArrowUpRight
            size={16}
            className="text-[var(--color-text-muted)] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
          />
        </div>
      </div>

      {/* Description with fade in */}
      <p className="text-sm text-[var(--color-text-secondary)] mt-4 md:pl-[74px] leading-relaxed line-clamp-2">
        {locale === 'ja' ? category.descriptionJa : category.description}
      </p>
    </Link>
  );
}
