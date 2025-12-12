'use client';

import { useState } from 'react';
import { Asset } from '@/data/assets';
import { Sparkles, ChevronDown, ChevronUp, Clock, TrendingUp, Droplets, Users, AlertCircle } from 'lucide-react';

interface AIInsightsProps {
  asset: Asset;
}

export default function AIInsights({ asset }: AIInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { aiInsights } = asset;

  const getLiquidityIcon = (level: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'text-green-500',
      medium: 'text-amber-500',
      low: 'text-red-400',
    };
    return <Droplets size={16} className={colors[level]} />;
  };

  const getRiskBadge = (level: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[level]}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="bg-[var(--color-ai-bg)] border border-[var(--color-ai-border)] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--color-ai-text)]" />
          <span className="font-medium text-[var(--color-ai-text)]">AI Insights</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-[var(--color-ai-text)]" />
        ) : (
          <ChevronDown size={20} className="text-[var(--color-ai-text)]" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-5">
          {/* Disclaimer */}
          <p className="text-xs text-[var(--color-text-muted)] italic">
            These insights help you think about this asset. They are not investment advice.
          </p>

          {/* Project Characteristics */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
              Project Characteristics
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--color-surface)] rounded-xl p-3 text-center">
                <Clock size={18} className="mx-auto mb-1 text-[var(--color-text-muted)]" />
                <p className="text-xs text-[var(--color-text-muted)]">Type</p>
                <p className="text-sm font-medium mt-0.5">{aiInsights.projectType}</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-xl p-3 text-center">
                <TrendingUp size={18} className="mx-auto mb-1 text-[var(--color-text-muted)]" />
                <p className="text-xs text-[var(--color-text-muted)]">Style</p>
                <p className="text-sm font-medium mt-0.5">{aiInsights.orientation}</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  {getLiquidityIcon(aiInsights.liquidity)}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">Liquidity</p>
                <p className="text-sm font-medium mt-0.5 capitalize">{aiInsights.liquidity}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
              <AlertCircle size={14} />
              Risk Nature
            </h4>
            <div className="bg-[var(--color-surface)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Market Dependency</span>
                {getRiskBadge(aiInsights.riskFactors.marketDependency)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Time Dependency</span>
                {getRiskBadge(aiInsights.riskFactors.timeDependency)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">External Factors</span>
                {getRiskBadge(aiInsights.riskFactors.externalFactors)}
              </div>
            </div>
          </div>

          {/* Similar Projects */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
              What We&apos;ve Observed
            </h4>
            <div className="bg-[var(--color-surface)] rounded-xl p-4">
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {aiInsights.similarProjects}
              </p>
            </div>
          </div>

          {/* Suitable For */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
              <Users size={14} />
              May Be Suitable For
            </h4>
            <div className="flex flex-wrap gap-2">
              {aiInsights.suitableFor.map((type, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[var(--color-surface)] rounded-full text-sm text-[var(--color-text-secondary)]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
