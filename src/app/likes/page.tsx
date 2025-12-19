'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets } from '@/data/assets';
import { Heart, Trash2, Globe, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LikesPage() {
  const { t, locale, setLocale } = useI18n();
  const { likes, removeLike, isLiked } = useLikes();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const likedAssets = assets.filter(asset => likes.includes(asset.id));

  const handleRemove = (assetId: string) => {
    setRemovingId(assetId);
    setTimeout(() => {
      removeLike(assetId);
      setRemovingId(null);
    }, 300);
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
            <h1 className="text-xl font-bold">{t('likes.title')}</h1>
            {likedAssets.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-sm font-medium">
                {likedAssets.length}
              </span>
            )}
          </div>
          <button
            onClick={toggleLocale}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-border)] text-sm font-medium"
          >
            <Globe size={14} />
            <span className="uppercase">{locale}</span>
          </button>
        </div>
      </header>

      <div className="px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {likedAssets.length > 0 ? (
            <>
              {/* Summary Card - Mobile */}
              <div className="md:hidden mb-6">
                <div className="card p-4 bg-gradient-to-br from-[var(--color-accent-bg)] to-[var(--color-surface)]">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {t('likes.summary')}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {likedAssets.length} {locale === 'ja' ? 'アイテム' : 'items'}
                  </p>
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-[var(--color-accent)] font-medium"
                  >
                    {t('likes.discoverMore')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Desktop Summary */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <p className="text-[var(--color-text-secondary)]">
                  {t('likes.summary')}: <span className="font-semibold text-[var(--color-text)]">{likedAssets.length} {locale === 'ja' ? 'アイテム' : 'items'}</span>
                </p>
                <Link
                  href="/discover"
                  className="text-sm text-[var(--color-accent)] font-medium flex items-center gap-1"
                >
                  {t('likes.discoverMore')}
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Asset List */}
              <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:space-y-0">
                <AnimatePresence>
                  {likedAssets.map((asset, i) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: removingId === asset.id ? 0 : 1,
                        y: 0,
                        scale: removingId === asset.id ? 0.95 : 1
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="card card-hover overflow-hidden"
                    >
                      <Link href={`/asset/${asset.id}`} className="flex md:flex-col">
                        {/* Image - Side on mobile, Top on desktop */}
                        <div className="relative w-24 h-24 md:w-full md:h-40 flex-shrink-0">
                          <Image
                            src={asset.image}
                            alt={asset.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:opacity-0 md:hover:opacity-100 transition-opacity" />
                          <span className="hidden md:block absolute bottom-2 left-2 chip chip-accent text-sm">
                            {asset.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                          <div>
                            <span className="md:hidden chip chip-accent text-sm mb-1.5 inline-block">
                              {asset.category}
                            </span>
                            <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                              {asset.shortDescription}
                            </p>
                          </div>

                          {/* Actions - Mobile */}
                          <div className="md:hidden flex items-center gap-2 mt-3">
                            <a
                              href={`https://ango.jp/asset/${asset.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 btn-primary text-sm py-2 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ShoppingBag size={14} className="inline mr-1" />
                              {t('asset.invest')}
                            </a>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemove(asset.id);
                              }}
                              className="p-2 rounded-lg bg-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </Link>

                      {/* Actions - Desktop */}
                      <div className="hidden md:flex items-center gap-2 px-4 pb-4">
                        <a
                          href={`https://ango.jp/asset/${asset.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn-primary text-sm py-2.5 text-center"
                        >
                          <ShoppingBag size={16} className="inline mr-1.5" />
                          {t('asset.invest')}
                        </a>
                        <button
                          onClick={() => handleRemove(asset.id)}
                          className="p-2.5 rounded-xl bg-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-[var(--color-border)] flex items-center justify-center mb-6">
                <Heart size={32} className="text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('likes.empty')}</h3>
              <p className="text-[var(--color-text-muted)] text-center max-w-xs mb-6">
                {t('likes.emptyDescription')}
              </p>
              <Link href="/discover" className="btn-primary">
                {t('likes.startDiscovering')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
