'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Asset } from '@/data/assets';
import { Heart, X, ChevronRight } from 'lucide-react';

interface SwipeCardProps {
  asset: Asset;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

export default function SwipeCard({ asset, onSwipe, isTop }: SwipeCardProps) {
  const router = useRouter();
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(300);
      onSwipe('right');
    } else if (info.offset.x < -100) {
      setExitX(-300);
      onSwipe('left');
    }
  };

  const handleCardTap = () => {
    router.push(`/asset/${asset.id}`);
  };

  return (
    <motion.div
      className={`absolute w-full ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
      whileTap={{ scale: isTop ? 0.98 : 0.95 }}
    >
      <div
        onClick={handleCardTap}
        className="relative bg-[var(--color-surface)] rounded-3xl overflow-hidden swipe-card-shadow"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={asset.image}
            alt={asset.name}
            fill
            className="object-cover"
            priority={isTop}
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Like/Nope indicators */}
          {isTop && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-8 px-4 py-2 border-4 border-green-500 rounded-xl rotate-[-15deg]"
              >
                <span className="text-green-500 font-bold text-2xl">LIKE</span>
              </motion.div>
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 right-8 px-4 py-2 border-4 border-red-500 rounded-xl rotate-[15deg]"
              >
                <span className="text-red-500 font-bold text-2xl">NOPE</span>
              </motion.div>
            </>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-[var(--color-text)]">
              {asset.category}
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2 leading-tight">{asset.name}</h2>
            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
              {asset.shortDescription}
            </p>

            {/* Tap to view hint */}
            <div className="flex items-center gap-1 mt-4 text-white/60 text-xs">
              <span>Tap to learn more</span>
              <ChevronRight size={14} />
            </div>
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLiked([...liked, assets[currentIndex].id]);
    }
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 200);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  const visibleCards = assets.slice(currentIndex, currentIndex + 3);

  if (currentIndex >= assets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
        <div className="w-20 h-20 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-semibold mb-2">You&apos;ve seen all assets</h3>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Check back later for new opportunities
        </p>
        <button
          onClick={() => setCurrentIndex(0)}
          className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Card Stack */}
      <div className="relative h-[500px] md:h-[550px]">
        {visibleCards.map((asset, index) => (
          <SwipeCard
            key={asset.id}
            asset={asset}
            onSwipe={handleSwipe}
            isTop={index === 0}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          aria-label="Skip"
        >
          <X className="w-6 h-6 text-red-500" />
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          aria-label="Like"
        >
          <Heart className="w-6 h-6 text-green-500" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-1.5 mt-6">
        {assets.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-6 bg-[var(--color-accent)]'
                : index < currentIndex
                ? 'w-1.5 bg-[var(--color-accent)]/50'
                : 'w-1.5 bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
