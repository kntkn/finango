'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useI18n } from '@/lib/i18n';

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface PortfolioChartProps {
  data: ChartData[];
  total: number;
}

export default function PortfolioChart({ data, total }: PortfolioChartProps) {
  const { locale } = useI18n();

  // Calculate AI insights based on portfolio composition
  const getAIInsight = () => {
    if (data.length === 0) {
      return locale === 'ja'
        ? "興味のある資産を探して、ポートフォリオを構築しましょう。"
        : "Start building your portfolio by exploring assets that interest you.";
    }

    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const topCategory = sortedData[0];
    const topPercentage = Math.round((topCategory.value / total) * 100);

    if (data.length === 1) {
      return locale === 'ja'
        ? `現在のポートフォリオは${topCategory.name}に集中しています。分散のために他のカテゴリも検討してみましょう。`
        : `Your portfolio is currently focused on ${topCategory.name}. Consider exploring other categories for diversification.`;
    }

    if (topPercentage > 50) {
      return locale === 'ja'
        ? `${topCategory.name}への集中投資(${topPercentage}%)が見られます。集中型のアプローチです。`
        : `Your portfolio has a notable concentration in ${topCategory.name} (${topPercentage}%). This reflects a focused approach.`;
    }

    if (data.length >= 4) {
      return locale === 'ja'
        ? "複数のカテゴリにバランスよく分散されています。実物資産への慎重なアプローチです。"
        : "Your portfolio shows thoughtful diversification across multiple categories. A balanced approach to real-world assets.";
    }

    return locale === 'ja'
      ? "異なる資産タイプへの分散が進んでいます。"
      : "Your portfolio is developing nicely with exposure to different asset types.";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = Math.round((data.value / total) * 100);
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="relative">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Total */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)]">
              {locale === 'ja' ? '合計' : 'Total Value'}
            </p>
            <p className="text-xl font-bold">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {Math.round((item.value / total) * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="p-4 bg-[var(--color-ai-bg)] border border-[var(--color-ai-border)] rounded-xl">
        <div className="flex items-start gap-2">
          <span className="text-sm">✨</span>
          <p className="text-sm text-[var(--color-ai-text)] leading-relaxed">
            {getAIInsight()}
          </p>
        </div>
      </div>
    </div>
  );
}
