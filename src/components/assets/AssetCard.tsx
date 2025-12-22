'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Bookmark } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { Asset, getProjectById } from '@/data/projects';

interface AssetCardProps {
  asset: Asset;
  onSave?: (assetId: string) => void;
}

const categoryColors: Record<string, string> = {
  membership: 'bg-blue-100 text-blue-700',
  nft: 'bg-purple-100 text-purple-700',
  investment: 'bg-amber-100 text-amber-700',
  experience: 'bg-emerald-100 text-emerald-700',
};

const categoryLabels: Record<string, { en: string; ja: string }> = {
  membership: { en: 'Membership', ja: 'メンバーシップ' },
  nft: { en: 'NFT', ja: 'NFT' },
  investment: { en: 'Investment', ja: '投資' },
  experience: { en: 'Experience', ja: '体験' },
};

export default function AssetCard({ asset, onSave }: AssetCardProps) {
  const { locale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const project = getProjectById(asset.projectId);

  const liked = isLiked(asset.id);
  const soldPercent = Math.round((asset.sold / (asset.sold + asset.available)) * 100);
  const remaining = asset.available;
  const category = project?.category || 'nft';

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `¥${(price / 10000).toLocaleString()}万`;
    }
    return `¥${price.toLocaleString()}`;
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(asset.id);
    } else {
      toggleLike(asset.id);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-primary)]/30 transition-all duration-300">
      {/* Image Section */}
      <Link href={`/asset/${asset.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={asset.image}
            alt={locale === 'ja' ? asset.nameJa : asset.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${categoryColors[category]}`}>
              {locale === 'ja' ? categoryLabels[category].ja : categoryLabels[category].en}
            </span>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
          >
            {liked ? (
              <Heart size={18} className="text-red-500 fill-red-500" />
            ) : (
              <Bookmark size={18} className="text-[var(--color-ink-muted)]" />
            )}
          </button>

          {/* Sold Out Overlay */}
          {remaining === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-white rounded-lg font-bold text-[var(--color-ink)]">
                {locale === 'ja' ? '完売' : 'Sold Out'}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Project Name */}
        <p className="text-xs font-medium text-[var(--color-ink-muted)] mb-1 truncate">
          {locale === 'ja' ? project?.nameJa : project?.name}
        </p>

        {/* Asset Name */}
        <Link href={`/asset/${asset.id}`}>
          <h3 className="font-semibold text-[var(--color-ink)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {locale === 'ja' ? asset.nameJa : asset.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-xs text-[var(--color-ink-muted)]">
            {locale === 'ja' ? '価格' : 'from'}
          </span>
          <span className="text-lg font-bold text-[var(--color-ink)]">
            {formatPrice(asset.price)}
          </span>
          <span className="text-xs text-[var(--color-ink-muted)]">
            / {locale === 'ja' ? asset.unitJa : asset.unit}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-[var(--color-ink-secondary)]">
              {soldPercent}% {locale === 'ja' ? '販売済' : 'sold'}
            </span>
            <span className="text-xs text-[var(--color-ink-muted)]">
              {remaining} {locale === 'ja' ? '残り' : 'left'}
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                soldPercent >= 90
                  ? 'bg-red-500'
                  : soldPercent >= 70
                  ? 'bg-amber-500'
                  : 'bg-[var(--color-mint)]'
              }`}
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/asset/${asset.id}`}
          className="block w-full py-2.5 text-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-ink-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-200"
        >
          {locale === 'ja' ? '詳細を見る' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}
