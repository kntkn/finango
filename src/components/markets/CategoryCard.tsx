'use client';

import Link from 'next/link';
import { Category } from '@/data/assets';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Link
      href={`/markets/${category.id}`}
      className={`
        block p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]
        card-hover animate-slide-up opacity-0
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${category.color}15` }}
          >
            {category.icon}
          </div>

          {/* Content */}
          <div>
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              {category.assetCount} assets
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
      <p className="text-sm text-[var(--color-text-secondary)] mt-3 pl-[74px]">
        {category.description}
      </p>
    </Link>
  );
}
