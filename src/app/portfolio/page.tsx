'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPortfolio, getAssetById, getCategoryById, categories } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import { ChevronRight, ExternalLink, Globe, Briefcase, Store, TrendingUp, Flag } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function PortfolioPage() {
  const { t, locale, setLocale } = useI18n();

  // Calculate portfolio data
  const portfolioData = useMemo(() => {
    const items = mockPortfolio.map(item => {
      const asset = getAssetById(item.assetId);
      const category = asset ? getCategoryById(asset.categoryId) : null;
      return {
        ...item,
        asset,
        category,
      };
    }).filter(item => item.asset);

    // Group by category for chart
    const categoryTotals = items.reduce((acc, item) => {
      const categoryId = item.asset?.categoryId || 'unknown';
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += item.amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(categoryTotals).map(([categoryId, value]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: locale === 'ja' ? (category?.nameJa || 'その他') : (category?.name || 'Other'),
        value,
        color: category?.color || '#6b7280',
      };
    });

    const total = items.reduce((sum, item) => sum + item.amount, 0);

    // Get unique categories from portfolio
    const uniqueCategories = [...new Set(items.map(item => item.asset?.categoryId))].filter(Boolean);

    return { items, chartData, total, uniqueCategories };
  }, [locale]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8">
      {/* Header - Mobile only */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-[var(--color-border)] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">finango</h1>
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-subtle)] text-sm font-medium text-[var(--color-ink-secondary)]"
          >
            <Globe size={14} />
            <span className="uppercase text-xs">{locale}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {portfolioData.items.length > 0 ? (
            <>
              {/* Total Value - Clean Trust Style */}
              <div className="mb-6">
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Flag size={14} className="text-[var(--color-mint-dark)]" />
                    <span className="text-sm font-semibold text-[var(--color-mint-dark)]">
                      {locale === 'ja' ? 'マイポートフォリオ' : 'My Portfolio'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[var(--color-ink)] tracking-tight">
                    {formatCurrency(portfolioData.total)}
                  </p>
                  <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)]">{locale === 'ja' ? '保有銘柄' : 'Holdings'}</p>
                      <p className="text-lg font-semibold text-[var(--color-ink)]">{portfolioData.items.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)]">{locale === 'ja' ? 'カテゴリ' : 'Categories'}</p>
                      <p className="text-lg font-semibold text-[var(--color-ink)]">{portfolioData.uniqueCategories.length}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--color-mint-bg)]">
                      <TrendingUp size={14} className="text-[var(--color-mint-dark)]" />
                      <span className="text-sm font-semibold text-[var(--color-mint-dark)]">+12.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Chart */}
              <div className="mb-8">
                <h2 className="text-base font-semibold mb-3 text-[var(--color-ink)]">{t('portfolio.holdings')}</h2>
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                  <PortfolioChart
                    data={portfolioData.chartData}
                    total={portfolioData.total}
                  />
                </div>
              </div>

              {/* Secondary Market Access - Quick Links */}
              {portfolioData.uniqueCategories.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-[var(--color-ink)]">
                    <Store size={18} className="text-[var(--color-mint-dark)]" />
                    {locale === 'ja' ? '二次流通マーケット' : 'Secondary Market'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {portfolioData.uniqueCategories.map((categoryId) => {
                      const category = getCategoryById(categoryId as string);
                      if (!category) return null;
                      return (
                        <Link
                          key={categoryId}
                          href={`/market/${categoryId}`}
                          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group"
                        >
                          <div
                            className="w-11 h-11 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <CategoryIcon icon={category.icon} size={20} color={category.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                              {locale === 'ja' ? category.nameJa : category.name}
                            </p>
                            <p className="text-xs text-[var(--color-ink-muted)]">
                              {locale === 'ja' ? '売買可能' : 'Trade available'}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-[var(--color-ink-muted)] flex-shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Assets List */}
              <section className="mb-8">
                <h2 className="text-base font-semibold mb-3 text-[var(--color-ink)]">{t('portfolio.assets')}</h2>
                <div className="space-y-3">
                  {portfolioData.items.map((item, index) => (
                    <div
                      key={item.assetId}
                      className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden"
                    >
                      <Link
                        href={`/asset/${item.assetId}`}
                        className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg)] transition-colors"
                      >
                        {/* Image */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          {item.asset && (
                            <Image
                              src={item.asset.image}
                              alt={item.asset.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-[var(--color-ink)] truncate">
                            {item.asset?.name}
                          </h3>
                          <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                            {locale === 'ja' ? item.category?.nameJa : item.category?.name} • {formatDate(item.purchaseDate)}
                          </p>
                          <p className="text-sm font-bold mt-1 text-[var(--color-primary)]">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight size={18} className="text-[var(--color-ink-muted)] flex-shrink-0" />
                      </Link>

                      {/* Secondary Market Button */}
                      <div className="px-4 pb-3">
                        <Link
                          href={`/market/${item.asset?.categoryId}`}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--color-bg)] hover:bg-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-ink-secondary)] transition-colors"
                        >
                          <Store size={14} />
                          <span>{locale === 'ja' ? '二次流通で売買' : 'Trade on Secondary Market'}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* External Link Section */}
              <section>
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                  <h3 className="font-semibold text-[var(--color-ink)] mb-2">{t('portfolio.sell')}</h3>
                  <p className="text-sm text-[var(--color-ink-secondary)] mb-4">
                    {t('portfolio.sellNote')}
                  </p>
                  <a
                    href="https://ango.jp/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-[var(--color-border)] rounded-xl font-medium text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <span>{t('portfolio.manageOnAngo')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </section>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-bg)] flex items-center justify-center mb-5">
                <Briefcase size={28} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-ink)] mb-2">{t('portfolio.empty')}</h2>
              <p className="text-[var(--color-ink-muted)] text-center text-sm max-w-xs mb-6">
                {t('portfolio.emptyHint')}
              </p>
              <Link
                href="/search"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
              >
                {locale === 'ja' ? '銘柄を探す' : 'Find Assets'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
