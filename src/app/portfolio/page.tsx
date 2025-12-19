'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPortfolio, mockTokens, getAssetById, getProjectByAsset, projects } from '@/data/projects';
import { useI18n } from '@/lib/i18n';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import { ChevronRight, ExternalLink, Globe, Briefcase, TrendingUp, Flag, Coins, Wallet, MessageCircle, Bell, CheckCircle, Wine, Leaf, Sparkles, Home, Palmtree, Mountain, Rocket, Clapperboard } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; color?: string }>> = {
  wine: Wine,
  leaf: Leaf,
  sparkles: Sparkles,
  home: Home,
  palmtree: Palmtree,
  mountain: Mountain,
  flag: Flag,
  rocket: Rocket,
  clapperboard: Clapperboard,
};

export default function PortfolioPage() {
  const { t, locale, setLocale } = useI18n();
  const [lineConnected, setLineConnected] = useState(false);

  // Calculate portfolio data
  const portfolioData = useMemo(() => {
    const items = mockPortfolio.map(item => {
      const asset = getAssetById(item.assetId);
      const project = asset ? getProjectByAsset(asset.id) : null;
      const totalValue = item.quantity * item.purchasePrice;
      return {
        ...item,
        asset,
        project,
        totalValue,
      };
    }).filter(item => item.asset);

    // Group by project for chart
    const projectTotals = items.reduce((acc, item) => {
      const projectId = item.project?.id || 'unknown';
      if (!acc[projectId]) {
        acc[projectId] = 0;
      }
      acc[projectId] += item.totalValue;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(projectTotals).map(([projectId, value]) => {
      const project = projects.find(p => p.id === projectId);
      return {
        name: locale === 'ja' ? (project?.nameJa || 'その他') : (project?.name || 'Other'),
        value,
        color: project?.color || '#6b7280',
      };
    });

    // Cash equivalent (RWA holdings value)
    const cashEquivalent = items.reduce((sum, item) => sum + item.totalValue, 0);

    // Token total value
    const tokenTotalValue = mockTokens.reduce((sum, token) => sum + (token.balance * token.valuePerToken), 0);

    // Total portfolio value
    const total = cashEquivalent + tokenTotalValue;

    // Get unique projects from portfolio
    const uniqueProjects = [...new Set(items.map(item => item.project?.id))].filter(Boolean);

    return { items, chartData, cashEquivalent, tokenTotalValue, total, uniqueProjects };
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

  const handleLineConnect = () => {
    // Mock LINE connection
    setLineConnected(true);
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
          {portfolioData.items.length > 0 || mockTokens.length > 0 ? (
            <>
              {/* LINE Integration Section */}
              <section className="mb-6">
                <div className={`bg-white rounded-xl border ${lineConnected ? 'border-green-200' : 'border-[var(--color-border)]'} p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lineConnected ? 'bg-green-100' : 'bg-[#06C755]/10'}`}>
                      <MessageCircle size={20} className={lineConnected ? 'text-green-600' : 'text-[#06C755]'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--color-ink)]">
                        {locale === 'ja' ? 'LINE連携' : 'LINE Integration'}
                      </h3>
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {lineConnected
                          ? (locale === 'ja' ? '連携済み' : 'Connected')
                          : (locale === 'ja' ? '未連携' : 'Not connected')}
                      </p>
                    </div>
                    {lineConnected && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                  </div>

                  {!lineConnected ? (
                    <>
                      <button
                        onClick={handleLineConnect}
                        className="w-full py-3 px-4 bg-[#06C755] text-white rounded-xl font-semibold text-sm hover:bg-[#05b04c] transition-colors flex items-center justify-center gap-2 mb-3"
                      >
                        <MessageCircle size={18} />
                        {locale === 'ja' ? 'LINEで連携する' : 'Connect with LINE'}
                      </button>
                      <ul className="space-y-1.5 text-xs text-[var(--color-ink-muted)]">
                        <li className="flex items-center gap-2">
                          <Bell size={12} />
                          {locale === 'ja' ? '購入通知を受け取れます' : 'Receive purchase notifications'}
                        </li>
                        <li className="flex items-center gap-2">
                          <TrendingUp size={12} />
                          {locale === 'ja' ? '価格変動アラート' : 'Price change alerts'}
                        </li>
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm text-[var(--color-ink-secondary)]">
                      {locale === 'ja'
                        ? '購入通知と価格変動アラートを受け取ります。'
                        : 'You will receive purchase notifications and price alerts.'}
                    </p>
                  )}
                </div>
              </section>

              {/* Total Value Card */}
              <section className="mb-6">
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Flag size={14} className="text-[var(--color-primary)]" />
                    <span className="text-sm font-semibold text-[var(--color-primary)]">
                      {locale === 'ja' ? '総資産' : 'Total Assets'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[var(--color-ink)] tracking-tight mb-4">
                    {formatCurrency(portfolioData.total)}
                  </p>

                  {/* Cash vs Token Split - Desktop side by side, Mobile stacked */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                    {/* Cash Equivalent */}
                    <div className="bg-[var(--color-bg)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet size={16} className="text-[var(--color-ink-muted)]" />
                        <span className="text-sm font-medium text-[var(--color-ink-secondary)]">
                          {locale === 'ja' ? '現金相当（RWA評価額）' : 'Cash Equivalent (RWA Value)'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-[var(--color-ink)]">
                        {formatCurrency(portfolioData.cashEquivalent)}
                      </p>
                      <div className="mt-2 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-primary)] rounded-full"
                          style={{ width: `${(portfolioData.cashEquivalent / portfolioData.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                        {Math.round((portfolioData.cashEquivalent / portfolioData.total) * 100)}%
                      </p>
                    </div>

                    {/* Token Holdings */}
                    <div className="bg-[var(--color-bg)] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins size={16} className="text-[var(--color-ink-muted)]" />
                        <span className="text-sm font-medium text-[var(--color-ink-secondary)]">
                          {locale === 'ja' ? 'トークン保有' : 'Token Holdings'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-[var(--color-ink)]">
                        {formatCurrency(portfolioData.tokenTotalValue)}
                      </p>

                      {/* Token List */}
                      <div className="mt-3 space-y-2">
                        {mockTokens.map((token) => (
                          <div key={token.tokenId} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: token.color }}
                              >
                                {token.symbol[0]}
                              </div>
                              <span className="text-sm text-[var(--color-ink-secondary)]">{token.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-[var(--color-ink)]">
                                {token.balance.toLocaleString()}
                              </span>
                              <span className="text-xs text-[var(--color-ink-muted)] ml-1">
                                ({formatCurrency(token.balance * token.valuePerToken)})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)]">{locale === 'ja' ? '保有銘柄' : 'Holdings'}</p>
                      <p className="text-lg font-semibold text-[var(--color-ink)]">{portfolioData.items.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)]">{locale === 'ja' ? 'プロジェクト' : 'Projects'}</p>
                      <p className="text-lg font-semibold text-[var(--color-ink)]">{portfolioData.uniqueProjects.length}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Portfolio Chart */}
              <section className="mb-8">
                <h2 className="text-base font-semibold mb-3 text-[var(--color-ink)]">
                  {locale === 'ja' ? 'プロジェクト別構成' : 'Portfolio by Project'}
                </h2>
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                  <PortfolioChart
                    data={portfolioData.chartData}
                    total={portfolioData.cashEquivalent}
                  />
                </div>
              </section>

              {/* Assets List */}
              <section className="mb-8">
                <h2 className="text-base font-semibold mb-3 text-[var(--color-ink)]">
                  {locale === 'ja' ? '保有アセット' : 'Your Assets'}
                </h2>
                <div className="space-y-3">
                  {portfolioData.items.map((item) => {
                    const IconComponent = item.project ? (iconMap[item.project.icon] || Sparkles) : Sparkles;
                    return (
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
                                alt={locale === 'ja' ? item.asset.nameJa : item.asset.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-[var(--color-ink)] truncate">
                              {locale === 'ja' ? item.asset?.nameJa : item.asset?.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.project && (
                                <span
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium text-white"
                                  style={{ backgroundColor: item.project.color }}
                                >
                                  <IconComponent size={10} />
                                  {locale === 'ja' ? item.project.nameJa : item.project.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                              {item.quantity} {locale === 'ja' ? '口' : 'units'} • {formatDate(item.purchaseDate)}
                            </p>
                          </div>

                          {/* Value */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-[var(--color-primary)]">
                              {formatCurrency(item.totalValue)}
                            </p>
                            <p className="text-xs text-[var(--color-ink-muted)]">
                              @{formatCurrency(item.purchasePrice)}
                            </p>
                          </div>

                          <ChevronRight size={18} className="text-[var(--color-ink-muted)] flex-shrink-0" />
                        </Link>

                        {/* Project Link */}
                        {item.project && (
                          <div className="px-4 pb-3">
                            <Link
                              href={`/project/${item.project.id}`}
                              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--color-bg)] hover:bg-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-ink-secondary)] transition-colors"
                            >
                              <IconComponent size={14} color={item.project.color} />
                              <span>{locale === 'ja' ? 'プロジェクト詳細' : 'View Project'}</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* External Link Section */}
              <section>
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                  <h3 className="font-semibold text-[var(--color-ink)] mb-2">
                    {locale === 'ja' ? 'アセットの売却' : 'Sell Your Assets'}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-secondary)] mb-4">
                    {locale === 'ja'
                      ? 'ANGOの公式サイトで保有アセットの売却・管理ができます。'
                      : 'Manage and sell your assets on the official ANGO website.'}
                  </p>
                  <a
                    href="https://ango.jp/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-[var(--color-border)] rounded-xl font-medium text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <span>{locale === 'ja' ? 'ANGOで管理する' : 'Manage on ANGO'}</span>
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
              <h2 className="text-lg font-bold text-[var(--color-ink)] mb-2">
                {locale === 'ja' ? 'まだ保有アセットがありません' : 'No assets yet'}
              </h2>
              <p className="text-[var(--color-ink-muted)] text-center text-sm max-w-xs mb-6">
                {locale === 'ja'
                  ? 'プロジェクトを探して、RWAアセットを購入しましょう。'
                  : 'Explore projects and start investing in RWA assets.'}
              </p>
              <Link
                href="/search"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
              >
                {locale === 'ja' ? 'プロジェクトを探す' : 'Explore Projects'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
