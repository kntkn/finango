'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/data/projects';
import { useI18n } from '@/lib/i18n';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { locale } = useI18n();

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block rounded-2xl overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={project.image}
          alt={locale === 'ja' ? project.nameJa : project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">
            {locale === 'ja' ? project.nameJa : project.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
