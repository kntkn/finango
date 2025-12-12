'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPortfolio, getAssetById, getCategoryById, categories } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import { ChevronRight, ExternalLink, Globe, Briefcase } from 'lucide-react';

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

    return { items, chartData, total };
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-[var(--color-accent)]" />
            <h1 className="text-xl font-bold">{t('portfolio.title')}</h1>
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
        <div className="max-w-6xl mx-auto">
          {portfolioData.items.length > 0 ? (
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Left Column - Chart */}
              <div className="mb-8 md:mb-0">
                <h2 className="text-lg font-semibold mb-4">{t('portfolio.holdings')}</h2>
                <div className="card p-5">
                  <PortfolioChart
                    data={portfolioData.chartData}
                    total={portfolioData.total}
                  />
                </div>
              </div>

              {/* Right Column - Assets & Actions */}
              <div>
                {/* Assets List */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">{t('portfolio.assets')}</h2>
                  <div className="space-y-3">
                    {portfolioData.items.map((item, index) => (
                      <Link
                        key={item.assetId}
                        href={`/asset/${item.assetId}`}
                        className="flex items-center gap-4 p-4 card card-hover animate-slide-up opacity-0"
                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                      >
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          {item.asset && (
                            <Image
                              src={item.asset.image}
                              alt={item.asset.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {item.asset?.name}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {locale === 'ja' ? item.category?.nameJa : item.category?.name} • {formatDate(item.purchaseDate)}
                          </p>
                          <p className="text-sm font-semibold mt-1 text-[var(--color-accent)]">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight size={20} className="text-[var(--color-text-muted)] flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sell Section */}
                <div className="card p-5">
                  <h3 className="font-semibold mb-2">{t('portfolio.sell')}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    {t('portfolio.sellNote')}
                  </p>
                  <a
                    href="https://ango.jp/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-[var(--color-border)] rounded-xl font-medium text-sm hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <span>{t('portfolio.manageOnAngo')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-[var(--color-border)] flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-[var(--color-text-muted)]" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t('portfolio.empty')}</h2>
              <p className="text-[var(--color-text-muted)] text-center max-w-xs mb-6">
                {t('portfolio.emptyHint')}
              </p>
              <Link
                href="/discover"
                className="btn-primary"
              >
                {t('nav.discover')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
