'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Asset, Category } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import AIInsights from '@/components/asset/AIInsights';
import { ChevronLeft, ExternalLink, Heart, Share2, Check, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetDetailClientProps {
  asset: Asset;
  category: Category | undefined;
}

export default function AssetDetailClient({ asset, category }: AssetDetailClientProps) {
  const { t, locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [showShareToast, setShowShareToast] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = () => {
    toggleLike(asset.id);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 400);
  };

  const handleShare = async () => {
    const shareData = {
      title: asset.name,
      text: asset.shortDescription,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const whyConsiderPoints = locale === 'ja'
    ? [
        '理解しやすい実物資産への投資',
        '目的が明確な透明性のあるプロジェクト',
        'ANGOが厳選した投資機会',
      ]
    : [
        'Tangible real-world impact you can understand',
        'Transparent project with clear objectives',
        'Part of a curated selection from ANGO',
      ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:pl-24">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/markets/${asset.categoryId}`}
            className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                isLiked(asset.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-black/30 text-white hover:bg-black/40'
              } ${likeAnimation ? 'animate-heart-pop' : ''}`}
            >
              <Heart size={18} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={toggleLocale}
              className="md:hidden w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <Globe size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] text-sm font-medium flex items-center gap-2"
          >
            <Check size={16} />
            {locale === 'ja' ? 'リンクをコピーしました' : 'Link copied'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Image */}
      <div className="relative aspect-[4/3] md:aspect-[21/9] w-full">
        <Image
          src={asset.image}
          alt={asset.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />

        {/* Category Badge */}
        {category && (
          <div className="absolute bottom-6 left-4 md:left-1/2 md:-translate-x-1/2">
            <span
              className="px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg"
              style={{ backgroundColor: category.color }}
            >
              {category.icon} {locale === 'ja' ? category.nameJa : category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-4 relative z-10">
        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">{asset.name}</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 md:text-lg">
            {asset.shortDescription}
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">{t('asset.story')}</h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {asset.story}
          </p>
        </motion.div>

        {/* Two Column Layout on Desktop */}
        <div className="md:grid md:grid-cols-2 md:gap-6">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <AIInsights asset={asset} />
          </motion.div>

          {/* Why This Asset */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="h-full p-5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-lg font-semibold mb-4">{t('asset.why')}</h2>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                {whyConsiderPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center">
                      <Check size={14} className="text-[var(--color-accent)]" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 md:max-w-md md:mx-auto"
        >
          <a
            href={asset.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2 w-full py-4 px-6
              bg-[var(--color-accent)] text-white rounded-2xl
              font-semibold text-base hover:opacity-90 transition-all
              hover:shadow-lg hover:shadow-[var(--color-accent)]/20
            "
          >
            <span>{t('asset.viewOnAngo')}</span>
            <ExternalLink size={18} />
          </a>
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">
            {t('asset.secureNote')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
