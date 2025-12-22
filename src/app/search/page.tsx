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
  Grid3X3,
  Folder,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import AssetCard from '@/components/assets/AssetCard';
import Image from 'next/image';
import Link from 'next/link';

type ViewTab = 'assets' | 'projects';
type SortOption = 'popular' | 'new' | 'price-low' | 'price-high' | 'almost-sold';
type PriceRange = 'all' | 'under-10k' | '10k-50k' | '50k-100k' | '100k-500k' | 'over-500k';

const sortLabels: Record<SortOption, { en: string; ja: string; icon: typeof Sparkles }> = {
  popular: { en: 'Popular', ja: '人気順', icon: Sparkles },
  new: { en: 'Newest', ja: '新着順', icon: Clock },
  'price-low': { en: 'Price: Low', ja: '価格↑', icon: TrendingUp },
  'price-high': { en: 'Price: High', ja: '価格↓', icon: TrendingUp },
  'almost-sold': { en: 'Hot', ja: '残りわずか', icon: Flame },
};

const priceRangeLabels: Record<PriceRange, { en: string; ja: string }> = {
  all: { en: 'All', ja: 'すべて' },
  'under-10k': { en: '~¥10K', ja: '~1万' },
  '10k-50k': { en: '¥10K-50K', ja: '1-5万' },
  '50k-100k': { en: '¥50K-100K', ja: '5-10万' },
  '100k-500k': { en: '¥100K-500K', ja: '10-50万' },
  'over-500k': { en: '¥500K+', ja: '50万+' },
};

// Category colors for project cards
const categoryColors: Record<string, { bg: string; text: string }> = {
  membership: { bg: 'bg-blue-50', text: 'text-blue-600' },
  nft: { bg: 'bg-purple-50', text: 'text-purple-600' },
  investment: { bg: 'bg-amber-50', text: 'text-amber-600' },
  experience: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

const categoryLabels: Record<string, { en: string; ja: string }> = {
  membership: { en: 'Membership', ja: 'メンバーシップ' },
  nft: { en: 'NFT', ja: 'NFT' },
  investment: { en: 'Investment', ja: '投資' },
  experience: { en: 'Experience', ja: '体験' },
};

export default function MarketsPage() {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState<ViewTab>('assets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter assets
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

    // Project filter (when viewing from projects tab)
    if (selectedProject) {
      result = result.filter((asset) => asset.projectId === selectedProject);
    }

    // Price range filter
    if (priceRange !== 'all') {
      result = result.filter((asset) => {
        switch (priceRange) {
          case 'under-10k': return asset.price < 10000;
          case '10k-50k': return asset.price >= 10000 && asset.price < 50000;
          case '50k-100k': return asset.price >= 50000 && asset.price < 100000;
          case '100k-500k': return asset.price >= 100000 && asset.price < 500000;
          case 'over-500k': return asset.price >= 500000;
          default: return true;
        }
      });
    }

    // Sorting
    switch (sortOption) {
      case 'popular':
        result.sort((a, b) => b.sold - a.sold);
        break;
      case 'new':
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
  }, [searchQuery, selectedProject, priceRange, sortOption]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProject(null);
    setPriceRange('all');
    setSortOption('popular');
  };

  const hasActiveFilters = searchQuery || selectedProject || priceRange !== 'all';

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
    setActiveTab('assets');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveTab('projects');
  };

  const currentProject = selectedProject ? getProjectById(selectedProject) : null;
  const SortIcon = sortLabels[sortOption].icon;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)]">
        <div className="px-4 md:px-8 py-3 md:py-4">
          <div className="max-w-7xl mx-auto">
            {/* Top Row: Logo + Search */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Logo */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <h1 className="text-xl font-bold text-[var(--color-primary)]">finango</h1>
              </div>

              {/* Mobile Logo */}
              <div className="md:hidden flex items-center gap-2 flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">F</span>
                </div>
                <h1 className="text-lg font-bold text-[var(--color-primary)]">finango</h1>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'ja' ? '検索...' : 'Search...'}
                  className="w-full pl-9 md:pl-11 pr-8 py-2 md:py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-ink-muted)]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--color-border)] text-[var(--color-ink-muted)]"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mt-3 md:mt-4 -mx-1">
              <button
                onClick={() => {
                  setActiveTab('assets');
                  setSelectedProject(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'assets'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg)]'
                }`}
              >
                <Grid3X3 size={16} />
                <span>{locale === 'ja' ? 'アセット' : 'Assets'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setSelectedProject(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'projects'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg)]'
                }`}
              >
                <Folder size={16} />
                <span>{locale === 'ja' ? 'プロジェクト' : 'Projects'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Project Header */}
        {selectedProject && currentProject && (
          <div className="px-4 md:px-8 py-3 bg-gradient-to-r from-[var(--color-bg)] to-white border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <button
                onClick={handleBackToProjects}
                className="p-2 -ml-2 rounded-lg hover:bg-white transition-colors"
              >
                <ArrowLeft size={18} className="text-[var(--color-ink-secondary)]" />
              </button>
              <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 shadow-sm">
                <Image
                  src={currentProject.image}
                  alt={locale === 'ja' ? currentProject.nameJa : currentProject.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-[var(--color-ink)] truncate">
                  {locale === 'ja' ? currentProject.nameJa : currentProject.name}
                </h2>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {filteredAssets.length} {locale === 'ja' ? '件のアセット' : 'assets'}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 py-6">
        {activeTab === 'assets' ? (
          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="w-56 flex-shrink-0">
              <div className="sticky top-[140px] space-y-6">
                {/* Sort */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                    {locale === 'ja' ? '並び替え' : 'Sort'}
                  </h3>
                  <div className="space-y-1">
                    {(Object.keys(sortLabels) as SortOption[]).map((option) => {
                      const Icon = sortLabels[option].icon;
                      return (
                        <button
                          key={option}
                          onClick={() => setSortOption(option)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                            sortOption === option
                              ? 'bg-[var(--color-primary-bg)] text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg)]'
                          }`}
                        >
                          <Icon size={14} />
                          {locale === 'ja' ? sortLabels[option].ja : sortLabels[option].en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                    {locale === 'ja' ? '価格帯' : 'Price'}
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
                    {locale === 'ja' ? 'クリア' : 'Clear filters'}
                  </button>
                )}
              </div>
            </aside>

            {/* Asset Grid */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[var(--color-ink-secondary)]">
                  <span className="font-semibold text-[var(--color-ink)]">{filteredAssets.length}</span>{' '}
                  {locale === 'ja' ? '件のアセット' : 'assets'}
                </p>
              </div>

              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              ) : (
                <EmptyState locale={locale} onClear={clearFilters} />
              )}
            </main>
          </div>
        ) : (
          /* Projects Grid */
          <div>
            <p className="text-sm text-[var(--color-ink-secondary)] mb-6">
              <span className="font-semibold text-[var(--color-ink)]">{projects.length}</span>{' '}
              {locale === 'ja' ? 'プロジェクト' : 'projects'}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                  assetCount={assets.filter(a => a.projectId === project.id).length}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <main className="md:hidden px-4 py-4 pb-28">
        {activeTab === 'assets' ? (
          <>
            {/* Sort & Filter Pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {/* Sort Dropdown */}
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--color-border)] rounded-full text-xs font-medium text-[var(--color-ink-secondary)]"
              >
                <SortIcon size={12} />
                <span>{locale === 'ja' ? sortLabels[sortOption].ja : sortLabels[sortOption].en}</span>
                <ChevronDown size={10} />
              </button>

              {/* Price Pills */}
              {(Object.keys(priceRangeLabels) as PriceRange[]).slice(1).map((range) => (
                <button
                  key={range}
                  onClick={() => setPriceRange(priceRange === range ? 'all' : range)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    priceRange === range
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-secondary)]'
                  }`}
                >
                  {locale === 'ja' ? priceRangeLabels[range].ja : priceRangeLabels[range].en}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-sm text-[var(--color-ink-secondary)] mb-4">
              <span className="font-semibold text-[var(--color-ink)]">{filteredAssets.length}</span>{' '}
              {locale === 'ja' ? '件' : 'assets'}
            </p>

            {/* Asset Grid */}
            {filteredAssets.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <EmptyState locale={locale} onClear={clearFilters} />
            )}
          </>
        ) : (
          /* Projects Grid - Mobile */
          <div>
            <p className="text-sm text-[var(--color-ink-secondary)] mb-4">
              <span className="font-semibold text-[var(--color-ink)]">{projects.length}</span>{' '}
              {locale === 'ja' ? 'プロジェクト' : 'projects'}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                  assetCount={assets.filter(a => a.projectId === project.id).length}
                  onClick={() => handleProjectClick(project.id)}
                  mobile
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sort Dropdown */}
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

      {/* Mobile Filters Bottom Sheet */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto animate-slide-up">
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

            <div className="p-4 space-y-6 pb-32">
              {/* Sort */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                  {locale === 'ja' ? '並び替え' : 'Sort'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortOption(option)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        sortOption === option
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-bg)] text-[var(--color-ink-secondary)] border border-[var(--color-border)]'
                      }`}
                    >
                      {locale === 'ja' ? sortLabels[option].ja : sortLabels[option].en}
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
                {locale === 'ja' ? `${filteredAssets.length}件を表示` : `Show ${filteredAssets.length}`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  locale,
  assetCount,
  onClick,
  mobile = false,
}: {
  project: typeof projects[0];
  locale: 'ja' | 'en';
  assetCount: number;
  onClick: () => void;
  mobile?: boolean;
}) {
  const colors = categoryColors[project.category] || categoryColors.nft;
  const label = categoryLabels[project.category] || categoryLabels.nft;

  if (mobile) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all text-left"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden relative flex-shrink-0">
          <Image
            src={project.image}
            alt={locale === 'ja' ? project.nameJa : project.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
              {locale === 'ja' ? label.ja : label.en}
            </span>
          </div>
          <h3 className="font-bold text-[var(--color-ink)] truncate">
            {locale === 'ja' ? project.nameJa : project.name}
          </h3>
          <p className="text-xs text-[var(--color-ink-muted)]">
            {assetCount} {locale === 'ja' ? 'アセット' : 'assets'}
          </p>
        </div>
        <ChevronRight size={20} className="text-[var(--color-ink-muted)] flex-shrink-0" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all text-left"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={project.image}
          alt={locale === 'ja' ? project.nameJa : project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {locale === 'ja' ? label.ja : label.en}
          </span>
        </div>

        {/* Project Name Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg truncate">
            {locale === 'ja' ? project.nameJa : project.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-[var(--color-ink-secondary)] line-clamp-2 mb-3">
          {locale === 'ja' ? project.descriptionJa : project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-ink)]">
            {assetCount} {locale === 'ja' ? 'アセット' : 'assets'}
          </span>
          <span className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium">
            {locale === 'ja' ? '詳細' : 'View'}
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </button>
  );
}

// Empty State Component
function EmptyState({ locale, onClear }: { locale: 'ja' | 'en'; onClear: () => void }) {
  return (
    <div className="text-center py-12 md:py-16">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--color-border)] flex items-center justify-center mx-auto mb-3 md:mb-4">
        <Search size={20} className="text-[var(--color-ink-muted)] md:w-6 md:h-6" />
      </div>
      <p className="text-[var(--color-ink-secondary)] font-medium mb-1 md:mb-2">
        {locale === 'ja' ? '該当するアセットが見つかりません' : 'No assets found'}
      </p>
      <p className="text-sm text-[var(--color-ink-muted)] mb-4">
        {locale === 'ja' ? '条件を変更してお試しください' : 'Try adjusting your filters'}
      </p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {locale === 'ja' ? 'フィルターをクリア' : 'Clear filters'}
      </button>
    </div>
  );
}
