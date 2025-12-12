'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { useI18n } from '@/lib/i18n';
import { PieChart as PieChartIcon, TrendingUp, Lightbulb } from 'lucide-react';

// Professional Fintech color palette
const FINTECH_COLORS = [
  '#0EA5E9', // Sky blue - primary
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#EF4444', // Red
];

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

type ChartType = 'pie' | 'growth';

// Mock growth data - simulating portfolio value over time
const generateGrowthData = (total: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const data = [];
  let value = total * 0.7; // Start at 70% of current value

  for (let i = 0; i <= currentMonth; i++) {
    const growth = 1 + (Math.random() * 0.08 - 0.02); // -2% to +8% monthly
    value = i === currentMonth ? total : value * growth;
    data.push({
      month: months[i],
      value: Math.round(value),
    });
  }
  return data;
};

export default function PortfolioChart({ data, total }: PortfolioChartProps) {
  const { locale } = useI18n();
  const [chartType, setChartType] = useState<ChartType>('pie');

  // Apply Fintech colors to data
  const coloredData = data.map((item, index) => ({
    ...item,
    color: FINTECH_COLORS[index % FINTECH_COLORS.length],
  }));

  const growthData = generateGrowthData(total);

  // Calculate AI insights
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
        ? `現在${topCategory.name}に集中しています。分散のために他のカテゴリも検討してみましょう。`
        : `Currently focused on ${topCategory.name}. Consider other categories for diversification.`;
    }

    if (topPercentage > 50) {
      return locale === 'ja'
        ? `${topCategory.name}への集中投資(${topPercentage}%)。集中型のアプローチです。`
        : `Notable concentration in ${topCategory.name} (${topPercentage}%). A focused approach.`;
    }

    if (data.length >= 4) {
      return locale === 'ja'
        ? "複数のカテゴリにバランスよく分散されています。"
        : "Well diversified across multiple categories.";
    }

    return locale === 'ja'
      ? "異なる資産タイプへの分散が進んでいます。"
      : "Developing nicely with exposure to different asset types.";
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
      const item = payload[0].payload;
      const percentage = Math.round((item.value / total) * 100);
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 shadow-xl">
          <p className="font-semibold text-sm text-[var(--color-text)]">{item.name}</p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {formatCurrency(item.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const GrowthTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 shadow-xl">
          <p className="font-semibold text-sm text-[var(--color-text)]">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Chart Type Toggle */}
      <div className="flex items-center gap-2 p-1 bg-[var(--color-bg)] rounded-xl">
        <button
          onClick={() => setChartType('pie')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            chartType === 'pie'
              ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          <PieChartIcon size={16} />
          <span>{locale === 'ja' ? '構成比率' : 'Allocation'}</span>
        </button>
        <button
          onClick={() => setChartType('growth')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            chartType === 'growth'
              ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          <TrendingUp size={16} />
          <span>{locale === 'ja' ? '推移' : 'Growth'}</span>
        </button>
      </div>

      {/* Chart */}
      {chartType === 'pie' ? (
        <div className="relative">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coloredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {coloredData.map((entry, index) => (
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
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">
                {locale === 'ja' ? '総資産' : 'Total'}
              </p>
              <p className="text-xl font-bold text-[var(--color-text)]">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip content={<GrowthTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0EA5E9"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend - only for pie chart */}
      {chartType === 'pie' && (
        <div className="grid grid-cols-2 gap-2">
          {coloredData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--color-bg)]"
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {Math.round((item.value / total) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Insight - No emoji */}
      <div className="p-4 bg-gradient-to-r from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 border border-[var(--color-accent)]/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-1">
              {locale === 'ja' ? 'AI分析' : 'AI Insight'}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {getAIInsight()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
