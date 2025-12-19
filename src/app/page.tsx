'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { assets } from '@/data/assets';
import { ArrowRight, Globe } from 'lucide-react';
import { SwipeStack } from '@/components/home/SwipeCard';

export default function Home() {
  const { locale, setLocale } = useI18n();

  const allAssets = assets;

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  // Create duplicated assets for infinite scroll effect
  const marqueeAssets = [...assets, ...assets, ...assets];

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-bg)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors duration-300"
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

      {/* Desktop: LP Style Hero */}
      <div className="hidden md:block min-h-screen overflow-hidden">
        {/* Hero Section - Full Screen LP Style */}
        <section className="relative min-h-screen flex flex-col">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-bg)] to-[var(--color-bg)]" />

          {/* Hero Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Main Concept */}
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-text)] leading-[1.1] tracking-tight">
                {locale === 'ja'
                  ? '「好き」で溢れた\nポートフォリオ'
                  : 'A Portfolio\nFull of What You Love'}
              </h1>

              <p className="mt-6 text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
                {locale === 'ja'
                  ? 'ウイスキー、アート、不動産、カーボンクレジット。あなたの「好き」を資産に。'
                  : 'Whisky, art, real estate, carbon credits. Turn your passions into assets.'}
              </p>

              {/* CTA Button */}
              <Link
                href="/search"
                className="group inline-flex items-center gap-3 mt-10 px-8 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 ease-[var(--ease-out-expo)]"
              >
                <span>{locale === 'ja' ? 'マーケットを見る' : 'View Marketplace'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Infinite Scrolling Asset Grid */}
          <div className="relative z-10 w-full overflow-hidden pb-8">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />

            {/* Row 1 - Scrolling Left */}
            <div className="flex gap-4 mb-4 animate-marquee-left">
              {marqueeAssets.map((asset, index) => (
                <Link
                  key={`row1-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-48 h-32 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="192px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 - Scrolling Right */}
            <div className="flex gap-4 animate-marquee-right">
              {[...marqueeAssets].reverse().map((asset, index) => (
                <Link
                  key={`row2-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-48 h-32 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="192px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium truncate">{asset.name}</p>
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
