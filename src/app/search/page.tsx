'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets, categories, getAssetById } from '@/data/assets';
import { Search, Heart, Sparkles, ChevronRight, X, Globe, TrendingUp } from 'lucide-react';

export default function SearchPage() {
  const { locale, setLocale, t } = useI18n();
  const { likes, isLiked, toggleLike } = useLikes();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);

  // Get liked assets
  const likedAssets = useMemo(() => {
    return likes.map(id => getAssetById(id)).filter(Boolean);
  }, [likes]);

  // Filter assets based on search and category
  const filteredAssets = useMemo(() => {
    let result = assets;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset =>
        asset.name.toLowerCase().includes(query) ||
        asset.shortDescription.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query)
      );
    }

    if (activeCategory) {
      result = result.filter(asset => asset.categoryId === activeCategory);
    }

    return result;
  }, [searchQuery, activeCategory]);

  // Featured picks (first 3)
  const featuredAssets = assets.slice(0, 3);

  const handleLike = (e: React.MouseEvent, assetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(assetId);
    setLikeAnimation(assetId);
    setTimeout(() => setLikeAnimation(null), 400);
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveCategory(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8 md:pl-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-3 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-[var(--color-text)]">
            {locale === 'ja' ? '探す' : 'Search'}
          </h1>
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
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'ja' ? '銘柄名やカテゴリで検索...' : 'Search by name or category...'}
              className="w-full pl-12 pr-10 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
              }`}
            >
              {locale === 'ja' ? 'すべて' : 'All'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                <span>{locale === 'ja' ? cat.nameJa : cat.name}</span>
              </button>
            ))}
          </div>

          {/* Liked Assets Section */}
          {likedAssets.length > 0 && !searchQuery && !activeCategory && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text)]">
                  <Heart size={18} className="text-rose-500" fill="currentColor" />
                  {locale === 'ja' ? 'いいねした銘柄' : 'Liked Assets'}
                  <span className="text-sm font-normal text-[var(--color-text-muted)]">
                    ({likedAssets.length})
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {likedAssets.map((asset) => asset && (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <button
                        onClick={(e) => handleLike(e, asset.id)}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-500 ${
                          likeAnimation === asset.id ? 'animate-heart-pop' : ''
                        }`}
                      >
                        <Heart size={14} fill="currentColor" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-[var(--color-accent)] text-white rounded-full text-xs font-semibold">
                        {asset.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                        {asset.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Featured Picks - Only show when not searching */}
          {!searchQuery && !activeCategory && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text)]">
                  <Sparkles size={18} className="text-[var(--color-accent)]" />
                  {locale === 'ja' ? '注目のピックアップ' : 'Featured Picks'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="group relative bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <button
                        onClick={(e) => handleLike(e, asset.id)}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 ${
                          isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                        } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                      >
                        <Heart size={16} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block px-2.5 py-1 bg-[var(--color-accent)] text-white rounded-full text-xs font-semibold mb-2">
                          {asset.category}
                        </span>
                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-[var(--color-accent-light)] transition-colors">
                          {asset.name}
                        </h3>
                        <p className="text-white/80 text-sm mt-1 line-clamp-1">
                          {asset.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Search Results or All Assets */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text)]">
                {searchQuery || activeCategory ? (
                  <>
                    <Search size={18} className="text-[var(--color-text-secondary)]" />
                    {locale === 'ja' ? '検索結果' : 'Search Results'}
                    <span className="text-sm font-normal text-[var(--color-text-muted)]">
                      ({filteredAssets.length})
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={18} className="text-emerald-600" />
                    {locale === 'ja' ? 'すべての銘柄' : 'All Assets'}
                  </>
                )}
              </h2>
            </div>

            {filteredAssets.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <button
                        onClick={(e) => handleLike(e, asset.id)}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 ${
                          isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                        } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                      >
                        <Heart size={14} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-[var(--color-accent)] text-white rounded-full text-xs font-semibold">
                        {asset.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                        {asset.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-[var(--color-border)] mb-4" />
                <p className="text-[var(--color-text-muted)]">
                  {locale === 'ja'
                    ? '該当する銘柄が見つかりませんでした'
                    : 'No assets found matching your search'}
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 text-[var(--color-accent)] font-medium hover:underline"
                >
                  {locale === 'ja' ? '検索をクリア' : 'Clear search'}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
