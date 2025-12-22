'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Asset, Project } from '@/data/projects';
import { useI18n } from '@/lib/i18n';
import { useLikes } from '@/lib/likes';
import { ChevronLeft, ExternalLink, Heart, Share2, Check, Globe, Wine, Leaf, Sparkles, Home, Palmtree, Mountain, Flag, Rocket, Clapperboard, ShoppingCart, TrendingUp, Users, Shield, FileCheck, AlertTriangle, Coins, ArrowRightLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';
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

interface AssetDetailClientProps {
  asset: Asset;
  project: Project | undefined;
}

// Trust Card Component
interface TrustCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}

function TrustCard({ icon, title, children, defaultOpen = false, accentColor }: TrustCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--color-bg)]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accentColor || 'var(--color-primary)'}15` }}
          >
            {icon}
          </div>
          <span className="font-semibold text-[var(--color-ink)]">{title}</span>
        </div>
        <ChevronDown
          size={20}
          className={`text-[var(--color-ink-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-[var(--color-border)]">
              <div className="pt-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AssetDetailClient({ asset, project }: AssetDetailClientProps) {
  const { locale, setLocale } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  const [showShareToast, setShowShareToast] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = () => {
    toggleLike(asset.id);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 400);
  };

  const handleShare = async () => {
    const shareData = {
      title: locale === 'ja' ? asset.nameJa : asset.name,
      text: locale === 'ja' ? asset.descriptionJa : asset.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const soldPercentage = Math.round((asset.sold / (asset.available + asset.sold)) * 100);
  const IconComponent = project ? (iconMap[project.icon] || Sparkles) : Sparkles;

  const categoryLabels = {
    membership: { en: 'Membership', ja: 'メンバーシップ' },
    nft: { en: 'NFT', ja: 'NFT' },
    investment: { en: 'Investment', ja: '投資' },
    experience: { en: 'Experience', ja: '体験' },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:pl-24">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={project ? `/project/${project.id}` : '/search'}
            className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                isLiked(asset.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-black/30 text-white hover:bg-black/40'
              } ${likeAnimation ? 'animate-heart-pop' : ''}`}
            >
              <Heart size={18} fill={isLiked(asset.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={toggleLocale}
              className="md:hidden w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <Globe size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[var(--color-ink)] text-white text-sm font-medium flex items-center gap-2"
          >
            <Check size={16} />
            {locale === 'ja' ? 'リンクをコピーしました' : 'Link copied'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Image */}
      <div className="relative aspect-[4/3] md:aspect-[21/9] w-full">
        <Image
          src={asset.image}
          alt={locale === 'ja' ? asset.nameJa : asset.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />

        {/* Project Badge */}
        {project && (
          <Link
            href={`/project/${project.id}`}
            className="absolute bottom-6 left-4 md:left-1/2 md:-translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-white shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: `${project.color}cc` }}
          >
            <IconComponent size={16} />
            <span className="text-sm font-medium">
              {locale === 'ja' ? project.nameJa : project.name}
            </span>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-4 relative z-10">
        {/* Title & Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-[var(--color-ink)]">
              {locale === 'ja' ? asset.nameJa : asset.name}
            </h1>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl md:text-3xl font-bold" style={{ color: project?.color || 'var(--color-primary)' }}>
                {formatPrice(asset.price)}
              </p>
              <p className="text-sm text-[var(--color-ink-muted)]">
                / {locale === 'ja' ? asset.unitJa : asset.unit}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-2">
              <ShoppingCart size={16} className="text-[var(--color-ink-muted)]" />
            </div>
            <p className="text-lg font-bold text-[var(--color-ink)]">{asset.sold}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              {locale === 'ja' ? '販売済' : 'Sold'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-2">
              <Users size={16} className="text-[var(--color-ink-muted)]" />
            </div>
            <p className="text-lg font-bold text-[var(--color-ink)]">{asset.available}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              {locale === 'ja' ? '残り' : 'Available'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={16} className="text-[var(--color-ink-muted)]" />
            </div>
            <p className="text-lg font-bold" style={{ color: project?.color || 'var(--color-primary)' }}>
              {soldPercentage}%
            </p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              {locale === 'ja' ? '達成率' : 'Progress'}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[var(--color-ink-secondary)]">
                {locale === 'ja' ? '販売進捗' : 'Sales Progress'}
              </span>
              <span className="font-semibold" style={{ color: project?.color || 'var(--color-primary)' }}>
                {asset.sold} / {asset.sold + asset.available}
              </span>
            </div>
            <div className="h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${soldPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: project?.color || 'var(--color-primary)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="text-lg font-semibold mb-3 text-[var(--color-ink)]">
              {locale === 'ja' ? '商品説明' : 'Description'}
            </h2>
            <p className="text-[var(--color-ink-secondary)] leading-relaxed">
              {locale === 'ja' ? asset.descriptionJa : asset.description}
            </p>
          </div>
        </motion.div>

        {/* Project Info */}
        {project && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <Link
              href={`/project/${project.id}`}
              className="block bg-white rounded-xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${project.color}15` }}
                >
                  <IconComponent size={24} color={project.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: project.color }}
                    >
                      {locale === 'ja' ? categoryLabels[project.category].ja : categoryLabels[project.category].en}
                    </span>
                  </div>
                  <h3 className="font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors">
                    {locale === 'ja' ? project.nameJa : project.name}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-muted)] line-clamp-1">
                    {locale === 'ja' ? project.descriptionJa : project.description}
                  </p>
                </div>
                <ChevronLeft size={20} className="text-[var(--color-ink-muted)] rotate-180 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Why Consider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-ink)]">
              {locale === 'ja' ? 'おすすめポイント' : 'Why Consider This Asset'}
            </h2>
            <ul className="space-y-3">
              {(locale === 'ja'
                ? [
                    '理解しやすい実物資産への投資',
                    '目的が明確な透明性のあるプロジェクト',
                    'ANGOが厳選した投資機会',
                  ]
                : [
                    'Tangible real-world impact you can understand',
                    'Transparent project with clear objectives',
                    'Part of a curated selection from ANGO',
                  ]
              ).map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${project?.color || 'var(--color-primary)'}15` }}
                  >
                    <Check size={14} style={{ color: project?.color || 'var(--color-primary)' }} />
                  </span>
                  <span className="text-[var(--color-ink-secondary)]">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Trust Cards - 納得カード */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8 space-y-3"
        >
          <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-4">
            {locale === 'ja' ? '購入前にご確認ください' : 'Before You Buy'}
          </h2>

          {/* 1. Curation Standard - 厳選基準 */}
          <TrustCard
            icon={<Shield size={20} style={{ color: project?.color || 'var(--color-primary)' }} />}
            title={locale === 'ja' ? '厳選基準' : 'Curation Standard'}
            accentColor={project?.color}
            defaultOpen={true}
          >
            <ul className="space-y-2 text-sm text-[var(--color-ink-secondary)]">
              {(locale === 'ja'
                ? [
                    'ANGOの専門チームによる事前審査を通過',
                    '運営元の実績・財務状況を確認済み',
                    '法的要件・コンプライアンスをクリア',
                    '市場価値と成長可能性を評価済み',
                  ]
                : [
                    'Pre-screened by ANGO expert team',
                    'Verified track record and financials of operator',
                    'Legal requirements and compliance cleared',
                    'Market value and growth potential evaluated',
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={14} className="flex-shrink-0 mt-0.5 text-[var(--color-mint)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TrustCard>

          {/* 2. Transparency - 透明性 */}
          <TrustCard
            icon={<FileCheck size={20} style={{ color: project?.color || 'var(--color-primary)' }} />}
            title={locale === 'ja' ? '透明性' : 'Transparency'}
            accentColor={project?.color}
          >
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-[var(--color-ink)] mb-1">
                  {locale === 'ja' ? '価格算定根拠' : 'Price Basis'}
                </p>
                <p className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja'
                    ? '市場取引価格・鑑定評価に基づく適正価格'
                    : 'Fair price based on market transactions and appraisals'}
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--color-ink)] mb-1">
                  {locale === 'ja' ? '情報更新' : 'Updates'}
                </p>
                <p className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja'
                    ? '月次レポートでプロジェクト進捗を共有'
                    : 'Monthly reports on project progress'}
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--color-ink)] mb-1">
                  {locale === 'ja' ? '記録・証明' : 'Records'}
                </p>
                <p className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja'
                    ? 'ブロックチェーンに所有権を記録、改ざん不可'
                    : 'Ownership recorded on blockchain, tamper-proof'}
                </p>
              </div>
            </div>
          </TrustCard>

          {/* 3. Risks - リスク */}
          <TrustCard
            icon={<AlertTriangle size={20} style={{ color: '#F59E0B' }} />}
            title={locale === 'ja' ? 'リスク' : 'Risks'}
            accentColor="#F59E0B"
          >
            <ul className="space-y-2 text-sm text-[var(--color-ink-secondary)]">
              {(locale === 'ja'
                ? [
                    '市場変動により価値が下落する可能性があります',
                    '流動性が低く、すぐに売却できない場合があります',
                    'プロジェクトの進捗状況により予定が変更される場合があります',
                    '元本保証はありません',
                  ]
                : [
                    'Value may decrease due to market fluctuations',
                    'Low liquidity may prevent immediate sale',
                    'Project schedules may change based on progress',
                    'Principal is not guaranteed',
                  ]
              ).map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </TrustCard>

          {/* 4. Fees - 手数料 */}
          <TrustCard
            icon={<Coins size={20} style={{ color: project?.color || 'var(--color-primary)' }} />}
            title={locale === 'ja' ? '手数料' : 'Fees'}
            accentColor={project?.color}
          >
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja' ? '購入手数料' : 'Purchase Fee'}
                </span>
                <span className="font-semibold text-[var(--color-ink)]">
                  {locale === 'ja' ? '無料' : 'Free'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja' ? '売却手数料' : 'Selling Fee'}
                </span>
                <span className="font-semibold text-[var(--color-ink)]">2.5%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja' ? '管理手数料' : 'Management Fee'}
                </span>
                <span className="font-semibold text-[var(--color-ink)]">
                  {locale === 'ja' ? '年1.0%' : '1.0%/year'}
                </span>
              </div>
              <p className="text-xs text-[var(--color-ink-muted)]">
                {locale === 'ja'
                  ? '※ 手数料は予告なく変更される場合があります'
                  : '※ Fees subject to change without notice'}
              </p>
            </div>
          </TrustCard>

          {/* 5. Exit - 売却 */}
          <TrustCard
            icon={<ArrowRightLeft size={20} style={{ color: project?.color || 'var(--color-primary)' }} />}
            title={locale === 'ja' ? '売却について' : 'Exit Options'}
            accentColor={project?.color}
          >
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-[var(--color-ink)] mb-1">
                  {locale === 'ja' ? '売却方法' : 'How to Sell'}
                </p>
                <p className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja'
                    ? 'ANGOマーケットプレイスで他のユーザーに売却可能'
                    : 'Sell to other users on ANGO marketplace'}
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--color-ink)] mb-1">
                  {locale === 'ja' ? '売却条件' : 'Requirements'}
                </p>
                <p className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja'
                    ? '保有期間の制限なし。いつでも出品可能'
                    : 'No holding period required. List anytime'}
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--color-ink)] mb-1">
                  {locale === 'ja' ? '想定売却期間' : 'Expected Time to Sell'}
                </p>
                <p className="text-[var(--color-ink-secondary)]">
                  {locale === 'ja'
                    ? '通常1〜4週間（市場状況により異なる）'
                    : 'Typically 1-4 weeks (varies by market conditions)'}
                </p>
              </div>
            </div>
          </TrustCard>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8 md:max-w-md md:mx-auto"
        >
          <a
            href={asset.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold text-base text-white hover:opacity-90 transition-all hover:shadow-lg"
            style={{ backgroundColor: project?.color || 'var(--color-primary)' }}
          >
            <span>{locale === 'ja' ? 'ANGOで購入する' : 'Buy on ANGO'}</span>
            <ExternalLink size={18} />
          </a>
          <p className="text-center text-sm text-[var(--color-ink-muted)] mt-3">
            {locale === 'ja'
              ? '安全な決済・ブロックチェーン認証'
              : 'Secure payment & blockchain verified'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
