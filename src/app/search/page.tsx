'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { projects, assets, getProjectById } from '@/data/projects';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Clock,
  Flame,
} from 'lucide-react';
import AssetCard from '@/components/assets/AssetCard';

type CategoryFilter = 'all' | 'membership' | 'nft' | 'investment' | 'experience';
type SortOption = 'popular' | 'new' | 'price-low' | 'price-high' | 'almost-sold';
type PriceRange = 'all' | 'under-10k' | '10k-50k' | '50k-100k' | '100k-500k' | 'over-500k';

const categoryLabels: Record<CategoryFilter, { en: string; ja: string }> = {
  all: { en: 'All Types', ja: 'すべて' },
  membership: { en: 'Membership', ja: 'メンバーシップ' },
  nft: { en: 'NFT', ja: 'NFT' },
  investment: { en: 'Investment', ja: '投資' },
  experience: { en: 'Experience', ja: '体験' },
};

const sortLabels: Record<SortOption, { en: string; ja: string; icon: typeof Sparkles }> = {
  popular: { en: 'Popular', ja: '人気順', icon: Sparkles },
  new: { en: 'Newest', ja: '新着順', icon: Clock },
  'price-low': { en: 'Price: Low to High', ja: '価格が安い順', icon: TrendingUp },
  'price-high': { en: 'Price: High to Low', ja: '価格が高い順', icon: TrendingUp },
  'almost-sold': { en: 'Almost Sold Out', ja: '残りわずか', icon: Flame },
};

const priceRangeLabels: Record<PriceRange, { en: string; ja: string }> = {
  all: { en: 'All Prices', ja: 'すべての価格帯' },
  'under-10k': { en: 'Under ¥10,000', ja: '¥10,000未満' },
  '10k-50k': { en: '¥10,000 - ¥50,000', ja: '¥10,000 - ¥50,000' },
  '50k-100k': { en: '¥50,000 - ¥100,000', ja: '¥50,000 - ¥100,000' },
  '100k-500k': { en: '¥100,000 - ¥500,000', ja: '¥100,000 - ¥500,000' },
  'over-500k': { en: 'Over ¥500,000', ja: '¥500,000以上' },
};

export default function MarketsPage() {
  const { locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((asset) => {
        const project = getProjectById(asset.projectId);
        return (
          asset.name.toLowerCase().includes(query) ||
          asset.nameJa.toLowerCase().includes(query) ||
          project?.name.toLowerCase().includes(query) ||
          project?.nameJa.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((asset) => {
        const project = getProjectById(asset.projectId);
        return project?.category === activeCategory;
      });
    }

    // Price range filter
    if (priceRange !== 'all') {
      result = result.filter((asset) => {
        switch (priceRange) {
          case 'under-10k':
            return asset.price < 10000;
          case '10k-50k':
            return asset.price >= 10000 && asset.price < 50000;
          case '50k-100k':
            return asset.price >= 50000 && asset.price < 100000;
          case '100k-500k':
            return asset.price >= 100000 && asset.price < 500000;
          case 'over-500k':
            return asset.price >= 500000;
          default:
            return true;
        }
      });
    }

    // Sorting
    switch (sortOption) {
      case 'popular':
        result.sort((a, b) => b.sold - a.sold);
        break;
      case 'new':
        // Assuming newer assets are at the end of the array
        result.reverse();
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'almost-sold':
        result.sort((a, b) => {
          const aPercent = a.sold / (a.sold + a.available);
          const bPercent = b.sold / (b.sold + b.available);
          return bPercent - aPercent;
        });
        break;
    }

    return result;
  }, [searchQuery, activeCategory, priceRange, sortOption]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceRange('all');
    setSortOption('popular');
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'all' || priceRange !== 'all';
  const activeFilterCount = [
    activeCategory !== 'all',
    priceRange !== 'all',
    searchQuery.trim(),
  ].filter(Boolean).length;

  const SortIcon = sortLabels[sortOption].icon;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-[var(--color-border)]">
        <div className="px-8 py-4">
          <div className="max-w-7xl mx-auto">
            {/* Top Row: Logo + Search + Sort */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <h1 className="text-xl font-bold text-[var(--color-primary)] flex-shrink-0">finango</h1>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'ja' ? 'アセットを検索...' : 'Search assets...'}
                  className="w-full pl-11 pr-10 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-border)] text-[var(--color-ink-muted)]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] transition-all"
                >
                  <SortIcon size={16} />
                  <span>{locale === 'ja' ? sortLabels[sortOption].ja : sortLabels[sortOption].en}</span>
                  <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[var(--color-border)] rounded-xl shadow-lg z-50 overflow-hidden">
                      {(Object.keys(sortLabels) as SortOption[]).map((option) => {
                        const Icon = sortLabels[option].icon;
                        return (
                          <button
                            key={option}
                            onClick={() => {
                              setSortOption(option);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-[var(--color-bg)] transition-colors ${
                              sortOption === option ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-medium' : 'text-[var(--color-ink-secondary)]'
                            }`}
                          >
                            <Icon size={14} />
                            {locale === 'ja' ? sortLabels[option].ja : sortLabels[option].en}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-[var(--color-border)]">
        <div className="px-4 py-3">
          {/* Logo */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-[var(--color-primary)]">finango</h1>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'ja' ? '検索...' : 'Search...'}
                className="w-full pl-9 pr-8 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-ink-muted)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className={`relative flex items-center justify-center w-11 h-11 rounded-xl border transition-all ${
                hasActiveFilters
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                  : 'bg-white border-[var(--color-border)] text-[var(--color-ink-muted)]'
              }`}
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-sun)] text-[var(--color-ink)] text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop: Sidebar + Content */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 py-6 gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-[100px] space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                {locale === 'ja' ? 'アセットタイプ' : 'Asset Type'}
              </h3>
              <div className="space-y-1">
                {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeCategory === cat
                        ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg)]'
                    }`}
                  >
                    {locale === 'ja' ? categoryLabels[cat].ja : categoryLabels[cat].en}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                {locale === 'ja' ? '価格帯' : 'Price Range'}
              </h3>
              <div className="space-y-1">
                {(Object.keys(priceRangeLabels) as PriceRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setPriceRange(range)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      priceRange === range
                        ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg)]'
                    }`}
                  >
                    {locale === 'ja' ? priceRangeLabels[range].ja : priceRangeLabels[range].en}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-[var(--color-primary)] font-medium hover:underline"
              >
                {locale === 'ja' ? 'フィルターをクリア' : 'Clear all filters'}
              </button>
            )}
          </div>
        </aside>

        {/* Right Content - Asset Grid */}
        <main className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[var(--color-ink-secondary)]">
              <span className="font-semibold text-[var(--color-ink)]">{filteredAssets.length}</span>{' '}
              {locale === 'ja' ? '件のアセット' : 'assets'}
            </p>
          </div>

          {/* Asset Grid */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[var(--color-border)] flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-[var(--color-ink-muted)]" />
              </div>
              <p className="text-[var(--color-ink-secondary)] font-medium mb-2">
                {locale === 'ja' ? '該当するアセットが見つかりませんでした' : 'No assets found'}
              </p>
              <p className="text-sm text-[var(--color-ink-muted)] mb-4">
                {locale === 'ja' ? '検索条件を変更してお試しください' : 'Try adjusting your search or filters'}
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {locale === 'ja' ? 'フィルターをクリア' : 'Clear filters'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile: Asset Grid */}
      <main className="md:hidden px-4 py-4 pb-28">
        {/* Results Count + Sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--color-ink-secondary)]">
            <span className="font-semibold text-[var(--color-ink)]">{filteredAssets.length}</span>{' '}
            {locale === 'ja' ? '件' : 'assets'}
          </p>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 text-sm text-[var(--color-ink-secondary)]"
          >
            <SortIcon size={14} />
            <span>{locale === 'ja' ? sortLabels[sortOption].ja : sortLabels[sortOption].en}</span>
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Sort Dropdown for Mobile */}
        {showSortDropdown && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowSortDropdown(false)} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-4 pb-8 animate-slide-up">
              <div className="w-12 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-4" />
              <h3 className="text-center font-semibold text-[var(--color-ink)] mb-4">
                {locale === 'ja' ? '並び替え' : 'Sort by'}
              </h3>
              <div className="space-y-1">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => {
                  const Icon = sortLabels[option].icon;
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${
                        sortOption === option
                          ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)]'
                          : 'text-[var(--color-ink-secondary)]'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">
                        {locale === 'ja' ? sortLabels[option].ja : sortLabels[option].en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Asset Grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-[var(--color-border)] flex items-center justify-center mx-auto mb-3">
              <Search size={20} className="text-[var(--color-ink-muted)]" />
            </div>
            <p className="text-[var(--color-ink-secondary)] font-medium mb-1">
              {locale === 'ja' ? '該当なし' : 'No results'}
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-[var(--color-primary)] font-medium"
            >
              {locale === 'ja' ? 'クリア' : 'Clear'}
            </button>
          </div>
        )}
      </main>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-[var(--color-ink)]">
                {locale === 'ja' ? 'フィルター' : 'Filters'}
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 -mr-2 text-[var(--color-ink-muted)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-6 pb-32">
              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                  {locale === 'ja' ? 'アセットタイプ' : 'Asset Type'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-bg)] text-[var(--color-ink-secondary)] border border-[var(--color-border)]'
                      }`}
                    >
                      {locale === 'ja' ? categoryLabels[cat].ja : categoryLabels[cat].en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                  {locale === 'ja' ? '価格帯' : 'Price Range'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(priceRangeLabels) as PriceRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setPriceRange(range)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        priceRange === range
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-bg)] text-[var(--color-ink-secondary)] border border-[var(--color-border)]'
                      }`}
                    >
                      {locale === 'ja' ? priceRangeLabels[range].ja : priceRangeLabels[range].en}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] p-4 pb-[max(16px,env(safe-area-inset-bottom))] flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 text-sm font-medium text-[var(--color-ink-secondary)] border border-[var(--color-border)] rounded-xl"
              >
                {locale === 'ja' ? 'リセット' : 'Reset'}
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 text-sm font-medium text-white bg-[var(--color-primary)] rounded-xl"
              >
                {locale === 'ja' ? `${filteredAssets.length}件を表示` : `Show ${filteredAssets.length} results`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
