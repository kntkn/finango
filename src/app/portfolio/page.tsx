'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockPortfolio, mockTokens, tokenBenefits, getBenefitsByToken, getAssetById, getProjectByAsset, projects } from '@/data/projects';
import { useI18n } from '@/lib/i18n';
import PortfolioChart from '@/components/portfolio/PortfolioChart';
import { ChevronRight, ChevronDown, ExternalLink, Globe, Briefcase, TrendingUp, Flag, Coins, Wallet, MessageCircle, Bell, CheckCircle, Wine, Leaf, Sparkles, Home, Palmtree, Mountain, Rocket, Clapperboard, Gift, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showLineSection, setShowLineSection] = useState(false);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

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

    // RWA Total (yen-based, no tokens)
    const rwaTotal = items.reduce((sum, item) => sum + item.totalValue, 0);

    // Get unique projects from portfolio
    const uniqueProjects = [...new Set(items.map(item => item.project?.id))].filter(Boolean);

    return { items, chartData, rwaTotal, uniqueProjects };
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
    setLineConnected(true);
  };

  const toggleTokenExpand = (tokenId: string) => {
    setExpandedToken(expandedToken === tokenId ? null : tokenId);
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
              {/* ============================================ */}
              {/* SECTION 1: RWA TOTAL ASSETS (Yen-based) */}
              {/* ============================================ */}
              <section className="mb-8">
                <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet size={16} className="text-[var(--color-primary)]" />
                    <span className="text-sm font-semibold text-[var(--color-primary)]">
                      {locale === 'ja' ? 'RWA総資産' : 'RWA Total Assets'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-[var(--color-ink)] tracking-tight mb-2">
                    {formatCurrency(portfolioData.rwaTotal)}
                  </p>
                  <p className="text-sm text-[var(--color-ink-muted)] mb-4">
                    {locale === 'ja' ? '現金相当の評価額' : 'Cash equivalent value'}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-5 pt-4 border-t border-[var(--color-border)]">
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
                    total={portfolioData.rwaTotal}
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

              {/* ============================================ */}
              {/* SECTION 2: COMMUNITY TOKENS (Experience Exchange) */}
              {/* ============================================ */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Coins size={18} className="text-[var(--color-ink)]" />
                  <h2 className="text-base font-semibold text-[var(--color-ink)]">
                    {locale === 'ja' ? 'コミュニティトークン' : 'Community Tokens'}
                  </h2>
                </div>
                <p className="text-sm text-[var(--color-ink-muted)] mb-4 -mt-2">
                  {locale === 'ja'
                    ? '体験や特典と交換できるトークンです'
                    : 'Exchange tokens for experiences and benefits'}
                </p>

                <div className="space-y-4">
                  {mockTokens.map((token) => {
                    const benefits = getBenefitsByToken(token.tokenId);
                    const TokenIcon = iconMap[token.icon] || Coins;
                    const isExpanded = expandedToken === token.tokenId;

                    return (
                      <div
                        key={token.tokenId}
                        className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden"
                      >
                        {/* Token Header */}
                        <button
                          onClick={() => toggleTokenExpand(token.tokenId)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-[var(--color-bg)] transition-colors text-left"
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${token.color}15` }}
                          >
                            <TokenIcon size={24} color={token.color} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-[var(--color-ink)]">
                                {token.name}
                              </h3>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: token.color }}
                              >
                                {token.symbol}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--color-ink-muted)] mt-0.5">
                              {locale === 'ja'
                                ? `${benefits.length}件の特典と交換可能`
                                : `${benefits.length} benefits available`}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold" style={{ color: token.color }}>
                              {token.balance.toLocaleString()}
                            </p>
                            <p className="text-xs text-[var(--color-ink-muted)]">
                              {locale === 'ja' ? '保有数' : 'tokens'}
                            </p>
                          </div>

                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={20} className="text-[var(--color-ink-muted)]" />
                          </motion.div>
                        </button>

                        {/* Benefits List (Expandable) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-[var(--color-border)]">
                                <p className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide pt-3 pb-2">
                                  {locale === 'ja' ? '交換できる特典' : 'Available Benefits'}
                                </p>
                                <div className="space-y-2">
                                  {benefits.map((benefit) => {
                                    const canAfford = token.balance >= benefit.cost;
                                    return (
                                      <div
                                        key={benefit.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                                          canAfford
                                            ? 'border-[var(--color-border)] bg-[var(--color-bg)]'
                                            : 'border-gray-200 bg-gray-50 opacity-60'
                                        }`}
                                      >
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                          <Image
                                            src={benefit.image}
                                            alt={locale === 'ja' ? benefit.nameJa : benefit.name}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm text-[var(--color-ink)]">
                                            {locale === 'ja' ? benefit.nameJa : benefit.name}
                                          </p>
                                          <p className="text-xs text-[var(--color-ink-muted)] line-clamp-1">
                                            {locale === 'ja' ? benefit.descriptionJa : benefit.description}
                                          </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                          <span
                                            className="font-bold text-sm"
                                            style={{ color: token.color }}
                                          >
                                            {benefit.cost} {token.symbol}
                                          </span>
                                          {canAfford ? (
                                            <button
                                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                                              style={{ backgroundColor: token.color }}
                                            >
                                              <Gift size={12} />
                                              {locale === 'ja' ? '交換' : 'Redeem'}
                                            </button>
                                          ) : (
                                            <span className="text-xs text-[var(--color-ink-muted)]">
                                              {locale === 'ja' ? '残高不足' : 'Insufficient'}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* View All Benefits Link */}
                                <Link
                                  href={`/tokens/${token.tokenId}`}
                                  className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                                  style={{
                                    backgroundColor: `${token.color}10`,
                                    color: token.color,
                                  }}
                                >
                                  <span>{locale === 'ja' ? 'すべての特典を見る' : 'View All Benefits'}</span>
                                  <ArrowRight size={14} />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* External Link Section */}
              <section className="mb-6">
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

              {/* ============================================ */}
              {/* SECTION 3: LINE INTEGRATION (Minimal, at bottom) */}
              {/* ============================================ */}
              <section>
                {!lineConnected ? (
                  <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                    <button
                      onClick={() => setShowLineSection(!showLineSection)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#06C755]/10 flex items-center justify-center">
                          <MessageCircle size={16} className="text-[#06C755]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--color-ink)]">
                            {locale === 'ja' ? 'LINE連携' : 'LINE Integration'}
                          </p>
                          <p className="text-xs text-[var(--color-ink-muted)]">
                            {locale === 'ja' ? '通知を受け取る' : 'Get notifications'}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: showLineSection ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={18} className="text-[var(--color-ink-muted)]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {showLineSection && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-[var(--color-border)]">
                            <ul className="space-y-2 text-xs text-[var(--color-ink-muted)] py-3">
                              <li className="flex items-center gap-2">
                                <Bell size={12} />
                                {locale === 'ja' ? '購入通知を受け取れます' : 'Receive purchase notifications'}
                              </li>
                              <li className="flex items-center gap-2">
                                <TrendingUp size={12} />
                                {locale === 'ja' ? '価格変動アラート' : 'Price change alerts'}
                              </li>
                            </ul>
                            <button
                              onClick={handleLineConnect}
                              className="w-full py-2.5 px-4 bg-[#06C755] text-white rounded-xl font-medium text-sm hover:bg-[#05b04c] transition-colors flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={16} />
                              {locale === 'ja' ? 'LINEで連携する' : 'Connect with LINE'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700">
                        {locale === 'ja' ? 'LINE連携済み' : 'LINE Connected'}
                      </p>
                      <p className="text-xs text-green-600">
                        {locale === 'ja' ? '通知を受け取ります' : 'Receiving notifications'}
                      </p>
                    </div>
                  </div>
                )}
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
