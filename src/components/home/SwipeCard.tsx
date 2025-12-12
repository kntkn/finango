'use client';

import { useState, useRef } from 'react';
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
  const isDragging = useRef(false);

  const x = useMotionValue(0);

  // Smoother rotation and opacity transforms
  const rotate = useTransform(x, [-150, 0, 150], [-8, 0, 8]);
  const cardOpacity = useTransform(x, [-150, 0, 150], [0.8, 1, 0.8]);

  // Visual feedback - appear earlier and smoother
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, -20], [1, 0]);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    isDragging.current = false;

    // Lower threshold for easier swiping (50px instead of 100)
    const threshold = 50;
    // Also check velocity for quick flicks
    const velocityThreshold = 300;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      setExitX(400);
      onSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      setExitX(-400);
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
      }}
      drag={isTop ? 'x' : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12, opacity: isTop ? 1 : 0.7 }}
      exit={{
        x: exitX,
        opacity: 0,
        rotate: exitX > 0 ? 15 : -15,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileDrag={{ cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Card Container */}
      <div
        onClick={handleCardTap}
        className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer select-none"
        style={{ touchAction: 'pan-y' }}
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

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 pointer-events-none" />

        {/* Swipe feedback - Like */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-1/2 right-6 -translate-y-1/2 w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-xl pointer-events-none"
            >
              <Heart size={32} className="text-white" fill="white" />
            </motion.div>

            {/* Swipe feedback - Pass */}
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-1/2 left-6 -translate-y-1/2 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl pointer-events-none"
            >
              <X size={32} className="text-gray-400" />
            </motion.div>
          </>
        )}

        {/* Category badge */}
        <div className="absolute top-5 left-5 pointer-events-none">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm"
            style={{ backgroundColor: `${categoryColor}dd` }}
          >
            {asset.category}
          </span>
        </div>

        {/* Bottom text - Magazine style */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
          <h2 className="text-xl font-bold text-white leading-tight mb-1.5">
            {asset.name}
          </h2>
          <p className="text-white/70 text-sm line-clamp-2">
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
    // Faster card switch
    setCurrentIndex(prev => prev + 1);
  };

  const resetStack = () => {
    setCurrentIndex(0);
  };

  const visibleCards = assets.slice(currentIndex, currentIndex + 2).reverse();

  // End state
  if (currentIndex >= assets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mb-5">
          <Check className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {locale === 'ja' ? '完了' : 'Done'}
        </h3>
        <p className="text-white/60 text-sm mb-6 max-w-[240px]">
          {locale === 'ja'
            ? 'マーケットでお気に入りを確認'
            : 'Check favorites in Marketplace'}
        </p>
        <button
          onClick={resetStack}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--color-primary)] rounded-full font-semibold text-sm"
        >
          <RefreshCw size={16} />
          <span>{locale === 'ja' ? '最初から' : 'Restart'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Card Stack */}
      <div className="absolute inset-4">
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

      {/* Progress - simple dots at bottom */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
        {assets.slice(0, Math.min(assets.length, 10)).map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index < currentIndex
                ? 'bg-white/40'
                : index === currentIndex
                ? 'bg-white'
                : 'bg-white/20'
            }`}
          />
        ))}
        {assets.length > 10 && (
          <span className="text-white/40 text-xs ml-1">+{assets.length - 10}</span>
        )}
      </div>
    </div>
  );
}
