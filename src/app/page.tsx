'use client';

import { SwipeStack } from '@/components/home/SwipeCard';
import { assets } from '@/data/assets';

export default function Home() {
  // Shuffle assets for discovery feel
  const shuffledAssets = [...assets].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen safe-top">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">finango</h1>
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Discover
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <SwipeStack assets={shuffledAssets} />
      </div>

      {/* Hint text */}
      <div className="text-center text-sm text-[var(--color-text-muted)] px-8 mt-4">
        <p>Swipe right to save, left to skip</p>
        <p className="mt-1">Tap card to learn more</p>
      </div>
    </div>
  );
}
