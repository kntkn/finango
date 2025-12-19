'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Asset, categories } from '@/data/assets';
import { useLikes } from '@/lib/likes';
import { useI18n } from '@/lib/i18n';
import { Check, RefreshCw, Heart, X, ArrowUpRight } from 'lucide-react';

interface SwipeCardProps {
  asset: Asset;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

export default function SwipeCard({ asset, onSwipe, isTop }: SwipeCardProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [exitX, setExitX] = useState(0);
  const isDragging = useRef(false);

  const x = useMotionValue(0);

  // Smoother rotation and opacity transforms
  const rotate = useTransform(x, [-150, 0, 150], [-6, 0, 6]);
  const cardOpacity = useTransform(x, [-150, 0, 150], [0.85, 1, 0.85]);
  const scale = useTransform(x, [-150, 0, 150], [0.98, 1, 0.98]);

  // Visual feedback - appear earlier and smoother
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const likeScale = useTransform(x, [20, 80], [0.8, 1]);
  const passOpacity = useTransform(x, [-80, -20], [1, 0]);
  const passScale = useTransform(x, [-80, -20], [1, 0.8]);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    isDragging.current = false;

    // Get absolute values for comparison
    const absOffsetX = Math.abs(info.offset.x);
    const absOffsetY = Math.abs(info.offset.y);
    const absVelocityX = Math.abs(info.velocity.x);

    // Only register swipe if horizontal movement is dominant (2x more than vertical)
    const isHorizontalDominant = absOffsetX > absOffsetY * 2;

    // Lower threshold for easier swiping
    const threshold = 40;
    // Velocity threshold for quick flicks
    const velocityThreshold = 200;

    // Must be horizontal-dominant OR have strong horizontal velocity
    if (!isHorizontalDominant && absVelocityX < velocityThreshold) {
      return; // Ignore if not clearly horizontal
    }

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setExitX(350);
      onSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setExitX(-350);
      onSwipe('left');
    }
  };

  const handleCardTap = () => {
    // Only navigate if not dragging
    if (!isDragging.current) {
      router.push(`/asset/${asset.id}`);
    }
  };

  const categoryColor = categories.find(c => c.id === asset.categoryId)?.color || '#0ea5e9';

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'z-10' : 'z-0'}`}
      style={{
        x,
        rotate,
        opacity: cardOpacity,
        scale,
        touchAction: 'none', // Disable ALL browser touch gestures
      }}
      drag={isTop ? 'x' : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 8, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 8, opacity: isTop ? 1 : 0.7 }}
      exit={{
        x: exitX,
        opacity: 0,
        rotate: exitX > 0 ? 10 : -10,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      }}
      whileDrag={{ cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Card Container - Square aspect ratio for predictable swipe */}
      <div
        onClick={handleCardTap}
        className="relative h-full w-full rounded-3xl overflow-hidden shadow-[var(--shadow-card)] cursor-pointer select-none"
      >
        {/* Full-bleed Image */}
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover pointer-events-none"
          priority={isTop}
          sizes="100vw"
          draggable={false}
        />

        {/* Subtle gradient for UI elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />

        {/* Swipe feedback - Like (Mint/Cheer color) - Centered for square card */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity, scale: likeScale }}
              className="absolute top-1/2 right-4 -translate-y-1/2 w-14 h-14 rounded-2xl bg-[var(--color-mint)] flex items-center justify-center shadow-lg pointer-events-none"
            >
              <Heart size={24} className="text-[var(--color-ink)]" fill="currentColor" />
            </motion.div>

            {/* Swipe feedback - Pass */}
            <motion.div
              style={{ opacity: passOpacity, scale: passScale }}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-none"
            >
              <X size={24} className="text-[var(--color-ink-muted)]" />
            </motion.div>
          </>
        )}

        {/* Category badge - Top left */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span
            className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white backdrop-blur-md shadow-sm"
            style={{ backgroundColor: `${categoryColor}cc` }}
          >
            {asset.category}
          </span>
        </div>

        {/* Tap to view indicator - Top right */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-white/25 backdrop-blur-md flex items-center justify-center">
            <ArrowUpRight size={16} className="text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SwipeStackProps {
  assets: Asset[];
}

export function SwipeStack({ assets }: SwipeStackProps) {
  const { toggleLike } = useLikes();
  const { locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && assets[currentIndex]) {
      toggleLike(assets[currentIndex].id);
    }
    // Faster card switch
    setCurrentIndex(prev => prev + 1);
  };

  const resetStack = () => {
    setCurrentIndex(0);
  };

  const visibleCards = assets.slice(currentIndex, currentIndex + 2).reverse();

  // End state - Premium completion screen
  if (currentIndex >= assets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        {/* Success icon with gradient */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-accent)]/5 flex items-center justify-center">
            <Check className="w-9 h-9 text-[var(--color-accent)]" strokeWidth={2.5} />
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-accent)]/20 animate-pulse" />
        </div>

        <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-2 tracking-tight">
          {locale === 'ja' ? '完了' : 'All Done'}
        </h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-8 max-w-[260px] leading-relaxed">
          {locale === 'ja'
            ? 'マーケットでお気に入りを確認しましょう'
            : 'Check your favorites in the Marketplace'}
        </p>

        {/* Premium button with gradient */}
        <button
          onClick={resetStack}
          className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 ease-[var(--ease-out-expo)]"
        >
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>{locale === 'ja' ? '最初から見る' : 'Start Over'}</span>
        </button>
      </div>
    );
  }

  const currentAsset = assets[currentIndex];

  return (
    <div className="flex flex-col h-full">
      {/* Square Card Container - Fixed aspect ratio prevents vertical confusion */}
      <div className="flex-shrink-0 px-4">
        <div className="relative w-full aspect-square max-w-[min(100%,400px)] mx-auto">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((asset, index) => (
              <SwipeCard
                key={asset.id}
                asset={asset}
                onSwipe={handleSwipe}
                isTop={index === visibleCards.length - 1}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Asset Info - Below the card, not overlaying */}
      {currentAsset && (
        <div className="flex-1 flex flex-col justify-center px-6 pt-4 pb-2 text-center">
          <h2 className="font-display text-xl font-bold text-[var(--color-ink)] leading-tight tracking-tight">
            {currentAsset.name}
          </h2>
          <p className="text-[var(--color-ink-muted)] text-sm mt-2 line-clamp-2 leading-relaxed">
            {currentAsset.shortDescription}
          </p>

          {/* Swipe hint */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
              <X size={14} />
              <span>{locale === 'ja' ? 'スキップ' : 'Skip'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-mint-dark)]">
              <Heart size={14} fill="currentColor" />
              <span>{locale === 'ja' ? 'いいね' : 'Like'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex-shrink-0 pb-2 flex justify-center gap-1.5 pointer-events-none">
        {assets.slice(0, Math.min(assets.length, 10)).map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index < currentIndex
                ? 'bg-[var(--color-primary)]/30'
                : index === currentIndex
                ? 'bg-[var(--color-primary)]'
                : 'bg-[var(--color-border)]'
            }`}
          />
        ))}
        {assets.length > 10 && (
          <span className="text-[var(--color-ink-muted)] text-xs ml-1">+{assets.length - 10}</span>
        )}
      </div>
    </div>
  );
}
