'use client';

import Link from 'next/link';
import { Category } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import { ChevronRight } from 'lucide-react';
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
      className="block p-5 card card-hover animate-slide-up opacity-0"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <CategoryIcon icon={category.icon} size={24} color={category.color} />
          </div>

          {/* Content */}
          <div>
            <h3 className="font-semibold text-lg">
              {locale === 'ja' ? category.nameJa : category.name}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              {category.assetCount} {t('markets.assets')}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={20}
          className="text-[var(--color-text-muted)]"
        />
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--color-text-secondary)] mt-3 md:pl-[74px]">
        {locale === 'ja' ? category.descriptionJa : category.description}
      </p>
    </Link>
  );
}
