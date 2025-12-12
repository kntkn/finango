'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets, categories } from '@/data/assets';
import { ArrowRight, Heart, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { t, locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);

  const featuredAssets = assets.slice(0, 4);
  const trendingAssets = assets.slice(4, 8);

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
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">finango</h1>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-border)] text-sm font-medium"
          >
            <Globe size={14} />
            <span className="uppercase">{locale}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-8 pb-6 md:px-8 md:pt-16 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight md:leading-tight whitespace-pre-line">
            {t('home.title')}
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)] text-base md:text-lg max-w-md">
            {t('home.subtitle')}
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 mt-6 btn-primary"
          >
            <Sparkles size={18} />
            <span>{t('nav.discover')}</span>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-container pb-2">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/markets/${cat.id}`}
                className={`scroll-item chip card-interactive animate-slide-up opacity-0 stagger-${i + 1}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <span>{cat.icon}</span>
                <span>{locale === 'ja' ? cat.nameJa : cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--color-accent)]" />
              {t('home.featured')}
            </h3>
            <Link
              href="/discover"
              className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-1"
            >
              {t('home.viewAll')}
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile: Horizontal Scroll, PC: Grid */}
          <div className="scroll-container md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible">
            {featuredAssets.map((asset, i) => (
              <Link
                key={asset.id}
                href={`/asset/${asset.id}`}
                className={`scroll-item w-[280px] md:w-auto card card-interactive animate-scale-in opacity-0 overflow-hidden`}
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(e, asset.id)}
                    className={`absolute top-3 right-3 like-btn ${isLiked(asset.id) ? 'liked' : ''} ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                  >
                    <Heart size={18} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Category */}
                  <span className="absolute bottom-3 left-3 chip chip-accent text-xs">
                    {asset.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm line-clamp-1">{asset.name}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {asset.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="px-4 py-6 pb-8 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-[var(--color-secondary)]" />
              {t('home.trending')}
            </h3>
            <Link
              href="/markets"
              className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-1"
            >
              {t('home.viewAll')}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="scroll-container md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible">
            {trendingAssets.map((asset, i) => (
              <Link
                key={asset.id}
                href={`/asset/${asset.id}`}
                className={`scroll-item w-[200px] md:w-auto card card-interactive animate-scale-in opacity-0 overflow-hidden`}
                style={{ animationDelay: `${i * 0.1 + 0.2}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 200px, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(e, asset.id)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all ${isLiked(asset.id) ? 'text-red-500' : 'text-[var(--color-text-muted)]'} ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                  >
                    <Heart size={14} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="font-semibold text-white text-sm line-clamp-2">{asset.name}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
