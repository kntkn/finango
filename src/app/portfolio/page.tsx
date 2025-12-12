'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPortfolio, getAssetById, getCategoryById, categories } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import { ChevronRight, ExternalLink, Globe, Briefcase, Store, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8 md:pl-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-3 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-[var(--color-accent)]" />
            <h1 className="text-lg font-bold text-[var(--color-text)]">{t('portfolio.title')}</h1>
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

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {portfolioData.items.length > 0 ? (
            <>
              {/* Portfolio Summary */}
              <div className="md:grid md:grid-cols-2 md:gap-6 mb-8">
                {/* Chart */}
                <div className="mb-6 md:mb-0">
                  <h2 className="text-base font-semibold mb-3 text-[var(--color-text)]">{t('portfolio.holdings')}</h2>
                  <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
                    <PortfolioChart
                      data={portfolioData.chartData}
                      total={portfolioData.total}
                    />
                  </div>
                </div>

                {/* Total Value */}
                <div>
                  <h2 className="text-base font-semibold mb-3 text-[var(--color-text)]">
                    {locale === 'ja' ? '総資産額' : 'Total Value'}
                  </h2>
                  <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
                    <p className="text-3xl font-bold text-[var(--color-accent)]">
                      {formatCurrency(portfolioData.total)}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {portfolioData.items.length} {locale === 'ja' ? '銘柄' : 'assets'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Market Access - Quick Links */}
              {portfolioData.uniqueCategories.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-[var(--color-text)]">
                    <Store size={18} className="text-emerald-600" />
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
                          className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-md transition-all group"
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                              {locale === 'ja' ? category.nameJa : category.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {locale === 'ja' ? '売買可能' : 'Trade available'}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Assets List */}
              <section className="mb-8">
                <h2 className="text-base font-semibold mb-3 text-[var(--color-text)]">{t('portfolio.assets')}</h2>
                <div className="space-y-3">
                  {portfolioData.items.map((item, index) => (
                    <div
                      key={item.assetId}
                      className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
                    >
                      <Link
                        href={`/asset/${item.assetId}`}
                        className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg)] transition-colors"
                      >
                        {/* Image */}
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
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
                          <h3 className="font-semibold text-sm text-[var(--color-text)] truncate">
                            {item.asset?.name}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {locale === 'ja' ? item.category?.nameJa : item.category?.name} • {formatDate(item.purchaseDate)}
                          </p>
                          <p className="text-sm font-bold mt-1 text-[var(--color-accent)]">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight size={18} className="text-[var(--color-text-muted)] flex-shrink-0" />
                      </Link>

                      {/* Secondary Market Button */}
                      <div className="px-4 pb-3">
                        <Link
                          href={`/market/${item.asset?.categoryId}`}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--color-bg)] hover:bg-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] transition-colors"
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
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5">
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{t('portfolio.sell')}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    {t('portfolio.sellNote')}
                  </p>
                  <a
                    href="https://ango.jp/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-[var(--color-border)] rounded-lg font-medium text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
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
              <div className="w-16 h-16 rounded-full bg-[var(--color-border)] flex items-center justify-center mb-5">
                <Briefcase size={28} className="text-[var(--color-text-muted)]" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">{t('portfolio.empty')}</h2>
              <p className="text-[var(--color-text-muted)] text-center text-sm max-w-xs mb-6">
                {t('portfolio.emptyHint')}
              </p>
              <Link
                href="/search"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
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
