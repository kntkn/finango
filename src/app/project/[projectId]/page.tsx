'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getAssetsByProject, Asset } from '@/data/projects';
import { useI18n } from '@/lib/i18n';
import { ArrowLeft, Globe, ExternalLink, Wine, Leaf, Sparkles, Home, Palmtree, Mountain, Flag, Rocket, Clapperboard, ChevronRight } from 'lucide-react';

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

interface AssetCardProps {
  asset: Asset;
  locale: 'en' | 'ja';
  projectColor: string;
  index: number;
}

function AssetCard({ asset, locale, projectColor, index }: AssetCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const soldPercentage = Math.round((asset.sold / (asset.available + asset.sold)) * 100);

  return (
    <Link
      href={`/asset/${asset.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-300"
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={asset.image}
          alt={locale === 'ja' ? asset.nameJa : asset.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className="px-3 py-1.5 rounded-lg text-sm font-bold text-white backdrop-blur-sm"
            style={{ backgroundColor: `${projectColor}cc` }}
          >
            {formatPrice(asset.price)}
          </span>
        </div>

        {/* Unit Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 rounded-md text-xs font-medium text-white/90 backdrop-blur-sm bg-black/30">
            {locale === 'ja' ? asset.unitJa : asset.unit}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-[var(--color-ink)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
          {locale === 'ja' ? asset.nameJa : asset.name}
        </h3>
        <p className="text-xs text-[var(--color-ink-muted)] mt-1 line-clamp-2">
          {locale === 'ja' ? asset.descriptionJa : asset.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--color-ink-secondary)]">
              {locale === 'ja' ? '販売状況' : 'Sold'}
            </span>
            <span className="font-semibold" style={{ color: projectColor }}>
              {soldPercentage}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${soldPercentage}%`,
                backgroundColor: projectColor,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-1 text-[var(--color-ink-muted)]">
            <span>{asset.sold} {locale === 'ja' ? '販売済' : 'sold'}</span>
            <span>{asset.available} {locale === 'ja' ? '残り' : 'left'}</span>
          </div>
        </div>

        {/* View Details */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
          <span className="text-xs font-medium text-[var(--color-primary)]">
            {locale === 'ja' ? '詳細を見る' : 'View Details'}
          </span>
          <ChevronRight size={14} className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { locale, setLocale } = useI18n();

  const project = getProjectById(projectId);
  const assets = getAssetsByProject(projectId);

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[var(--color-ink)]">
            {locale === 'ja' ? 'プロジェクトが見つかりません' : 'Project not found'}
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
          >
            <ArrowLeft size={16} />
            {locale === 'ja' ? 'マーケットに戻る' : 'Back to Market'}
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[project.icon] || Sparkles;

  const categoryLabels = {
    membership: { en: 'Membership', ja: 'メンバーシップ' },
    nft: { en: 'NFT', ja: 'NFT' },
    investment: { en: 'Investment', ja: '投資' },
    experience: { en: 'Experience', ja: '体験' },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="px-4 py-3 md:px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-secondary)] transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <IconComponent size={16} color={project.color} />
                </div>
                <h1 className="font-bold text-lg text-[var(--color-ink)]">
                  {locale === 'ja' ? project.nameJa : project.name}
                </h1>
              </div>
            </div>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-subtle)] text-sm font-medium text-[var(--color-ink-secondary)] md:hidden"
            >
              <Globe size={14} />
              <span className="uppercase text-xs">{locale}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[21/9] md:aspect-[3/1] relative overflow-hidden">
          <Image
            src={project.image}
            alt={locale === 'ja' ? project.nameJa : project.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  style={{ backgroundColor: `${project.color}40` }}
                >
                  <IconComponent size={24} className="text-white" />
                </div>
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold text-white backdrop-blur-sm"
                  style={{ backgroundColor: `${project.color}cc` }}
                >
                  {locale === 'ja' ? categoryLabels[project.category].ja : categoryLabels[project.category].en}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {locale === 'ja' ? project.nameJa : project.name}
              </h2>
              <p className="text-white/90 text-sm md:text-base max-w-2xl">
                {locale === 'ja' ? project.descriptionJa : project.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: project.color }}>
                {assets.length}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                {locale === 'ja' ? '銘柄数' : 'Assets'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-ink)]">
                {assets.reduce((sum, a) => sum + a.sold, 0)}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                {locale === 'ja' ? '販売済' : 'Sold'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-ink)]">
                {assets.reduce((sum, a) => sum + a.available, 0)}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                {locale === 'ja' ? '販売可能' : 'Available'}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-ink)]">
                {new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
                  style: 'currency',
                  currency: 'JPY',
                  notation: 'compact',
                  maximumFractionDigits: 0,
                }).format(Math.min(...assets.map(a => a.price)))}~
              </p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                {locale === 'ja' ? '最低価格' : 'From'}
              </p>
            </div>
          </div>

          {/* Assets Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-ink)]">
                {locale === 'ja' ? '取扱銘柄' : 'Available Assets'}
              </h3>
              <span className="text-sm text-[var(--color-ink-muted)]">
                {assets.length} {locale === 'ja' ? '件' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset, index) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  locale={locale}
                  projectColor={project.color}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* External Link */}
          <section className="mt-8">
            <a
              href={`https://ango.jp/project/${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-[var(--color-border)] rounded-xl font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)]/30 transition-all"
            >
              <span>{locale === 'ja' ? '公式サイトで詳細を見る' : 'View on Official Site'}</span>
              <ExternalLink size={16} />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
