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
      <div className="md:hidden fixed inset-0 bottom-[72px] flex flex-col bg-[var(--color-bg)] overflow-hidden">
        {/* Header - Premium Glass Style */}
        <header className="px-5 pt-4 pb-3 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold text-[var(--color-primary)] tracking-tight">finango</h1>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-bg)] text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors duration-300"
            >
              <Globe size={12} />
              <span className="uppercase tracking-wide">{locale}</span>
            </button>
          </div>
        </header>

        {/* Full-screen Swipe Stack */}
        <div className="flex-1 py-4 px-4">
          <SwipeStack assets={allAssets} />
        </div>
      </div>

      {/* Desktop: Grid Discovery Experience */}
      <div className="hidden md:block">
        {/* Hero Section - Premium Editorial Style */}
        <section className="px-8 pt-12 pb-10 bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-bg)] to-[var(--color-bg)]">
          <div className="max-w-5xl mx-auto">
            {/* Accent badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/8 text-[var(--color-accent)] mb-6 stagger-1">
              <Sparkles size={14} />
              <span className="text-xs font-semibold tracking-widest uppercase">
                {locale === 'ja' ? 'RWAキュレーション' : 'RWA Curation'}
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-text)] leading-[1.15] tracking-tight stagger-2 whitespace-pre-line">
              {locale === 'ja'
                ? '実物資産への\n新しい投資体験'
                : 'A New Way to\nInvest in Real Assets'}
            </h1>
            <p className="mt-5 text-[var(--color-text-secondary)] text-base max-w-lg leading-relaxed stagger-3">
              {locale === 'ja'
                ? '厳選されたカーボンクレジット、ウイスキー樽、地域活性プロジェクトなど、多様な実物資産をご紹介します。'
                : 'Explore curated carbon credits, whisky casks, regional revitalization projects, and more diverse real-world assets.'}
            </p>

            {/* Premium CTA button */}
            <Link
              href="/search"
              className="group inline-flex items-center gap-2.5 mt-8 px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300 ease-[var(--ease-out-expo)] stagger-4"
            >
              <span>{locale === 'ja' ? 'マーケットを見る' : 'View Marketplace'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>

        {/* Categories - Premium Card Style */}
        <section className="px-8 py-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
              {locale === 'ja' ? 'カテゴリ' : 'Categories'}
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/markets/${cat.id}`}
                  className={`group p-5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] hover:border-transparent hover:shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-out-expo)] stagger-${index + 1}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden"
                    style={{ backgroundColor: `${cat.color}12` }}
                  >
                    {/* Hover gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${cat.color}20 0%, transparent 100%)` }}
                    />
                    <CategoryIcon icon={cat.icon} size={20} color={cat.color} />
                  </div>
                  <p className="font-display font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                    {locale === 'ja' ? cat.nameJa : cat.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.assetCount} {locale === 'ja' ? '銘柄' : 'assets'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Assets - Premium Editorial Style */}
        <section className="px-8 py-10 bg-[var(--color-surface)]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[var(--color-text)] tracking-tight">
                {locale === 'ja' ? '注目の銘柄' : 'Featured Assets'}
              </h2>
              <Link
                href="/search"
                className="group text-sm text-[var(--color-accent)] font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300"
              >
                {locale === 'ja' ? 'すべて見る' : 'View all'}
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>

            {/* Featured Grid - 2 large + 4 small */}
            <div className="grid grid-cols-3 gap-5">
              {/* Large Featured Cards */}
              {featuredAssets.slice(0, 2).map((asset, index) => (
                <Link
                  key={asset.id}
                  href={`/asset/${asset.id}`}
                  className={`group col-span-1 bg-[var(--color-bg)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-transparent hover:shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-out-expo)] stagger-${index + 1}`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-out-expo)]"
                      sizes="33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                    <button
                      onClick={(e) => handleLike(e, asset.id)}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm ${
                        isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                      } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                    >
                      <Heart size={18} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-xs font-semibold text-[var(--color-text)]">
                        {asset.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2 leading-relaxed">
                      {asset.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}

              {/* Small Cards Grid */}
              <div className="col-span-1 grid grid-rows-2 gap-5">
                {featuredAssets.slice(2, 4).map((asset, index) => (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className={`group flex gap-4 p-4 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] hover:border-transparent hover:shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-out-expo)] stagger-${index + 3}`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-xs text-[var(--color-accent)] font-semibold tracking-wide">
                        {asset.category}
                      </span>
                      <h3 className="font-display font-semibold text-sm text-[var(--color-text)] line-clamp-2 mt-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {asset.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Premium Trust Building */}
        <section className="px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-4 gap-6">
              {[
                { value: '¥2.5B+', labelEn: 'Total Volume', labelJa: '総取引額' },
                { value: '10,000+', labelEn: 'Users', labelJa: 'ユーザー数' },
                { value: '50+', labelEn: 'Listed Assets', labelJa: '掲載銘柄数' },
                { value: '99.9%', labelEn: 'Uptime', labelJa: '稼働率' },
              ].map((stat, i) => (
                <div key={i} className={`text-center p-4 rounded-2xl bg-[var(--color-surface)]/50 stagger-${i + 1}`}>
                  <p className="font-display text-3xl font-bold text-[var(--color-text)] tracking-tight">{stat.value}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-2">
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
