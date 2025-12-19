'use client';

import { useState } from 'react';
import { Asset } from '@/data/assets';
import { useI18n } from '@/lib/i18n';
import { Sparkles, ChevronDown, ChevronUp, Clock, TrendingUp, Droplets, Users, AlertCircle } from 'lucide-react';

interface AIInsightsProps {
  asset: Asset;
}

export default function AIInsights({ asset }: AIInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { t, locale } = useI18n();
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
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700',
    };
    const labels = {
      high: t('common.high'),
      medium: t('common.medium'),
      low: t('common.low'),
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${styles[level]}`}>
        {labels[level]}
      </span>
    );
  };

  const getOrientationLabel = (orientation: string) => {
    const map: Record<string, { en: string; ja: string }> = {
      'Growth': { en: 'Growth', ja: '成長型' },
      'Stable': { en: 'Stable', ja: '安定型' },
      'Stable/Growth': { en: 'Stable/Growth', ja: '安定/成長' },
      'Challenge': { en: 'Challenge', ja: '挑戦型' },
    };
    return map[orientation]?.[locale] || orientation;
  };

  const getProjectTypeLabel = (type: string) => {
    const map: Record<string, { en: string; ja: string }> = {
      'Long-term': { en: 'Long-term', ja: '長期' },
      'Mid-term': { en: 'Mid-term', ja: '中期' },
      'Short-term': { en: 'Short-term', ja: '短期' },
    };
    return map[type]?.[locale] || type;
  };

  const getLiquidityLabel = (level: string) => {
    const map: Record<string, { en: string; ja: string }> = {
      'high': { en: 'High', ja: '高い' },
      'medium': { en: 'Medium', ja: '普通' },
      'low': { en: 'Low', ja: '低い' },
    };
    return map[level]?.[locale] || level;
  };

  return (
    <div className="bg-[var(--color-ai-bg)] border border-[var(--color-ai-border)] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--color-ai-border)]/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--color-ai-text)]" />
          <span className="font-medium text-[var(--color-ai-text)]">{t('asset.aiInsights')}</span>
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
          <p className="text-sm text-[var(--color-text-muted)] italic">
            {t('ai.disclaimer')}
          </p>

          {/* Project Characteristics */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t('ai.characteristics')}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--color-surface)] rounded-xl p-3 text-center">
                <Clock size={18} className="mx-auto mb-1 text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-muted)]">{t('ai.type')}</p>
                <p className="text-sm font-medium mt-0.5">{getProjectTypeLabel(aiInsights.projectType)}</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-xl p-3 text-center">
                <TrendingUp size={18} className="mx-auto mb-1 text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-muted)]">{t('ai.style')}</p>
                <p className="text-sm font-medium mt-0.5">{getOrientationLabel(aiInsights.orientation)}</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  {getLiquidityIcon(aiInsights.liquidity)}
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">{t('ai.liquidity')}</p>
                <p className="text-sm font-medium mt-0.5">{getLiquidityLabel(aiInsights.liquidity)}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
              <AlertCircle size={14} />
              {t('ai.risk')}
            </h4>
            <div className="bg-[var(--color-surface)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">{t('ai.market')}</span>
                {getRiskBadge(aiInsights.riskFactors.marketDependency)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">{t('ai.time')}</span>
                {getRiskBadge(aiInsights.riskFactors.timeDependency)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">{t('ai.external')}</span>
                {getRiskBadge(aiInsights.riskFactors.externalFactors)}
              </div>
            </div>
          </div>

          {/* Similar Projects */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t('ai.observed')}
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
              {t('ai.suitableFor')}
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
