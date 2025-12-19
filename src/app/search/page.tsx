'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { assets, categories, getAssetById } from '@/data/assets';
import { Search, Heart, Filter, X, Globe, SlidersHorizontal, Grid3X3, List, Tag, ArrowUpDown } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

type ViewMode = 'grid' | 'list';
type SortOption = 'default' | 'name' | 'category';

export default function MarketplacePage() {
  const { locale, setLocale } = useI18n();
  const { likes, isLiked, toggleLike } = useLikes();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Get liked assets
  const likedAssets = useMemo(() => {
    return likes.map(id => getAssetById(id)).filter(Boolean);
  }, [likes]);

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let result = [...assets];

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

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [searchQuery, activeCategory, sortBy]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery || activeCategory || sortBy !== 'default';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8">
      {/* Header - Marketplace Style */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="px-4 py-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Top Row - Mobile only */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h1 className="text-xl font-black text-[var(--color-primary)]">finango</h1>
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg)] text-sm font-medium text-[var(--color-text-secondary)]"
              >
                <Globe size={12} />
                <span className="uppercase">{locale}</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'ja' ? '銘柄名、カテゴリで検索...' : 'Search assets, categories...'}
                className="w-full pl-11 pr-20 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 rounded-lg hover:bg-[var(--color-border)] text-[var(--color-text-muted)]"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters || hasActiveFilters
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'hover:bg-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  <SlidersHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 md:px-8 border-t border-[var(--color-border)] bg-[var(--color-bg)]/50">
            <div className="max-w-6xl mx-auto pt-4">
              {/* Sort & View Options */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-[var(--color-text-muted)]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="default">{locale === 'ja' ? 'デフォルト' : 'Default'}</option>
                    <option value="name">{locale === 'ja' ? '名前順' : 'By Name'}</option>
                    <option value="category">{locale === 'ja' ? 'カテゴリ順' : 'By Category'}</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === null
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  <Tag size={12} />
                  {locale === 'ja' ? 'すべて' : 'All'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'text-white'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                    }`}
                    style={activeCategory === cat.id ? { backgroundColor: cat.color } : undefined}
                  >
                    <CategoryIcon icon={cat.icon} size={12} color={activeCategory === cat.id ? 'white' : cat.color} />
                    <span>{locale === 'ja' ? cat.nameJa : cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-[var(--color-accent)] font-medium hover:underline"
                >
                  {locale === 'ja' ? 'フィルターをクリア' : 'Clear all filters'}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Liked Assets - Quick Access */}
          {likedAssets.length > 0 && !searchQuery && !activeCategory && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-[var(--color-text)]">
                  <Heart size={14} className="text-rose-500" fill="currentColor" />
                  {locale === 'ja' ? 'お気に入り' : 'Favorites'}
                  <span className="text-sm font-normal text-[var(--color-text-muted)]">
                    ({likedAssets.length})
                  </span>
                </h2>
                <Link
                  href="/portfolio"
                  className="text-sm text-[var(--color-accent)] font-medium hover:underline"
                >
                  {locale === 'ja' ? 'すべて見る' : 'View all'}
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {likedAssets.slice(0, 5).map((asset) => asset && (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="flex-shrink-0 w-32 group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="128px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-white/90 rounded text-sm font-semibold text-[var(--color-text)]">
                        {asset.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                      {asset.name}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Results Header */}
          {(searchQuery || activeCategory) && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                {filteredAssets.length} {locale === 'ja' ? '件の検索結果' : 'results found'}
              </p>
            </div>
          )}

          {/* Asset Grid/List */}
          {filteredAssets.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="group bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <button
                        onClick={(e) => handleLike(e, asset.id)}
                        className={`absolute top-2 right-2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 ${
                          isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                        } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                      >
                        <Heart size={16} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                      </button>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                        <span
                          className="px-2 py-1 rounded text-sm font-semibold text-white"
                          style={{ backgroundColor: categories.find(c => c.id === asset.categoryId)?.color || 'var(--color-accent)' }}
                        >
                          {asset.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                        {asset.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/asset/${asset.id}`}
                    className="group flex gap-4 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all"
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="128px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded text-sm font-semibold text-white"
                          style={{ backgroundColor: categories.find(c => c.id === asset.categoryId)?.color || 'var(--color-accent)' }}
                        >
                          {asset.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[var(--color-text)] line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                        {asset.shortDescription}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleLike(e, asset.id)}
                      className={`self-center w-11 h-11 rounded-full bg-[var(--color-bg)] flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 ${
                        isLiked(asset.id) ? 'text-rose-500' : 'text-[var(--color-text-muted)]'
                      } ${likeAnimation === asset.id ? 'animate-heart-pop' : ''}`}
                    >
                      <Heart size={18} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
                    </button>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[var(--color-border)] flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-[var(--color-text-muted)]" />
              </div>
              <p className="text-[var(--color-text-secondary)] font-medium mb-2">
                {locale === 'ja'
                  ? '該当する銘柄が見つかりませんでした'
                  : 'No assets found'}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {locale === 'ja'
                  ? '検索条件を変更してお試しください'
                  : 'Try adjusting your search or filters'}
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {locale === 'ja' ? 'フィルターをクリア' : 'Clear filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
