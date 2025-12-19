'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { assets } from '@/data/assets';
import { ArrowRight, Globe, LogIn } from 'lucide-react';

export default function Home() {
  const { locale, setLocale } = useI18n();
  const { isAuthenticated } = useAuth();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  // Create duplicated assets for infinite scroll effect
  const marqueeAssets = [...assets, ...assets, ...assets];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* ===== MOBILE VERSION ===== */}
      <div className="md:hidden fixed inset-0 flex flex-col">
        {/* Background Marquee */}
        <div className="absolute inset-0 overflow-hidden opacity-90">
          {/* Top Rows */}
          <div className="absolute top-0 left-0 right-0">
            <div className="flex gap-3 mb-3 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div key={`m-row1-${index}`} className="flex-shrink-0">
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={asset.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mb-3 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <div key={`m-row2-${index}`} className="flex-shrink-0">
                  <div className="relative w-36 h-28 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={asset.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Rows */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="flex gap-3 mb-3 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div key={`m-row3-${index}`} className="flex-shrink-0">
                  <div className="relative w-36 h-28 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={asset.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <div key={`m-row4-${index}`} className="flex-shrink-0">
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={asset.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          {/* White band behind text */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[280px] bg-white/95 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Logo */}
            <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">F</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-bold text-[var(--color-ink)] leading-tight tracking-tight mb-3">
              {locale === 'ja'
                ? '応援が、資産になる。'
                : 'Your Support Becomes an Asset.'}
            </h1>

            <p className="text-sm text-[var(--color-ink-muted)] mb-6 max-w-xs mx-auto">
              {locale === 'ja'
                ? '厳選されたRWAアセットを発見し、新しい投資体験を。'
                : 'Discover curated RWA assets and explore new investment experiences.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:bg-[var(--color-primary-dark)] transition-all"
                >
                  <span>{locale === 'ja' ? 'マーケットを見る' : 'View Markets'}</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:bg-[var(--color-primary-dark)] transition-all"
                >
                  <LogIn size={18} />
                  <span>{locale === 'ja' ? 'ログインして始める' : 'Log in to Start'}</span>
                </Link>
              )}
              <button
                onClick={toggleLocale}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                <Globe size={14} />
                <span className="text-sm">{locale === 'ja' ? 'English' : '日本語'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP VERSION ===== */}
      <div className="hidden md:block min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen">
          {/* Clean scrolling asset background */}
          <div className="absolute inset-0 overflow-hidden opacity-90">
            {/* Row 1 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div
                  key={`row1-${asset.id}-${index}`}
                  className="flex-shrink-0"
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
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <div
                  key={`row2-${asset.id}-${index}`}
                  className="flex-shrink-0"
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
                </div>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div
                  key={`row3-${asset.id}-${index}`}
                  className="flex-shrink-0"
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
                </div>
              ))}
            </div>

            {/* Row 4 */}
            <div className="flex gap-5 mb-5 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <div
                  key={`row4-${asset.id}-${index}`}
                  className="flex-shrink-0"
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
                </div>
              ))}
            </div>

            {/* Row 5 */}
            <div className="flex gap-5 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div
                  key={`row5-${asset.id}-${index}`}
                  className="flex-shrink-0"
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
                </div>
              ))}
            </div>
          </div>

          {/* Text area - clean white band */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[320px] bg-white/98 backdrop-blur-sm pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Main Headline - Large & Bold */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-ink)] leading-[1.1] tracking-tight">
                {locale === 'ja'
                  ? '応援が、資産になる。'
                  : 'Your Support Becomes an Asset.'}
              </h1>

              {/* CTA Button - Trust Blue */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                {isAuthenticated ? (
                  <>
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
                      <span className="text-base font-medium">{locale === 'ja' ? 'ポートフォリオを見る' : 'View Portfolio'}</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold shadow-sm hover:shadow-md hover:bg-[var(--color-primary-dark)] transition-all duration-200"
                  >
                    <LogIn size={18} />
                    <span>{locale === 'ja' ? 'ログインして始める' : 'Log in to Start'}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
