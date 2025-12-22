'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { assets, getProjectById } from '@/data/projects';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Shield,
  TrendingUp,
  LogIn,
  ArrowRight,
  X,
  ExternalLink,
  Heart,
  Flame
} from 'lucide-react';

// Onboarding steps data (for non-authenticated users)
const onboardingSteps = [
  {
    id: 1,
    icon: Sparkles,
    color: '#FFD34E',
    titleJa: '好きなものに投資',
    titleEn: 'Invest in What You Love',
    descJa: 'ウイスキー、古民家、映画セット...\nあなたの「好き」が資産になる',
    descEn: 'Whisky, heritage homes, movie sets...\nYour passion becomes your asset',
  },
  {
    id: 2,
    icon: Shield,
    color: '#2EE6A6',
    titleJa: '厳選されたプロジェクト',
    titleEn: 'Curated Projects',
    descJa: '専門チームが審査した\n信頼できるRWAプロジェクトのみ',
    descEn: 'Only trusted RWA projects\nvetted by our expert team',
  },
  {
    id: 3,
    icon: TrendingUp,
    color: '#1F4BFF',
    titleJa: '簡単に始められる',
    titleEn: 'Easy to Get Started',
    descJa: '無料で登録して\n今すぐ資産形成を始めよう',
    descEn: 'Sign up for free\nand start building wealth today',
  },
];

// Featured assets for Stories (popular/trending)
const getFeaturedAssets = () => {
  // Sort by sold percentage and get top 8
  return [...assets]
    .map(asset => ({
      ...asset,
      soldPercent: asset.sold / (asset.sold + asset.available)
    }))
    .sort((a, b) => b.soldPercent - a.soldPercent)
    .slice(0, 8);
};

// ==========================================
// STORIES COMPONENT (Instagram-style)
// ==========================================
function StoriesSection({ locale }: { locale: 'ja' | 'en' }) {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const featuredAssets = getFeaturedAssets();

  // Auto-progress story
  useEffect(() => {
    if (activeStory === null) return;

    setStoryProgress(0);
    const progressInterval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          // Move to next story
          if (activeStory < featuredAssets.length - 1) {
            setActiveStory(activeStory + 1);
            return 0;
          } else {
            setActiveStory(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [activeStory, featuredAssets.length]);

  const openStory = (index: number) => {
    setActiveStory(index);
    setStoryProgress(0);
  };

  const closeStory = () => {
    setActiveStory(null);
    setStoryProgress(0);
  };

  const nextStory = () => {
    if (activeStory !== null && activeStory < featuredAssets.length - 1) {
      setActiveStory(activeStory + 1);
      setStoryProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStory !== null && activeStory > 0) {
      setActiveStory(activeStory - 1);
      setStoryProgress(0);
    }
  };

  return (
    <>
      {/* Stories Thumbnails */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-[var(--color-ink)]">
            {locale === 'ja' ? '注目のRWA' : 'Trending RWA'}
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {featuredAssets.map((asset, index) => {
            const project = getProjectById(asset.projectId);
            return (
              <button
                key={asset.id}
                onClick={() => openStory(index)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                {/* Gradient Ring */}
                <div
                  className="p-[3px] rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${project?.color || '#1F4BFF'}, #ec4899, #f59e0b)`
                  }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                    <div className="relative w-full h-full">
                      <Image
                        src={asset.image}
                        alt={locale === 'ja' ? asset.nameJa : asset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                {/* Label */}
                <span className="text-[10px] text-[var(--color-ink-secondary)] font-medium max-w-[70px] truncate">
                  {locale === 'ja' ? project?.nameJa : project?.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Story Modal */}
      <AnimatePresence>
        {activeStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black"
          >
            {(() => {
              const asset = featuredAssets[activeStory];
              const project = getProjectById(asset.projectId);
              const soldPercent = Math.round((asset.sold / (asset.sold + asset.available)) * 100);

              return (
                <div className="relative w-full h-full">
                  {/* Progress Bars */}
                  <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-[max(8px,env(safe-area-inset-top))]">
                    {featuredAssets.map((_, index) => (
                      <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-100"
                          style={{
                            width: index < activeStory ? '100%' : index === activeStory ? `${storyProgress}%` : '0%'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 z-20 pt-[max(16px,calc(env(safe-area-inset-top)+8px))] px-4 pb-4">
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: project?.color }}
                        >
                          {(project?.name || 'P')[0]}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {locale === 'ja' ? project?.nameJa : project?.name}
                          </p>
                          <p className="text-white/60 text-xs">
                            {soldPercent}% {locale === 'ja' ? '販売済' : 'sold'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeStory}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={asset.image}
                      alt={locale === 'ja' ? asset.nameJa : asset.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                  </div>

                  {/* Touch Areas for Navigation */}
                  <div className="absolute inset-0 flex z-10">
                    <button
                      onClick={prevStory}
                      className="w-1/3 h-full"
                      aria-label="Previous story"
                    />
                    <div className="w-1/3 h-full" />
                    <button
                      onClick={nextStory}
                      className="w-1/3 h-full"
                      aria-label="Next story"
                    />
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-[max(24px,calc(env(safe-area-inset-bottom)+16px))]">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4">
                      <h3 className="font-bold text-[var(--color-ink)] text-lg mb-1">
                        {locale === 'ja' ? asset.nameJa : asset.name}
                      </h3>
                      <p className="text-sm text-[var(--color-ink-secondary)] mb-3 line-clamp-2">
                        {locale === 'ja' ? asset.descriptionJa : asset.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs text-[var(--color-ink-muted)]">
                            {locale === 'ja' ? '価格' : 'Price'}
                          </span>
                          <p className="text-lg font-bold text-[var(--color-ink)]">
                            ¥{asset.price.toLocaleString()}
                            <span className="text-xs font-normal text-[var(--color-ink-muted)] ml-1">
                              / {locale === 'ja' ? asset.unitJa : asset.unit}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[var(--color-ink-muted)]">
                            {locale === 'ja' ? '残り' : 'Left'}
                          </span>
                          <p className="text-lg font-bold text-[var(--color-primary)]">
                            {asset.available}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/asset/${asset.id}`}
                        onClick={closeStory}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold"
                      >
                        <span>{locale === 'ja' ? '詳細を見る' : 'View Details'}</span>
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// MAIN HOME COMPONENT
// ==========================================
export default function Home() {
  const { locale, setLocale } = useI18n();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel (for non-authenticated)
  useEffect(() => {
    if (!isAutoPlaying || isAuthenticated) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % onboardingSteps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isAuthenticated]);

  const nextStep = () => {
    setIsAutoPlaying(false);
    setCurrentStep((prev) => (prev + 1) % onboardingSteps.length);
  };

  const prevStep = () => {
    setIsAutoPlaying(false);
    setCurrentStep((prev) => (prev - 1 + onboardingSteps.length) % onboardingSteps.length);
  };

  const goToStep = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentStep(index);
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  // Create duplicated assets for infinite scroll effect
  const marqueeAssets = [...assets, ...assets, ...assets];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">F</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED USER VIEW
  // ==========================================
  if (isAuthenticated) {
    // Get recent/popular assets for the main feed
    const popularAssets = [...assets]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);

    return (
      <div className="min-h-screen bg-[var(--color-bg)] pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)]">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-lg font-bold text-[var(--color-primary)]">finango</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleLocale} className="text-sm text-[var(--color-ink-muted)]">
                {locale === 'ja' ? 'EN' : 'JA'}
              </button>
              <Link href="/portfolio" className="text-sm font-medium text-[var(--color-primary)]">
                {locale === 'ja' ? 'マイページ' : 'My Page'}
              </Link>
            </div>
          </div>
        </header>

        {/* Welcome Message */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[var(--color-ink-muted)] text-sm">
            {locale === 'ja' ? 'おかえりなさい' : 'Welcome back'},
          </p>
          <h2 className="text-xl font-bold text-[var(--color-ink)]">
            {user?.name || 'User'}
          </h2>
        </div>

        {/* Stories Section */}
        <StoriesSection locale={locale} />

        {/* Divider */}
        <div className="h-2 bg-[var(--color-bg)]" />

        {/* Popular Assets Section */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--color-ink)]">
              {locale === 'ja' ? '人気のアセット' : 'Popular Assets'}
            </h3>
            <Link
              href="/search"
              className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium"
            >
              {locale === 'ja' ? 'すべて見る' : 'See All'}
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {popularAssets.map(asset => {
              const project = getProjectById(asset.projectId);
              const soldPercent = Math.round((asset.sold / (asset.sold + asset.available)) * 100);
              return (
                <Link
                  key={asset.id}
                  href={`/asset/${asset.id}`}
                  className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={asset.image}
                      alt={locale === 'ja' ? asset.nameJa : asset.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: project?.color }}
                      >
                        {locale === 'ja' ? project?.nameJa : project?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-[var(--color-ink)] line-clamp-1 mb-1">
                      {locale === 'ja' ? asset.nameJa : asset.name}
                    </h4>
                    <p className="text-xs text-[var(--color-ink-muted)] mb-2">
                      ¥{asset.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-primary)] rounded-full"
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--color-ink-muted)]">
                        {soldPercent}%
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4">
          <h3 className="text-lg font-bold text-[var(--color-ink)] mb-4">
            {locale === 'ja' ? 'クイックアクション' : 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/search"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--color-border)]"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-bg)] flex items-center justify-center">
                <Sparkles size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--color-ink)]">
                  {locale === 'ja' ? 'アセットを探す' : 'Find Assets'}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {assets.length} {locale === 'ja' ? '件' : 'items'}
                </p>
              </div>
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--color-border)]"
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--color-ink)]">
                  {locale === 'ja' ? 'ポートフォリオ' : 'Portfolio'}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {locale === 'ja' ? '資産を確認' : 'View assets'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // NON-AUTHENTICATED USER VIEW (Onboarding)
  // ==========================================
  return (
    <div className="min-h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* ===== MOBILE VERSION ===== */}
      <div className="md:hidden fixed inset-0 flex flex-col">
        {/* Background Marquee - More subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-60">
          {/* Top Rows */}
          <div className="absolute top-0 left-0 right-0">
            <div className="flex gap-3 mb-3 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div key={`m-row1-${index}`} className="flex-shrink-0">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={asset.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mb-3 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <div key={`m-row2-${index}`} className="flex-shrink-0">
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

          {/* Bottom Rows */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="flex gap-3 mb-3 animate-marquee-slow">
              {[...marqueeAssets, ...marqueeAssets].map((asset, index) => (
                <div key={`m-row3-${index}`} className="flex-shrink-0">
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
            <div className="flex gap-3 animate-marquee-slow-reverse">
              {[...marqueeAssets].reverse().concat([...marqueeAssets].reverse()).map((asset, index) => (
                <div key={`m-row4-${index}`} className="flex-shrink-0">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={asset.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Content - Onboarding Cards */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
          {/* White band behind content */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[420px] bg-white/98 backdrop-blur-md" />

          {/* Content */}
          <div className="relative z-10 w-full max-w-sm">
            {/* Logo & Main Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[#1a3acc] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-black text-2xl">F</span>
              </div>
              <h1 className="text-4xl font-black text-[var(--color-ink)] leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#6366f1] to-[var(--color-mint)] bg-clip-text text-transparent">
                  {locale === 'ja' ? 'ロマンが' : 'Dreams'}
                </span>
                <br />
                <span className="text-[var(--color-ink)]">
                  {locale === 'ja' ? '資産になる' : 'Become Assets'}
                </span>
              </h1>
            </div>

            {/* Onboarding Carousel */}
            <div className="relative mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-lg"
                >
                  {(() => {
                    const step = onboardingSteps[currentStep];
                    const IconComponent = step.icon;
                    return (
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ backgroundColor: `${step.color}20` }}
                        >
                          <IconComponent size={32} style={{ color: step.color }} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">
                          {locale === 'ja' ? step.titleJa : step.titleEn}
                        </h3>
                        <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-line leading-relaxed">
                          {locale === 'ja' ? step.descJa : step.descEn}
                        </p>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Carousel Navigation Arrows */}
              <button
                onClick={prevStep}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 rounded-full bg-white shadow-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextStep}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 rounded-full bg-white shadow-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-[var(--color-primary)]'
                      : 'bg-[var(--color-border)] hover:bg-[var(--color-ink-muted)]'
                  }`}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-[var(--color-primary-dark)] transition-all"
              >
                <LogIn size={20} />
                <span>{locale === 'ja' ? '無料で始める' : 'Get Started Free'}</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border-2 border-[var(--color-border)] text-[var(--color-ink-secondary)] rounded-xl font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              >
                <span>{locale === 'ja' ? 'まずは見てみる' : 'Browse First'}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="mt-4 mx-auto block text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              {locale === 'ja' ? 'English' : '日本語'}
            </button>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP VERSION ===== */}
      <div className="hidden md:block min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen">
          {/* Clean scrolling asset background */}
          <div className="absolute inset-0 overflow-hidden opacity-80">
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
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[480px] bg-white/98 backdrop-blur-md pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 pointer-events-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Main Headline - Fun & Bold */}
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-[var(--color-ink)] leading-[1.05] tracking-tight mb-8">
                <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#6366f1] to-[var(--color-mint)] bg-clip-text text-transparent">
                  {locale === 'ja' ? 'ロマンが' : 'Dreams'}
                </span>
                <br />
                <span>
                  {locale === 'ja' ? '資産になる' : 'Become Assets'}
                </span>
              </h1>

              {/* 3-Step Cards - Horizontal on Desktop */}
              <div className="flex gap-6 justify-center mb-10">
                {onboardingSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-lg w-56 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <IconComponent size={28} style={{ color: step.color }} />
                      </div>
                      <h3 className="text-base font-bold text-[var(--color-ink)] mb-1">
                        {locale === 'ja' ? step.titleJa : step.titleEn}
                      </h3>
                      <p className="text-xs text-[var(--color-ink-secondary)] whitespace-pre-line leading-relaxed">
                        {locale === 'ja' ? step.descJa : step.descEn}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl text-lg font-bold shadow-md hover:shadow-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200"
                >
                  <LogIn size={22} />
                  <span>{locale === 'ja' ? '無料で始める' : 'Get Started Free'}</span>
                </Link>
                <Link
                  href="/search"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white border-2 border-[var(--color-border)] text-[var(--color-ink-secondary)] rounded-xl text-lg font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
                >
                  <span>{locale === 'ja' ? 'まずは見てみる' : 'Browse First'}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
