'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';
import { useI18n } from '@/lib/i18n';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

// Clean, professional color palette
const CHART_COLORS = [
  '#0f172a', // Navy (primary)
  '#1e3a5f', // Navy lighter
  '#3b82f6', // Blue
  '#0ea5e9', // Sky
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#64748b', // Slate
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

// Mock growth data
const generateGrowthData = (total: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const data = [];
  let value = total * 0.7;

  for (let i = 0; i <= currentMonth; i++) {
    const growth = 1 + (Math.random() * 0.08 - 0.02);
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

  // Apply colors to data
  const coloredData = data.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const growthData = generateGrowthData(total);

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
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
          <p className="font-semibold text-sm text-gray-900">{item.name}</p>
          <p className="text-gray-600 text-sm">
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
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
          <p className="font-semibold text-sm text-gray-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setChartType('pie')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            chartType === 'pie'
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PieChartIcon size={14} />
          <span>{locale === 'ja' ? '配分' : 'Allocation'}</span>
        </button>
        <button
          onClick={() => setChartType('growth')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            chartType === 'growth'
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp size={14} />
          <span>{locale === 'ja' ? '推移' : 'Growth'}</span>
        </button>
      </div>

      {/* Chart */}
      {chartType === 'pie' ? (
        <div className="flex items-center gap-6">
          {/* Pie Chart */}
          <div className="w-[140px] h-[140px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coloredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
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

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {coloredData.map((item, index) => {
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip content={<GrowthTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0f172a"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
