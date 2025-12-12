'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Asset, categories } from '@/data/assets';
import { useLikes } from '@/lib/likes';
import { useI18n } from '@/lib/i18n';
import { Check, RefreshCw, Heart, X } from 'lucide-react';

interface SwipeCardProps {
  asset: Asset;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

export default function SwipeCard({ asset, onSwipe, isTop }: SwipeCardProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Visual feedback indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);
  const likeScale = useTransform(x, [0, 100], [0.8, 1]);
  const passScale = useTransform(x, [-100, 0], [1, 0.8]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(500);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitX(-500);
      onSwipe('left');
    }
  };

  const handleCardTap = () => {
    router.push(`/asset/${asset.id}`);
  };

  const categoryColor = categories.find(c => c.id === asset.categoryId)?.color || '#6366f1';

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.92, y: isTop ? 0 : 16 }}
      animate={{ scale: isTop ? 1 : 0.92, y: isTop ? 0 : 16 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      whileTap={{ scale: isTop ? 0.98 : 0.92 }}
    >
      {/* Magazine-style full-bleed card */}
      <div
        onClick={handleCardTap}
        className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Full-bleed Image */}
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover"
          priority={isTop}
          sizes="100vw"
        />

        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Swipe feedback icons - minimal */}
        {isTop && (
          <>
            {/* Like indicator */}
            <motion.div
              style={{ opacity: likeOpacity, scale: likeScale }}
              className="absolute top-1/2 right-8 -translate-y-1/2 w-20 h-20 rounded-full bg-rose-500/90 flex items-center justify-center shadow-2xl"
            >
              <Heart size={40} className="text-white" fill="white" />
            </motion.div>

            {/* Pass indicator */}
            <motion.div
              style={{ opacity: passOpacity, scale: passScale }}
              className="absolute top-1/2 left-8 -translate-y-1/2 w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
            >
              <X size={40} className="text-gray-400" />
            </motion.div>
          </>
        )}

        {/* Top area - Category badge */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
          <span
            className="px-4 py-2 rounded-full text-sm font-bold text-white backdrop-blur-md"
            style={{ backgroundColor: `${categoryColor}CC` }}
          >
            {asset.category}
          </span>
        </div>

        {/* Bottom area - Magazine cover style text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          <h2 className="text-2xl font-black text-white leading-tight tracking-tight mb-2 drop-shadow-lg">
            {asset.name}
          </h2>
          <p className="text-white/80 text-sm font-medium line-clamp-2 drop-shadow-md">
            {asset.shortDescription}
          </p>
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
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const resetStack = () => {
    setCurrentIndex(0);
  };

  const visibleCards = assets.slice(currentIndex, currentIndex + 3);

  // End state
  if (currentIndex >= assets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-20 h-20 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">
          {locale === 'ja' ? 'すべてチェック完了' : 'All Done'}
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm mb-8 max-w-[260px]">
          {locale === 'ja'
            ? 'マーケットプレイスでお気に入りを確認できます'
            : 'Check your favorites in the Marketplace'}
        </p>
        <button
          onClick={resetStack}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={18} />
          <span>{locale === 'ja' ? '最初から' : 'Start Over'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Card Stack */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {visibleCards.map((asset, index) => (
            <SwipeCard
              key={asset.id}
              asset={asset}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Progress bar - minimal */}
      <div className="absolute bottom-4 left-6 right-6 flex gap-1">
        {assets.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index < currentIndex
                ? 'bg-white/60'
                : index === currentIndex
                ? 'bg-white'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
