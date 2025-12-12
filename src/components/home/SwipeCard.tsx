'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Asset } from '@/data/assets';
import { useLikes } from '@/lib/likes';
import { useI18n } from '@/lib/i18n';
import { Check, RefreshCw } from 'lucide-react';

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
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Indicators opacity based on swipe direction
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x > threshold) {
      setExitX(400);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitX(-400);
      onSwipe('left');
    }
  };

  const handleCardTap = () => {
    router.push(`/asset/${asset.id}`);
  };

  const getLiquidityLabel = () => {
    const labels = {
      high: { en: 'High', ja: '高' },
      medium: { en: 'Medium', ja: '中' },
      low: { en: 'Low', ja: '低' },
    };
    return labels[asset.aiInsights.liquidity][locale];
  };

  const getProjectTypeLabel = () => {
    const map: Record<string, { en: string; ja: string }> = {
      'Long-term': { en: 'Long-term', ja: '長期' },
      'Mid-term': { en: 'Mid-term', ja: '中期' },
      'Short-term': { en: 'Short-term', ja: '短期' },
    };
    return map[asset.aiInsights.projectType]?.[locale] || asset.aiInsights.projectType;
  };

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 8 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 8 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.25 } }}
      whileTap={{ scale: isTop ? 0.98 : 0.95 }}
    >
      <div
        onClick={handleCardTap}
        className="relative h-full bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border)]"
      >
        {/* Image */}
        <div className="relative h-[55%] w-full">
          <Image
            src={asset.image}
            alt={asset.name}
            fill
            className="object-cover"
            priority={isTop}
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Swipe Indicators - Pure swipe visual feedback */}
          {isTop && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-6 right-6 px-4 py-2 bg-[var(--color-success)] rounded-lg shadow-lg"
              >
                <span className="text-white font-bold text-lg tracking-wide">LIKE</span>
              </motion.div>
              <motion.div
                style={{ opacity: passOpacity }}
                className="absolute top-6 left-6 px-4 py-2 bg-white/95 border-2 border-[var(--color-border-strong)] rounded-lg shadow-lg"
              >
                <span className="text-[var(--color-text-muted)] font-bold text-lg tracking-wide">PASS</span>
              </motion.div>
            </>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-full text-sm font-semibold">
              {asset.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 h-[45%] flex flex-col">
          <h2 className="text-xl font-bold text-[var(--color-text)] leading-tight line-clamp-2">
            {asset.name}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed line-clamp-2 mt-2 flex-grow">
            {asset.shortDescription}
          </p>

          {/* Quick Tags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`
              px-2.5 py-1 rounded-full text-xs font-semibold
              ${asset.aiInsights.liquidity === 'high' ? 'bg-emerald-100 text-emerald-700' :
                asset.aiInsights.liquidity === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'}
            `}>
              {locale === 'ja' ? '流動性' : 'Liquidity'}: {getLiquidityLabel()}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-border)] text-[var(--color-text-secondary)]">
              {getProjectTypeLabel()}
            </span>
          </div>

          {/* Tap hint */}
          <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
            {locale === 'ja' ? 'タップで詳細 • 左右にスワイプ' : 'Tap for details • Swipe left or right'}
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
      // Auto-like on right swipe
      toggleLike(assets[currentIndex].id);
    }
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 250);
  };

  const resetStack = () => {
    setCurrentIndex(0);
  };

  const visibleCards = assets.slice(currentIndex, currentIndex + 3);

  // End state - all cards swiped
  if (currentIndex >= assets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[480px] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center mb-5">
          <Check className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
          {locale === 'ja' ? 'すべてチェックしました' : 'All Reviewed'}
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-[280px]">
          {locale === 'ja'
            ? 'いいねした銘柄は「探す」タブで確認できます'
            : 'View your liked assets in the Search tab'}
        </p>
        <button
          onClick={resetStack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={16} />
          <span>{locale === 'ja' ? 'もう一度見る' : 'Start Over'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Card Stack - No buttons, pure swipe */}
      <div className="relative h-[480px]">
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

      {/* Progress indicator */}
      <div className="flex justify-center gap-1 mt-5">
        {assets.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-5 bg-[var(--color-accent)]'
                : index < currentIndex
                ? 'w-1.5 bg-[var(--color-accent)]/40'
                : 'w-1.5 bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>

      {/* Swipe instruction */}
      <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
        {locale === 'ja'
          ? '← 興味なし | いいね →'
          : '← Pass | Like →'}
      </p>
    </div>
  );
}
