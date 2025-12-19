'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { getAssetsByCategory, getCategoryById, categories } from '@/data/assets';
import { ChevronLeft, Globe, Heart, Store, TrendingUp, TrendingDown, ExternalLink, Filter } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

interface MarketPageProps {
  params: Promise<{ category: string }>;
}

export default function SecondaryMarketPage({ params }: MarketPageProps) {
  const { category: categoryId } = use(params);
  const { locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [sortBy, setSortBy] = useState<'name' | 'liquidity'>('name');
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);

  const category = getCategoryById(categoryId);
  const assets = getAssetsByCategory(categoryId);

  // Sort assets
  const sortedAssets = useMemo(() => {
    const sorted = [...assets];
    if (sortBy === 'liquidity') {
      const liquidityOrder = { high: 0, medium: 1, low: 2 };
      sorted.sort((a, b) => liquidityOrder[a.aiInsights.liquidity] - liquidityOrder[b.aiInsights.liquidity]);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [assets, sortBy]);

  const handleLike = (e: React.MouseEvent, assetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(assetId);
    setLikeAnimation(assetId);
    setTimeout(() => setLikeAnimation(null), 400);
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const getLiquidityLabel = (liquidity: 'high' | 'medium' | 'low') => {
    const labels = {
      high: { en: 'High', ja: '高' },
      medium: { en: 'Medium', ja: '中' },
      low: { en: 'Low', ja: '低' },
    };
    return labels[liquidity][locale];
  };

  // Mock market data
  const getMarketData = (assetId: string) => {
    // Generate pseudo-random but consistent data based on assetId
    const hash = assetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const change = ((hash % 20) - 10) / 10; // -1.0 to 1.0
    const volume = (hash % 50) + 10; // 10-59
    return {
      change: change * 10, // -10% to +10%
      volume,
    };
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <p className="text-[var(--color-text-muted)]">
          {locale === 'ja' ? 'カテゴリが見つかりません' : 'Category not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-3 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/portfolio"
              className="w-11 h-11 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
            >
              <ChevronLeft size={18} />
            </Link>
            {/* Mobile: Show Finango logo */}
            <h1 className="md:hidden text-xl font-black text-[var(--color-primary)]">finango</h1>
            {/* Desktop: Show page title */}
            <div className="hidden md:block">
              <h1 className="text-base font-bold flex items-center gap-2 text-[var(--color-text)]">
                <Store size={18} className="text-emerald-600" />
                <span>{locale === 'ja' ? '二次流通マーケット' : 'Secondary Market'}</span>
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5">
                <CategoryIcon icon={category.icon} size={14} color={category.color} />
                <span>{locale === 'ja' ? category.nameJa : category.name}</span>
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

      <div className="px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Market Overview */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-3 text-[var(--color-text)]">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <CategoryIcon icon={category.icon} size={20} color={category.color} />
                </div>
                <span>{locale === 'ja' ? category.nameJa : category.name}</span>
              </h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                {locale === 'ja' ? '取引可能' : 'Trading Active'}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {locale === 'ja' ? category.descriptionJa : category.description}
            </p>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center gap-6">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {locale === 'ja' ? '掲載数' : 'Listed'}
                </p>
                <p className="text-lg font-bold text-[var(--color-text)]">{assets.length}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {locale === 'ja' ? '24h 取引量' : '24h Volume'}
                </p>
                <p className="text-lg font-bold text-[var(--color-text)]">
                  {assets.length * 12}
                </p>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-[var(--color-text-muted)]" />
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'name'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {locale === 'ja' ? '名前順' : 'By Name'}
            </button>
            <button
              onClick={() => setSortBy('liquidity')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'liquidity'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {locale === 'ja' ? '流動性順' : 'By Liquidity'}
            </button>
          </div>

          {/* Assets List */}
          <div className="space-y-3">
            {sortedAssets.map((asset) => {
              const marketData = getMarketData(asset.id);
              const isPositive = marketData.change >= 0;

              return (
                <div
                  key={asset.id}
                  className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
                >
                  <Link
                    href={`/asset/${asset.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg)] transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-[var(--color-text)] truncate">
                        {asset.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`
                          px-2 py-0.5 rounded-full text-sm font-semibold
                          ${asset.aiInsights.liquidity === 'high' ? 'bg-emerald-100 text-emerald-700' :
                            asset.aiInsights.liquidity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'}
                        `}>
                          {locale === 'ja' ? '流動性' : 'Liq'}: {getLiquidityLabel(asset.aiInsights.liquidity)}
                        </span>
                      </div>
                    </div>

                    {/* Market Data */}
                    <div className="text-right flex-shrink-0">
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="text-sm font-bold">
                          {isPositive ? '+' : ''}{marketData.change.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                        Vol: {marketData.volume}
                      </p>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(e, asset.id)}
                      className={`w-11 h-11 rounded-full bg-[var(--color-bg)] flex items-center justify-center transition-all hover:scale-110 ${
                        isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                      } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                    >
                      <Heart size={16} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                    </button>
                  </Link>

                  {/* Trade Button */}
                  <div className="px-4 pb-3 flex gap-2">
                    <a
                      href={asset.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <span>{locale === 'ja' ? '取引する' : 'Trade'}</span>
                      <ExternalLink size={14} />
                    </a>
                    <Link
                      href={`/asset/${asset.id}`}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-bg)] text-[var(--color-text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
                    >
                      {locale === 'ja' ? '詳細' : 'Details'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {assets.length === 0 && (
            <div className="text-center py-12">
              <Store size={48} className="mx-auto text-[var(--color-border)] mb-4" />
              <p className="text-[var(--color-text-muted)]">
                {locale === 'ja'
                  ? 'このカテゴリにはまだ銘柄がありません'
                  : 'No assets available in this category yet'}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              {locale === 'ja'
                ? '※ 二次流通での売買は外部プラットフォームで行われます。取引にはリスクが伴います。'
                : '※ Secondary market trades are conducted on external platforms. Trading involves risks.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
