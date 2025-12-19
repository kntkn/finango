'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets } from '@/data/assets';
import { Heart, RefreshCw, Globe, ChevronRight } from 'lucide-react';

export default function DiscoverPage() {
  const { t, locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);

  const shuffledAssets = [...assets].sort(() => 0.5 - Math.random());

  const handleSwipe = useCallback((dir: number) => {
    if (dir > 0 && currentIndex < shuffledAssets.length - 1) {
      if (!isLiked(shuffledAssets[currentIndex].id)) {
        toggleLike(shuffledAssets[currentIndex].id);
      }
    }
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex(prev => Math.min(prev + 1, shuffledAssets.length));
    }, 200);
  }, [currentIndex, shuffledAssets, isLiked, toggleLike]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? 1 : -1);
    }
  };

  const handleDoubleTap = (assetId: string) => {
    if (!isLiked(assetId)) {
      toggleLike(assetId);
      setLikeAnimation(assetId);
      setTimeout(() => setLikeAnimation(null), 600);
    }
  };

  const handleLikeClick = (e: React.MouseEvent, assetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(assetId);
    setLikeAnimation(assetId);
    setTimeout(() => setLikeAnimation(null), 400);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setDirection(0);
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const currentAsset = shuffledAssets[currentIndex];
  const nextAsset = shuffledAssets[currentIndex + 1];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">{t('discover.title')}</h1>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-border)] text-sm font-medium"
          >
            <Globe size={14} />
            <span className="uppercase">{locale}</span>
          </button>
        </div>
      </header>

      {/* Mobile Card View */}
      <div className="md:hidden px-4 py-6">
        {currentIndex < shuffledAssets.length ? (
          <>
            <div className="relative h-[65vh] max-h-[500px]">
              {/* Background card */}
              {nextAsset && (
                <div className="absolute inset-0 card overflow-hidden scale-95 opacity-60">
                  <Image
                    src={nextAsset.image}
                    alt={nextAsset.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Current card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAsset.id}
                  className="absolute inset-0 card overflow-hidden cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.9}
                  onDragEnd={handleDragEnd}
                  onDoubleClick={() => handleDoubleTap(currentAsset.id)}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    x: direction > 0 ? 300 : -300,
                    opacity: 0,
                    transition: { duration: 0.2 }
                  }}
                  whileDrag={{ scale: 1.02 }}
                >
                  <Image
                    src={currentAsset.image}
                    alt={currentAsset.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Double tap heart animation */}
                  <AnimatePresence>
                    {likeAnimation === currentAsset.id && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Heart size={80} className="text-white fill-red-500 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category */}
                  <span className="absolute top-4 left-4 chip chip-accent text-sm">
                    {currentAsset.category}
                  </span>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-white text-2xl font-bold leading-tight">
                      {currentAsset.name}
                    </h2>
                    <p className="text-white/80 text-sm mt-2 line-clamp-2">
                      {currentAsset.shortDescription}
                    </p>
                    <Link
                      href={`/asset/${currentAsset.id}`}
                      className="inline-flex items-center gap-1 text-white/90 text-sm font-medium mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('common.learnMore')}
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Hint */}
            <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
              {t('discover.hint.mobile')}
            </p>

            {/* Progress */}
            <div className="flex justify-center gap-1 mt-4">
              {shuffledAssets.slice(0, 10).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === currentIndex
                      ? 'w-6 bg-[var(--color-accent)]'
                      : i < currentIndex
                      ? 'w-1.5 bg-[var(--color-accent)]/40'
                      : 'w-1.5 bg-[var(--color-border-strong)]'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center mb-6">
              <Heart size={32} className="text-[var(--color-accent)]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('discover.empty')}</h3>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 mt-4 btn-primary"
            >
              <RefreshCw size={18} />
              {t('discover.restart')}
            </button>
          </div>
        )}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            {t('discover.hint.pc')}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {assets.map((asset, i) => (
              <Link
                key={asset.id}
                href={`/asset/${asset.id}`}
                className={`card card-hover overflow-hidden animate-scale-in opacity-0`}
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikeClick(e, asset.id)}
                    className={`absolute top-3 right-3 like-btn ${isLiked(asset.id) ? 'liked' : ''} ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                  >
                    <Heart size={18} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Category */}
                  <span className="absolute bottom-3 left-3 chip chip-accent text-sm">
                    {asset.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {asset.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
