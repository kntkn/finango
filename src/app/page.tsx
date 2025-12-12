'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets, categories } from '@/data/assets';
import { ArrowRight, Heart, Globe, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { SwipeStack } from '@/components/home/SwipeCard';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function Home() {
  const { t, locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);

  const featuredAssets = assets.slice(0, 6);
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
      {/* Mobile: Full-screen Swipe Experience - No vertical scroll */}
      <div className="md:hidden fixed inset-0 bottom-[72px] flex flex-col bg-black overflow-hidden">
        {/* Floating Header */}
        <header className="absolute top-0 left-0 right-0 z-50 px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white drop-shadow-lg">finango</h1>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white"
            >
              <Globe size={12} />
              <span className="uppercase">{locale}</span>
            </button>
          </div>
        </header>

        {/* Full-screen Swipe Stack */}
        <div className="flex-1 pt-16 pb-4 px-4">
          <SwipeStack assets={allAssets} />
        </div>
      </div>

      {/* Desktop: Grid Discovery Experience */}
      <div className="hidden md:block">
        {/* Hero Section - Clean Fintech Style */}
        <section className="px-8 pt-10 pb-8 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-[var(--color-accent)] mb-3">
              <Sparkles size={16} />
              <span className="text-sm font-semibold tracking-wide uppercase">
                {locale === 'ja' ? 'RWAキュレーション' : 'RWA Curation'}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] leading-tight">
              {locale === 'ja'
                ? '実物資産への\n新しい投資体験'
                : 'A New Way to\nInvest in Real Assets'}
            </h1>
            <p className="mt-4 text-[var(--color-text-secondary)] text-base max-w-lg leading-relaxed">
              {locale === 'ja'
                ? '厳選されたカーボンクレジット、ウイスキー樽、地域活性プロジェクトなど、多様な実物資産をご紹介します。'
                : 'Explore curated carbon credits, whisky casks, regional revitalization projects, and more diverse real-world assets.'}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <span>{locale === 'ja' ? 'マーケットを見る' : 'View Marketplace'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Categories - Card Style */}
        <section className="px-8 py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-5">
              {locale === 'ja' ? 'カテゴリ' : 'Categories'}
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/markets/${cat.id}`}
                  className="group p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <CategoryIcon icon={cat.icon} size={20} color={cat.color} />
                  </div>
                  <p className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {locale === 'ja' ? cat.nameJa : cat.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {cat.assetCount} {locale === 'ja' ? '銘柄' : 'assets'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Assets - Editorial Style */}
        <section className="px-8 py-8 bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                {locale === 'ja' ? '注目の銘柄' : 'Featured Assets'}
              </h2>
              <Link
                href="/search"
                className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-1 hover:underline"
              >
                {locale === 'ja' ? 'すべて見る' : 'View all'}
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Featured Grid - 2 large + 4 small */}
            <div className="grid grid-cols-3 gap-5">
              {/* Large Featured Cards */}
              {featuredAssets.slice(0, 2).map((asset) => (
                <Link
                  key={asset.id}
                  href={`/asset/${asset.id}`}
                  className="group col-span-1 bg-[var(--color-bg)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button
                      onClick={(e) => handleLike(e, asset.id)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 ${
                        isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                      } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                    >
                      <Heart size={16} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold text-[var(--color-text)]">
                        {asset.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2">
                      {asset.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}

              {/* Small Cards Grid */}
              <div className="col-span-1 grid grid-rows-2 gap-5">
                {featuredAssets.slice(2, 4).map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="group flex gap-3 p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-xs text-[var(--color-accent)] font-medium">
                        {asset.category}
                      </span>
                      <h3 className="font-semibold text-sm text-[var(--color-text)] line-clamp-2 mt-0.5 group-hover:text-[var(--color-accent)] transition-colors">
                        {asset.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Fintech Trust Building */}
        <section className="px-8 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-4 gap-6">
              {[
                { value: '¥2.5B+', labelEn: 'Total Volume', labelJa: '総取引額' },
                { value: '10,000+', labelEn: 'Users', labelJa: 'ユーザー数' },
                { value: '50+', labelEn: 'Listed Assets', labelJa: '掲載銘柄数' },
                { value: '99.9%', labelEn: 'Uptime', labelJa: '稼働率' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    {locale === 'ja' ? stat.labelJa : stat.labelEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
