'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Asset } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface AssetCardProps {
  asset: Asset;
  index: number;
}

export default function AssetCard({ asset, index }: AssetCardProps) {
  const { locale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(asset.id);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 400);
  };

  const getLiquidityLabel = () => {
    const labels = {
      high: { en: 'High', ja: '高' },
      medium: { en: 'Medium', ja: '中' },
      low: { en: 'Low', ja: '低' },
    };
    return labels[asset.aiInsights.liquidity][locale];
  };

  const getProjectTypeLabel = () => {
    const map: Record<string, { en: string; ja: string }> = {
      'Long-term': { en: 'Long-term', ja: '長期' },
      'Mid-term': { en: 'Mid-term', ja: '中期' },
      'Short-term': { en: 'Short-term', ja: '短期' },
    };
    return map[asset.aiInsights.projectType]?.[locale] || asset.aiInsights.projectType;
  };

  return (
    <Link
      href={`/asset/${asset.id}`}
      className="block card card-hover animate-slide-up opacity-0 overflow-hidden"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-2 right-2 like-btn ${isLiked(asset.id) ? 'liked' : ''} ${likeAnimation ? 'animate-heart-pop' : ''}`}
        >
          <Heart size={16} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
          {asset.shortDescription}
        </p>

        {/* Quick info */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`
            px-2 py-0.5 rounded-full text-sm font-medium
            ${asset.aiInsights.liquidity === 'high' ? 'bg-green-100 text-green-700' :
              asset.aiInsights.liquidity === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'}
          `}>
            {getLiquidityLabel()}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            {getProjectTypeLabel()}
          </span>
        </div>
      </div>
    </Link>
  );
}
