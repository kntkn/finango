import { notFound } from 'next/navigation';
import { getAssetById, assets, getCategoryById } from '@/data/assets';
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

  const category = getCategoryById(asset.categoryId);

  return <AssetDetailClient asset={asset} category={category} />;
}

export async function generateStaticParams() {
  return assets.map((asset) => ({
    id: asset.id,
  }));
}
