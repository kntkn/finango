import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryById, getAssetsByCategory } from '@/data/assets';
import AssetCard from '@/components/markets/AssetCard';
import { ChevronLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const assets = getAssetsByCategory(categoryId);

  return (
    <div className="min-h-screen safe-top">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/markets"
            className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              {assets.length} assets available
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Description */}
        <p className="text-[var(--color-text-secondary)] mb-6">
          {category.description}
        </p>

        {/* Asset Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
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
              No assets available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { categories } = await import('@/data/assets');
  return categories.map((category) => ({
    category: category.id,
  }));
}
