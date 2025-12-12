'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'ja';

interface Translations {
  [key: string]: {
    en: string;
    ja: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ja: 'ホーム' },
  'nav.discover': { en: 'Discover', ja: '探す' },
  'nav.likes': { en: 'Likes', ja: 'お気に入り' },
  'nav.portfolio': { en: 'Portfolio', ja: 'ポートフォリオ' },

  // Home
  'home.title': { en: 'Find your next\nopportunity', ja: '次の機会を\n見つけよう' },
  'home.subtitle': { en: 'Discover real-world assets that matter', ja: '価値ある実物資産を発見' },
  'home.featured': { en: 'Featured', ja: '注目' },
  'home.trending': { en: 'Trending', ja: 'トレンド' },
  'home.viewAll': { en: 'View all', ja: 'すべて見る' },

  // Discover
  'discover.title': { en: 'Discover', ja: '探す' },
  'discover.hint.mobile': { en: 'Double-tap to save', ja: 'ダブルタップで保存' },
  'discover.hint.pc': { en: 'Click ♡ to save', ja: '♡をクリックで保存' },
  'discover.empty': { en: "You've seen everything!", ja: 'すべて見ました！' },
  'discover.restart': { en: 'Start over', ja: 'もう一度' },

  // Likes
  'likes.title': { en: 'Saved', ja: '保存済み' },
  'likes.summary': { en: 'Your collection', ja: 'あなたのコレクション' },
  'likes.discoverMore': { en: 'Discover more', ja: 'もっと探す' },
  'likes.empty': { en: 'No saved items yet', ja: 'まだ保存したものはありません' },
  'likes.emptyDescription': { en: 'Explore and save items you like', ja: '気になるアイテムを探して保存しよう' },
  'likes.emptyHint': { en: 'Double-tap cards to save them here', ja: 'カードをダブルタップして保存' },
  'likes.startDiscovering': { en: 'Start discovering', ja: '探し始める' },
  'likes.startExploring': { en: 'Start exploring', ja: '探し始める' },

  // Markets
  'markets.title': { en: 'Markets', ja: 'マーケット' },
  'markets.explore': { en: 'Explore Categories', ja: 'カテゴリを探す' },
  'markets.assets': { en: 'assets', ja: '件' },

  // Asset Detail
  'asset.story': { en: 'The Story', ja: 'ストーリー' },
  'asset.aiInsights': { en: 'AI Insights', ja: 'AI分析' },
  'asset.why': { en: 'Why Consider This', ja: '注目ポイント' },
  'asset.viewOnAngo': { en: 'View on ANGO', ja: 'ANGOで見る' },
  'asset.secureNote': { en: 'All transactions are processed securely on ango.jp', ja: '取引はango.jpで安全に処理されます' },
  'asset.invest': { en: 'Invest', ja: '投資する' },

  // AI Insights
  'ai.disclaimer': { en: 'These insights help you think. Not investment advice.', ja: 'これらは思考を助けるものです。投資助言ではありません。' },
  'ai.characteristics': { en: 'Characteristics', ja: '特徴' },
  'ai.type': { en: 'Type', ja: 'タイプ' },
  'ai.style': { en: 'Style', ja: 'スタイル' },
  'ai.liquidity': { en: 'Liquidity', ja: '流動性' },
  'ai.risk': { en: 'Risk Nature', ja: 'リスク特性' },
  'ai.market': { en: 'Market', ja: '市場' },
  'ai.time': { en: 'Time', ja: '時間' },
  'ai.external': { en: 'External', ja: '外部' },
  'ai.observed': { en: 'What We Observed', ja: '観察結果' },
  'ai.suitableFor': { en: 'May Be Good For', ja: 'こんな方に' },

  // Portfolio
  'portfolio.title': { en: 'Portfolio', ja: 'ポートフォリオ' },
  'portfolio.holdings': { en: 'Your Holdings', ja: '保有資産' },
  'portfolio.assets': { en: 'Your Assets', ja: '保有中' },
  'portfolio.total': { en: 'Total Value', ja: '合計' },
  'portfolio.empty': { en: 'No assets yet', ja: 'まだ資産がありません' },
  'portfolio.emptyHint': { en: 'Start exploring to build your portfolio', ja: '探して資産を構築しましょう' },
  'portfolio.sell': { en: 'Want to Sell?', ja: '売却したい？' },
  'portfolio.sellNote': { en: 'All transactions are processed on ANGO', ja: '取引はANGOで処理されます' },
  'portfolio.manageOnAngo': { en: 'Manage on ANGO', ja: 'ANGOで管理' },

  // Categories
  'category.carbon': { en: 'Carbon', ja: 'カーボン' },
  'category.whisky': { en: 'Whisky Cask', ja: 'ウイスキー樽' },
  'category.regional': { en: 'Regional', ja: '地域活性' },
  'category.energy': { en: 'Energy', ja: 'エネルギー' },
  'category.culture': { en: 'Culture', ja: '文化資産' },

  // Common
  'common.learnMore': { en: 'Learn more', ja: '詳しく' },
  'common.high': { en: 'High', ja: '高' },
  'common.medium': { en: 'Medium', ja: '中' },
  'common.low': { en: 'Low', ja: '低' },
  'common.longTerm': { en: 'Long-term', ja: '長期' },
  'common.midTerm': { en: 'Mid-term', ja: '中期' },
  'common.stable': { en: 'Stable', ja: '安定' },
  'common.growth': { en: 'Growth', ja: '成長' },
  'common.challenge': { en: 'Challenge', ja: 'チャレンジ' },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Check browser language or stored preference
    const stored = localStorage.getItem('finango-locale') as Locale;
    if (stored && (stored === 'en' || stored === 'ja')) {
      setLocale(stored);
    } else {
      const browserLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
      setLocale(browserLang);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('finango-locale', newLocale);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
    return translation[locale];
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
