'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPortfolio, getAssetById, getCategoryById, categories } from '@/data/assets';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import { ChevronRight, ExternalLink } from 'lucide-react';

export default function PortfolioPage() {
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
        name: category?.name || 'Other',
        value,
        color: category?.color || '#6b7280',
      };
    });

    const total = items.reduce((sum, item) => sum + item.amount, 0);

    return { items, chartData, total };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen safe-top">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">finango</h1>
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Portfolio
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {portfolioData.items.length > 0 ? (
          <>
            {/* Chart Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Your Holdings</h2>
              <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
                <PortfolioChart
                  data={portfolioData.chartData}
                  total={portfolioData.total}
                />
              </div>
            </div>

            {/* Assets List */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Your Assets</h2>
              <div className="space-y-3">
                {portfolioData.items.map((item, index) => (
                  <Link
                    key={item.assetId}
                    href={`/asset/${item.assetId}`}
                    className={`
                      flex items-center gap-4 p-4 bg-[var(--color-surface)]
                      rounded-2xl border border-[var(--color-border)] card-hover
                      animate-slide-up opacity-0
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                        {item.category?.name} • Acquired {formatDate(item.purchaseDate)}
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
            <div className="p-5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
              <h3 className="font-semibold mb-2">Want to Sell?</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                All transactions including sales are processed securely on ANGO. Each asset may have different liquidity terms.
              </p>
              <div className="p-3 bg-[var(--color-ai-bg)] border border-[var(--color-ai-border)] rounded-xl mb-4">
                <p className="text-xs text-[var(--color-ai-text)]">
                  ✨ Some assets can be sold immediately, while others may take time depending on their nature. Check each asset&apos;s details for specific terms.
                </p>
              </div>
              <a
                href="https://ango.jp/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2 w-full py-3 px-4
                  border border-[var(--color-border)] rounded-xl
                  font-medium text-sm hover:bg-[var(--color-bg)] transition-colors
                "
              >
                <span>Manage on ANGO</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Assets Yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-xs mx-auto">
              Start exploring and discover real-world assets that match your interests
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-accent)] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
