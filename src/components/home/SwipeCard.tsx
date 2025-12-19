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
  stackIndex?: number; // 0 = top, 1 = second, 2 = third
}

export default function SwipeCard({ asset, onSwipe, isTop, stackIndex = 0 }: SwipeCardProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [exitX, setExitX] = useState(0);
  const isDragging = useRef(false);

  const x = useMotionValue(0);

  // Smoother rotation and opacity transforms
  const rotate = useTransform(x, [-150, 0, 150], [-6, 0, 6]);
  const cardOpacity = useTransform(x, [-150, 0, 150], [0.85, 1, 0.85]);
  const dragScale = useTransform(x, [-150, 0, 150], [0.98, 1, 0.98]);

  // Stack visual properties based on position
  const stackScale = isTop ? 1 : stackIndex === 1 ? 0.95 : 0.90;
  const stackY = isTop ? 0 : stackIndex === 1 ? 8 : 16;
  const stackOpacity = isTop ? 1 : stackIndex === 1 ? 0.7 : 0.4;

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
      className={`absolute inset-0 ${isTop ? 'z-10' : stackIndex === 1 ? 'z-[5]' : 'z-0'}`}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? cardOpacity : stackOpacity,
        scale: isTop ? dragScale : stackScale,
        touchAction: 'none', // Disable ALL browser touch gestures
      }}
      drag={isTop ? 'x' : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ scale: stackScale, y: stackY, opacity: stackOpacity }}
      animate={{ scale: stackScale, y: stackY, opacity: stackOpacity }}
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

  // Show 3 cards for stack visual effect
  const visibleCards = assets.slice(currentIndex, currentIndex + 3).reverse();

  // End state - Premium completion screen
  if (currentIndex >= assets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary)]/5 flex items-center justify-center">
            <Check className="w-9 h-9 text-[var(--color-primary)]" strokeWidth={2.5} />
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-[var(--color-ink)] mb-2 tracking-tight">
          {locale === 'ja' ? '完了' : 'All Done'}
        </h3>
        <p className="text-[var(--color-ink-muted)] text-sm mb-6 max-w-[240px]">
          {locale === 'ja'
            ? 'マーケットでお気に入りを確認しましょう'
            : 'Check your favorites in the Marketplace'}
        </p>

        <button
          onClick={resetStack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm"
        >
          <RefreshCw size={14} />
          <span>{locale === 'ja' ? '最初から見る' : 'Start Over'}</span>
        </button>
      </div>
    );
  }

  const currentAsset = assets[currentIndex];

  return (
    <div className="flex flex-col h-full">
      {/* Card Stack Container */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="relative w-full aspect-square max-w-[min(100%,340px)] mx-auto">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((asset, index) => {
              const cardCount = visibleCards.length;
              const stackPosition = cardCount - 1 - index; // 0 = top, 1 = second, etc.
              return (
                <SwipeCard
                  key={asset.id}
                  asset={asset}
                  onSwipe={handleSwipe}
                  isTop={stackPosition === 0}
                  stackIndex={stackPosition}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Title only - 1 line */}
        {currentAsset && (
          <h2 className="text-center font-display text-lg font-bold text-[var(--color-ink)] mt-5 px-4 truncate">
            {currentAsset.name}
          </h2>
        )}
      </div>
    </div>
  );
}
