import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetById, assets, getCategoryById } from '@/data/assets';
import AIInsights from '@/components/asset/AIInsights';
import { ChevronLeft, ExternalLink, Heart, Share2 } from 'lucide-react';

interface AssetPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { id } = await params;
  const asset = getAssetById(id);

  if (!asset) {
    notFound();
  }

  const category = getCategoryById(asset.categoryId);

  return (
    <div className="min-h-screen safe-top">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href={`/markets/${asset.categoryId}`}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white">
              <Heart size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />

        {/* Category Badge */}
        {category && (
          <div className="absolute bottom-6 left-4">
            <span
              className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.icon} {category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-4 relative z-10">
        {/* Title & Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight">{asset.name}</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            {asset.shortDescription}
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">The Story</h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {asset.story}
          </p>
        </div>

        {/* AI Insights */}
        <div className="mb-6">
          <AIInsights asset={asset} />
        </div>

        {/* Why This Asset */}
        <div className="mb-6 p-5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold mb-3">Why Consider This</h2>
          <ul className="space-y-2 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-accent)]">•</span>
              <span>Tangible real-world impact you can understand</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-accent)]">•</span>
              <span>Transparent project with clear objectives</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-accent)]">•</span>
              <span>Part of a curated selection from ANGO</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mb-8 space-y-3">
          <a
            href={asset.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2 w-full py-4 px-6
              bg-[var(--color-accent)] text-white rounded-2xl
              font-semibold text-base hover:opacity-90 transition-opacity
            "
          >
            <span>View on ANGO</span>
            <ExternalLink size={18} />
          </a>
          <p className="text-center text-xs text-[var(--color-text-muted)]">
            All transactions are processed securely on ango.jp
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return assets.map((asset) => ({
    id: asset.id,
  }));
}
