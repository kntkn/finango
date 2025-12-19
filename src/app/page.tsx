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
        {/* Hero Section - Full Screen with Asset Background */}
        <section className="relative min-h-screen">
          {/* Full-screen scrolling asset background - Clear, no opacity */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Row 1 */}
            <div className="flex gap-4 mb-4 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <Link
                  key={`row1-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-64 h-40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-4 mb-4 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <Link
                  key={`row2-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-72 h-44 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="288px"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex gap-4 mb-4 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <Link
                  key={`row3-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-60 h-36 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 4 */}
            <div className="flex gap-4 mb-4 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <Link
                  key={`row4-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-64 h-40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 5 */}
            <div className="flex gap-4 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <Link
                  key={`row5-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-72 h-44 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="288px"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Text area white band - only in the middle */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[280px] bg-white/95 backdrop-blur-sm pointer-events-none" />

          {/* Hero Content - Centered */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Main Concept */}
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-text)] leading-[1.1] tracking-tight whitespace-pre-line">
                {locale === 'ja'
                  ? '応援が、資産になる。'
                  : 'Your Support\nBecomes an Asset'}
              </h1>

              {/* CTA Button - Fun & Creative */}
              <Link
                href="/search"
                className="group inline-flex items-center gap-3 mt-10 px-8 py-4 bg-[var(--color-primary)] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-[var(--ease-out-expo)]"
              >
                <span className="text-xl">✨</span>
                <span>{locale === 'ja' ? '推しを見つける' : 'Find Your Favorites'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
