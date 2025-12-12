import { categories } from '@/data/assets';
import CategoryCard from '@/components/markets/CategoryCard';

export default function MarketsPage() {
  return (
    <div className="min-h-screen safe-top">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">finango</h1>
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Markets
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Explore Categories</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Curated collections of real-world assets
          </p>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
