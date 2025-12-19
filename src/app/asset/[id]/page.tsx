import { notFound } from 'next/navigation';
import { getAssetById, assets, getProjectByAsset } from '@/data/projects';
import AssetDetailClient from './AssetDetailClient';

interface AssetPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { id } = await params;
  const asset = getAssetById(id);

  if (!asset) {
    notFound();
  }

  const project = getProjectByAsset(asset.id);

  return <AssetDetailClient asset={asset} project={project} />;
}

export async function generateStaticParams() {
  return assets.map((asset) => ({
    id: asset.id,
  }));
}
