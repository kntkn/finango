'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { assets } from '@/data/assets';
import { ArrowRight, Globe, Flag, CheckCircle2 } from 'lucide-react';
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
        {/* Header - Clean Museum Style */}
        <header className="px-5 pt-4 pb-3 bg-white/95 backdrop-blur-lg border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--color-primary)] tracking-tight">finango</h1>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-subtle)] text-sm font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-border)] transition-colors duration-200"
            >
              <Globe size={14} />
              <span className="uppercase text-xs tracking-wide">{locale}</span>
            </button>
          </div>
        </header>

        {/* Full-screen Swipe Stack */}
        <div className="flex-1 py-4 px-4">
          <SwipeStack assets={allAssets} />
        </div>
      </div>

      {/* Desktop: Museum-style LP */}
      <div className="hidden md:block min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen">
          {/* Clean scrolling asset background */}
          <div className="absolute inset-0 overflow-hidden opacity-90">
            {/* Row 1 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <Link
                  key={`row1-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-56 h-36 rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="224px"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <Link
                  key={`row2-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-64 h-40 rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300">
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

            {/* Row 3 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <Link
                  key={`row3-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-52 h-32 rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="208px"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 4 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <Link
                  key={`row4-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-60 h-36 rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300">
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

            {/* Row 5 */}
            <div className="flex gap-5 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <Link
                  key={`row5-${asset.id}-${index}`}
                  href={`/asset/${asset.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="relative w-64 h-40 rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300">
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
          </div>

          {/* Text area - clean white band */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[320px] bg-white/98 backdrop-blur-sm pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge - Playful Professional */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--color-mint-bg)] border border-[var(--color-mint)]/20">
                <Flag size={14} className="text-[var(--color-mint-dark)]" />
                <span className="text-sm font-semibold text-[var(--color-mint-dark)]">
                  {locale === 'ja' ? 'RWAマーケットプレイス' : 'RWA Marketplace'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-ink)] leading-[1.15] tracking-tight">
                {locale === 'ja'
                  ? '応援が、資産になる。'
                  : 'Your Support Becomes an Asset.'}
              </h1>

              {/* Sub copy - 信頼層 */}
              <p className="mt-5 text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-xl mx-auto">
                {locale === 'ja'
                  ? '厳選された現実資産（RWA）を、シンプルに保有・売買できるマーケットプレイス。'
                  : 'A marketplace where you can simply hold and trade curated real-world assets.'}
              </p>

              {/* CTA Button - Trust Blue */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/search"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold shadow-sm hover:shadow-md hover:bg-[var(--color-primary-dark)] transition-all duration-200"
                >
                  <span>{locale === 'ja' ? 'マーケットを見る' : 'View Markets'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors duration-200"
                >
                  <CheckCircle2 size={16} />
                  <span className="text-base font-medium">{locale === 'ja' ? 'ポートフォリオを見る' : 'View Portfolio'}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
