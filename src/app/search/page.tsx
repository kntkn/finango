'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { projects } from '@/data/projects';
import { Search, Globe, X, SlidersHorizontal, Tag } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';

type CategoryFilter = 'all' | 'membership' | 'nft' | 'investment' | 'experience';

export default function MarketplacePage() {
  const { locale, setLocale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categoryLabels = {
    all: { en: 'All', ja: 'すべて' },
    membership: { en: 'Membership', ja: 'メンバーシップ' },
    nft: { en: 'NFT', ja: 'NFT' },
    investment: { en: 'Investment', ja: '投資' },
    experience: { en: 'Experience', ja: '体験' },
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.nameJa.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.descriptionJa.toLowerCase().includes(query)
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter(project => project.category === activeCategory);
    }

    return result;
  }, [searchQuery, activeCategory]);

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'all';

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="px-4 py-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-[var(--color-primary)]">finango</h1>
              <button
                onClick={toggleLocale}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg)] text-sm font-medium text-[var(--color-text-secondary)]"
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
                placeholder={locale === 'ja' ? 'プロジェクト名で検索...' : 'Search projects...'}
                className="w-full pl-11 pr-20 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
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
                      ? 'bg-[var(--color-primary)] text-white'
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
              {/* Category Filters */}
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <Tag size={12} />
                    {locale === 'ja' ? categoryLabels[cat].ja : categoryLabels[cat].en}
                  </button>
                ))}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-[var(--color-primary)] font-medium hover:underline"
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
          {/* Results Count */}
          {hasActiveFilters && (
            <div className="mb-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                {filteredProjects.length} {locale === 'ja' ? '件のプロジェクト' : 'projects found'}
              </p>
            </div>
          )}

          {/* Project Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[var(--color-border)] flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-[var(--color-text-muted)]" />
              </div>
              <p className="text-[var(--color-text-secondary)] font-medium mb-2">
                {locale === 'ja'
                  ? '該当するプロジェクトが見つかりませんでした'
                  : 'No projects found'}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {locale === 'ja'
                  ? '検索条件を変更してお試しください'
                  : 'Try adjusting your search or filters'}
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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
