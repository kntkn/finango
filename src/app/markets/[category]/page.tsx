import { notFound } from 'next/navigation';
import { getCategoryById, getAssetsByCategory, categories } from '@/data/assets';
import CategoryDetailClient from './CategoryDetailClient';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const assets = getAssetsByCategory(categoryId);

  return <CategoryDetailClient category={category} assets={assets} />;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}
