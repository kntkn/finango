'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project, getAssetsByProject } from '@/data/projects';
import { useI18n } from '@/lib/i18n';
import { Wine, Leaf, Sparkles, Home, Palmtree, Mountain, Flag, Rocket, Clapperboard, ChevronRight } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { locale } = useI18n();
  const assets = getAssetsByProject(project.id);
  const IconComponent = iconMap[project.icon] || Sparkles;

  const categoryLabels = {
    membership: { en: 'Membership', ja: 'メンバーシップ' },
    nft: { en: 'NFT', ja: 'NFT' },
    investment: { en: 'Investment', ja: '投資' },
    experience: { en: 'Experience', ja: '体験' },
  };

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={project.image}
          alt={locale === 'ja' ? project.nameJa : project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: `${project.color}cc` }}
          >
            {locale === 'ja' ? categoryLabels[project.category].ja : categoryLabels[project.category].en}
          </span>
        </div>

        {/* Icon & Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: `${project.color}40` }}
            >
              <IconComponent size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">
                {locale === 'ja' ? project.nameJa : project.name}
              </h3>
              <p className="text-white/80 text-sm">
                {assets.length} {locale === 'ja' ? '銘柄' : 'assets'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-[var(--color-ink-secondary)] line-clamp-2 mb-3">
          {locale === 'ja' ? project.descriptionJa : project.description}
        </p>

        {/* View Details */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
            {locale === 'ja' ? '詳細を見る' : 'View Details'}
          </span>
          <ChevronRight size={16} className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
