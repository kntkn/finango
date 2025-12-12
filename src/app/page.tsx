'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets, categories } from '@/data/assets';
import { ArrowRight, Heart, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { useState } from 'react';
import { SwipeStack } from '@/components/home/SwipeCard';

export default function Home() {
  const { t, locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);

  const featuredAssets = assets.slice(0, 4);
  const trendingAssets = assets.slice(4, 8);
  const allAssets = assets;

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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">finango</h1>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-border)] text-sm font-medium"
          >
            <Globe size={14} />
            <span className="uppercase">{locale}</span>
          </button>
        </div>
      </header>

      {/* Mobile: Swipe Experience */}
      <div className="md:hidden">
        {/* Hero - Compact for mobile swipe */}
        <section className="px-4 pt-6 pb-4">
          <h2 className="text-2xl font-bold leading-tight text-[var(--color-text)]">
            {t('home.title')}
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)] text-sm">
            {locale === 'ja'
              ? 'スワイプして気になる銘柄を探そう'
              : 'Swipe to discover assets you like'}
          </p>
        </section>

        {/* Category Pills */}
        <section className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/markets/${cat.id}`}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                <span className="mr-1">{cat.icon}</span>
                <span>{locale === 'ja' ? cat.nameJa : cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Swipe Stack */}
        <section className="px-4 pb-8">
          <SwipeStack assets={allAssets} />
        </section>
      </div>

      {/* Desktop: Grid Experience */}
      <div className="hidden md:block">
        {/* Hero Section */}
        <section className="px-8 pt-12 pb-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-[var(--color-text)]">
              {t('home.title')}
            </h2>
            <p className="mt-4 text-[var(--color-text-secondary)] text-lg max-w-lg">
              {t('home.subtitle')}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Sparkles size={18} />
              <span>{locale === 'ja' ? '銘柄を探す' : 'Explore Assets'}</span>
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/markets/${cat.id}`}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all hover:shadow-sm"
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  <span>{locale === 'ja' ? cat.nameJa : cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text)]">
                <Sparkles size={20} className="text-[var(--color-accent)]" />
                {t('home.featured')}
              </h3>
              <Link
                href="/search"
                className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-1 hover:underline"
              >
                {t('home.viewAll')}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredAssets.map((asset, i) => (
                <Link
                  key={asset.id}
                  href={`/asset/${asset.id}`}
                  className="group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(e, asset.id)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 ${
                        isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                      } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                    >
                      <Heart size={16} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                    </button>

                    {/* Category */}
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[var(--color-accent)] text-white rounded-full text-xs font-semibold">
                      {asset.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                      {asset.name}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2">
                      {asset.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="px-8 py-8 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text)]">
                <TrendingUp size={20} className="text-emerald-600" />
                {t('home.trending')}
              </h3>
              <Link
                href="/markets"
                className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-1 hover:underline"
              >
                {t('home.viewAll')}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingAssets.map((asset, i) => (
                <Link
                  key={asset.id}
                  href={`/asset/${asset.id}`}
                  className="group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(e, asset.id)}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 ${
                        isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                      } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                    >
                      <Heart size={14} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                        {asset.name}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
