'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, getAssetsByProject, Asset } from '@/data/projects';
import { useI18n } from '@/lib/i18n';
import { ArrowLeft, Globe, ExternalLink, Wine, Leaf, Sparkles, Home, Palmtree, Mountain, Flag, Rocket, Clapperboard, ChevronRight, Check, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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

// プロジェクトごとの詳細情報
const projectDetails: Record<string, {
  features: { en: string; ja: string }[];
  location?: { en: string; ja: string };
  established?: string;
  highlight?: { en: string; ja: string };
}> = {
  'unicask': {
    features: [
      { en: 'Ownership of actual whisky casks', ja: '実際のウイスキー樽の所有権' },
      { en: 'Annual tasting events', ja: '年次テイスティングイベント' },
      { en: 'Blockchain-verified authenticity', ja: 'ブロックチェーン認証済み' },
      { en: 'Secondary market trading', ja: 'セカンダリーマーケットでの取引可能' },
    ],
    location: { en: 'Scotland & Japan', ja: 'スコットランド・日本' },
    established: '2021',
    highlight: { en: 'Premium Japanese & Scotch whisky investments', ja: 'プレミアム日本・スコッチウイスキー投資' },
  },
  'decopon': {
    features: [
      { en: 'Verified carbon offset credits', ja: '認証済みカーボンオフセットクレジット' },
      { en: 'Support forest conservation', ja: '森林保全を支援' },
      { en: 'Transparent impact tracking', ja: '透明なインパクト追跡' },
      { en: 'Contribute to carbon neutrality', ja: 'カーボンニュートラルに貢献' },
    ],
    location: { en: 'Hokkaido, Shimane, Kumamoto', ja: '北海道・島根・熊本' },
    established: '2022',
    highlight: { en: 'J-Credit certified environmental investments', ja: 'Jクレジット認証の環境投資' },
  },
  'japango': {
    features: [
      { en: 'Free stays at luxury ryokans', ja: '高級旅館での無料宿泊' },
      { en: 'Exclusive member experiences', ja: '会員限定体験' },
      { en: 'Yoga & wellness retreats', ja: 'ヨガ＆ウェルネスリトリート' },
      { en: 'Cultural immersion programs', ja: '文化体験プログラム' },
    ],
    location: { en: 'Nationwide Japan', ja: '日本全国' },
    established: '2023',
    highlight: { en: 'Premium travel membership for Japan experiences', ja: '日本体験のためのプレミアム旅行メンバーシップ' },
  },
  'ango': {
    features: [
      { en: 'Restored traditional kominka properties', ja: '修復された伝統的古民家' },
      { en: 'Unlimited access for members', ja: 'メンバー無制限アクセス' },
      { en: 'Multiple locations across Japan', ja: '日本各地の複数拠点' },
      { en: 'Community events & gatherings', ja: 'コミュニティイベント＆交流会' },
    ],
    location: { en: 'Nasu, Kujukuri, Atami, Yugawara, Yamanakako', ja: '那須・九十九里・熱海・湯河原・山中湖' },
    established: '2020',
    highlight: { en: 'Historic kominka co-ownership membership', ja: '歴史的古民家の共同所有メンバーシップ' },
  },
  'nanjo': {
    features: [
      { en: 'Guided tours of sacred sites', ja: '聖地ガイドツアー' },
      { en: 'Local cuisine experiences', ja: '地元料理体験' },
      { en: 'Beach & nature activities', ja: 'ビーチ＆自然アクティビティ' },
      { en: 'Support local community', ja: '地域コミュニティを支援' },
    ],
    location: { en: 'Nanjo City, Okinawa', ja: '沖縄県南城市' },
    established: '2023',
    highlight: { en: 'Experience Okinawa\'s spiritual heart', ja: '沖縄のスピリチュアルな中心地を体験' },
  },
  'ikusaka': {
    features: [
      { en: 'Agricultural experiences', ja: '農業体験' },
      { en: 'Mountain village lifestyle', ja: '山村の暮らし体験' },
      { en: 'Local crafts & workshops', ja: '地元工芸＆ワークショップ' },
      { en: 'Seasonal festivals', ja: '季節の祭り参加' },
    ],
    location: { en: 'Ikusaka Village, Nagano', ja: '長野県生坂村' },
    established: '2023',
    highlight: { en: 'Discover rural Japan in the Alps', ja: 'アルプスの麓で田舎日本を発見' },
  },
  'tono': {
    features: [
      { en: 'Traditional festival participation', ja: '伝統祭り参加' },
      { en: 'Horseback riding experiences', ja: '乗馬体験' },
      { en: 'Folklore & legend tours', ja: '民話＆伝説ツアー' },
      { en: 'Local sake brewery visits', ja: '地酒蔵見学' },
    ],
    location: { en: 'Tono City, Iwate', ja: '岩手県遠野市' },
    established: '2023',
    highlight: { en: 'The land of Japanese folklore', ja: '日本民話のふるさと' },
  },
  'ipc-space': {
    features: [
      { en: 'Priority space travel reservations', ja: '優先宇宙旅行予約権' },
      { en: 'Astronaut training experiences', ja: '宇宙飛行士訓練体験' },
      { en: 'VR space simulations', ja: 'VR宇宙シミュレーション' },
      { en: 'Exclusive launch viewing events', ja: '限定打ち上げ見学イベント' },
    ],
    location: { en: 'Japan & International', ja: '日本＆国際' },
    established: '2024',
    highlight: { en: 'Your ticket to the final frontier', ja: '最後のフロンティアへのチケット' },
  },
  'movie-kimutaku': {
    features: [
      { en: 'Authenticated movie props', ja: '認証済み映画小道具' },
      { en: 'Certificate of authenticity', ja: '真正性証明書付き' },
      { en: 'Exclusive collector items', ja: '限定コレクターアイテム' },
      { en: 'Production behind-the-scenes', ja: '制作舞台裏情報' },
    ],
    location: { en: 'Japan', ja: '日本' },
    established: '2024',
    highlight: { en: 'Own a piece of cinema history', ja: '映画史の一部を所有する' },
  },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/asset/${asset.id}`}
        className="group block bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-300"
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
            <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${soldPercentage}%`,
                  backgroundColor: projectColor,
                }}
              />
            </div>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
              {soldPercentage}% {locale === 'ja' ? '販売済' : 'sold'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { locale, setLocale } = useI18n();

  const project = getProjectById(projectId);
  const assets = getAssetsByProject(projectId);
  const details = projectDetails[projectId];

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
              <h1 className="font-bold text-lg text-[var(--color-ink)]">
                {locale === 'ja' ? project.nameJa : project.name}
              </h1>
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
        <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
          <Image
            src={project.image}
            alt={locale === 'ja' ? project.nameJa : project.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-4"
                  style={{ backgroundColor: `${project.color}40` }}
                >
                  <IconComponent size={18} className="text-white" />
                  <span className="text-white/90 text-sm font-medium">
                    {details?.highlight
                      ? (locale === 'ja' ? details.highlight.ja : details.highlight.en)
                      : (locale === 'ja' ? project.descriptionJa : project.description)}
                  </span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-3"
              >
                {locale === 'ja' ? project.nameJa : project.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed"
              >
                {locale === 'ja' ? project.descriptionJa : project.description}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Project Overview Section */}
          {details && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 p-6 border-b border-[var(--color-border)]">
                  {details.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[var(--color-ink-muted)]" />
                      <span className="text-sm text-[var(--color-ink-secondary)]">
                        {locale === 'ja' ? details.location.ja : details.location.en}
                      </span>
                    </div>
                  )}
                  {details.established && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[var(--color-ink-muted)]" />
                      <span className="text-sm text-[var(--color-ink-secondary)]">
                        {locale === 'ja' ? `${details.established}年開始` : `Est. ${details.established}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[var(--color-ink-muted)]" />
                    <span className="text-sm text-[var(--color-ink-secondary)]">
                      {locale === 'ja' ? 'コミュニティ' : 'Community'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--color-ink)] mb-4">
                    {locale === 'ja' ? 'このプロジェクトの特徴' : 'What You Get'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {details.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg)]"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${project.color}15` }}
                        >
                          <Check size={14} style={{ color: project.color }} />
                        </div>
                        <span className="text-sm text-[var(--color-ink-secondary)]">
                          {locale === 'ja' ? feature.ja : feature.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Assets Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-bold text-[var(--color-ink)] mb-4">
              {locale === 'ja' ? '取扱商品' : 'Available Items'}
            </h3>

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
          </motion.section>

          {/* External Link */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <a
              href={`https://ango.jp/project/${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: project.color }}
            >
              <span>{locale === 'ja' ? '公式サイトで詳細を見る' : 'View on Official Site'}</span>
              <ExternalLink size={18} />
            </a>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
