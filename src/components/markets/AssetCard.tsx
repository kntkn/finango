'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Asset } from '@/data/assets';

interface AssetCardProps {
  asset: Asset;
  index: number;
}

export default function AssetCard({ asset, index }: AssetCardProps) {
  return (
    <Link
      href={`/asset/${asset.id}`}
      className={`
        block rounded-2xl bg-[var(--color-surface)] overflow-hidden
        border border-[var(--color-border)] card-hover
        animate-slide-up opacity-0
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-1">{asset.name}</h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
          {asset.shortDescription}
        </p>

        {/* Quick info */}
        <div className="flex items-center gap-2 mt-3">
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-medium
            ${asset.aiInsights.liquidity === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              asset.aiInsights.liquidity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
          `}>
            {asset.aiInsights.liquidity === 'high' ? 'High' :
             asset.aiInsights.liquidity === 'medium' ? 'Medium' : 'Low'} Liquidity
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {asset.aiInsights.projectType}
          </span>
        </div>
      </div>
    </Link>
  );
}
