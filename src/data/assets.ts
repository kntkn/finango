export interface Asset {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  image: string;
  shortDescription: string;
  story: string;
  aiInsights: {
    projectType: string;
    orientation: string;
    liquidity: 'high' | 'medium' | 'low';
    riskFactors: {
      marketDependency: 'high' | 'medium' | 'low';
      timeDependency: 'high' | 'medium' | 'low';
      externalFactors: 'high' | 'medium' | 'low';
    };
    similarProjects: string;
    suitableFor: string[];
  };
  externalUrl: string;
}

export interface Category {
  id: string;
  name: string;
  nameJa: string;
  icon: string;
  color: string;
  description: string;
  descriptionJa: string;
  assetCount: number;
}

export const categories: Category[] = [
  {
    id: 'carbon',
    name: 'Carbon',
    nameJa: 'カーボン',
    icon: 'leaf',
    color: '#22c55e',
    description: 'Invest in carbon credits and environmental initiatives',
    descriptionJa: 'カーボンクレジットと環境イニシアチブへの投資',
    assetCount: 12,
  },
  {
    id: 'whisky',
    name: 'Whisky Cask',
    nameJa: 'ウイスキー樽',
    icon: 'wine',
    color: '#d97706',
    description: 'Own a piece of premium aged whisky',
    descriptionJa: 'プレミアム熟成ウイスキーのオーナーに',
    assetCount: 8,
  },
  {
    id: 'regional',
    name: 'Regional',
    nameJa: '地域活性',
    icon: 'map-pin',
    color: '#3b82f6',
    description: 'Support local communities and regional development',
    descriptionJa: '地域コミュニティと地方創生を支援',
    assetCount: 15,
  },
  {
    id: 'energy',
    name: 'Energy',
    nameJa: 'サステナブルエネルギー',
    icon: 'zap',
    color: '#8b5cf6',
    description: 'Participate in sustainable energy projects',
    descriptionJa: '持続可能なエネルギープロジェクトに参加',
    assetCount: 10,
  },
  {
    id: 'culture',
    name: 'Culture',
    nameJa: '文化資産',
    icon: 'landmark',
    color: '#ec4899',
    description: 'Preserve and support cultural heritage',
    descriptionJa: '文化遺産の保存と支援',
    assetCount: 6,
  },
];

export const assets: Asset[] = [
  // Carbon
  {
    id: 'carbon-001',
    name: 'Amazon Rainforest Protection',
    category: 'Carbon',
    categoryId: 'carbon',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    shortDescription: 'Protecting 10,000 hectares of pristine rainforest',
    story: 'This project preserves a vital section of the Amazon rainforest, protecting biodiversity and capturing carbon. Local communities are involved in sustainable forest management, creating jobs while saving irreplaceable ecosystems.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Stable',
      liquidity: 'medium',
      riskFactors: {
        marketDependency: 'low',
        timeDependency: 'low',
        externalFactors: 'medium',
      },
      similarProjects: 'Similar forest conservation projects have shown consistent value appreciation as global carbon markets mature.',
      suitableFor: ['First-time investors', 'Long-term holders', 'Impact-focused investors'],
    },
    externalUrl: 'https://ango.jp/carbon/amazon-001',
  },
  {
    id: 'carbon-002',
    name: 'Japanese Cedar Reforestation',
    category: 'Carbon',
    categoryId: 'carbon',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80',
    shortDescription: 'Restoring ancient cedar forests in Nagano',
    story: 'A reforestation initiative in Nagano Prefecture, planting Japanese cedar trees on degraded land. This project combines carbon sequestration with traditional forestry practices.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Stable',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'low',
        timeDependency: 'high',
        externalFactors: 'low',
      },
      similarProjects: 'Reforestation projects typically show gradual but steady returns as trees mature over decades.',
      suitableFor: ['Patient investors', 'Story-driven investors', 'Japan-focused portfolios'],
    },
    externalUrl: 'https://ango.jp/carbon/cedar-002',
  },
  // Whisky
  {
    id: 'whisky-001',
    name: 'Scottish Highland Single Malt',
    category: 'Whisky Cask',
    categoryId: 'whisky',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80',
    shortDescription: '12-year aging premium Speyside whisky',
    story: 'A rare opportunity to own a cask of premium Speyside single malt from one of Scotland\'s most prestigious distilleries. Currently in its 8th year of aging.',
    aiInsights: {
      projectType: 'Mid-term',
      orientation: 'Growth',
      liquidity: 'medium',
      riskFactors: {
        marketDependency: 'medium',
        timeDependency: 'medium',
        externalFactors: 'low',
      },
      similarProjects: 'Premium Scottish whisky casks have historically appreciated as they age, with well-known distilleries showing stronger performance.',
      suitableFor: ['Whisky enthusiasts', 'Collectors', 'Alternative asset seekers'],
    },
    externalUrl: 'https://ango.jp/whisky/highland-001',
  },
  {
    id: 'whisky-002',
    name: 'Japanese Craft Whisky',
    category: 'Whisky Cask',
    categoryId: 'whisky',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
    shortDescription: 'Limited edition from award-winning distillery',
    story: 'Own a piece of Japanese whisky history. This cask is from a boutique distillery that has won multiple international awards for its unique flavor profile.',
    aiInsights: {
      projectType: 'Mid-term',
      orientation: 'Challenge',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'high',
        timeDependency: 'medium',
        externalFactors: 'medium',
      },
      similarProjects: 'Japanese whisky has seen significant global interest, though smaller distilleries carry more uncertainty.',
      suitableFor: ['Risk-tolerant investors', 'Japanese culture enthusiasts', 'Unique opportunity seekers'],
    },
    externalUrl: 'https://ango.jp/whisky/japan-002',
  },
  // Regional
  {
    id: 'regional-001',
    name: 'Kyoto Machiya Restoration',
    category: 'Regional',
    categoryId: 'regional',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    shortDescription: 'Preserving traditional Kyoto townhouses',
    story: 'Help restore and preserve historic machiya townhouses in Kyoto. These properties are converted into cultural spaces, boutique accommodations, and artisan workshops.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Stable',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'medium',
        timeDependency: 'low',
        externalFactors: 'low',
      },
      similarProjects: 'Heritage property restoration in major cultural cities has shown resilient demand, especially for tourism-related uses.',
      suitableFor: ['Cultural preservation advocates', 'Real estate diversifiers', 'Japan tourism believers'],
    },
    externalUrl: 'https://ango.jp/regional/kyoto-001',
  },
  {
    id: 'regional-002',
    name: 'Okinawa Coral Village',
    category: 'Regional',
    categoryId: 'regional',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
    shortDescription: 'Sustainable coastal community development',
    story: 'A sustainable development project in Okinawa combining eco-tourism, coral reef restoration, and community empowerment. Local fishermen and artisans are key stakeholders.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Challenge',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'medium',
        timeDependency: 'high',
        externalFactors: 'high',
      },
      similarProjects: 'Eco-tourism projects show high variability but those with strong community ties tend to be more resilient.',
      suitableFor: ['Impact-first investors', 'Long-term visionaries', 'Ocean conservation supporters'],
    },
    externalUrl: 'https://ango.jp/regional/okinawa-002',
  },
  // Energy
  {
    id: 'energy-001',
    name: 'Solar Farm Hokkaido',
    category: 'Energy',
    categoryId: 'energy',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    shortDescription: '50MW solar installation in northern Japan',
    story: 'A large-scale solar energy project in Hokkaido, utilizing the region\'s abundant land and favorable weather conditions. Connected to the main grid with long-term power purchase agreements.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Stable',
      liquidity: 'medium',
      riskFactors: {
        marketDependency: 'low',
        timeDependency: 'low',
        externalFactors: 'medium',
      },
      similarProjects: 'Grid-connected solar projects with PPAs have shown predictable performance, with returns tied to energy prices and policy frameworks.',
      suitableFor: ['Steady income seekers', 'Clean energy advocates', 'Infrastructure investors'],
    },
    externalUrl: 'https://ango.jp/energy/solar-001',
  },
  {
    id: 'energy-002',
    name: 'Offshore Wind Chiba',
    category: 'Energy',
    categoryId: 'energy',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80',
    shortDescription: 'Pioneering offshore wind in Japan',
    story: 'Part of Japan\'s first major offshore wind development. This project is helping establish the country\'s offshore wind industry while generating clean energy.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Growth',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'medium',
        timeDependency: 'high',
        externalFactors: 'high',
      },
      similarProjects: 'Early-stage renewable infrastructure can carry higher uncertainty but also potential for significant growth as the sector matures.',
      suitableFor: ['Growth seekers', 'Energy transition believers', 'Early adopters'],
    },
    externalUrl: 'https://ango.jp/energy/wind-002',
  },
  // Culture
  {
    id: 'culture-001',
    name: 'Traditional Craft Preservation',
    category: 'Culture',
    categoryId: 'culture',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    shortDescription: 'Supporting master artisans in Kanazawa',
    story: 'Preserve Japan\'s living cultural heritage by supporting master craftspeople in Kanazawa. This initiative funds apprenticeships, workshops, and digital documentation of rare techniques.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Stable',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'low',
        timeDependency: 'medium',
        externalFactors: 'low',
      },
      similarProjects: 'Cultural preservation projects often prioritize impact over returns, with value tied to cultural significance rather than market dynamics.',
      suitableFor: ['Impact investors', 'Cultural heritage advocates', 'Japan culture enthusiasts'],
    },
    externalUrl: 'https://ango.jp/culture/craft-001',
  },
  {
    id: 'culture-002',
    name: 'Historic Temple Restoration',
    category: 'Culture',
    categoryId: 'culture',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80',
    shortDescription: '400-year-old temple in rural Nara',
    story: 'Help restore a 400-year-old Buddhist temple in rural Nara Prefecture. The project includes preservation of ancient murals, structural repairs, and creating community gathering spaces.',
    aiInsights: {
      projectType: 'Long-term',
      orientation: 'Stable',
      liquidity: 'low',
      riskFactors: {
        marketDependency: 'low',
        timeDependency: 'low',
        externalFactors: 'low',
      },
      similarProjects: 'Religious and heritage site restoration projects typically focus on preservation rather than financial returns.',
      suitableFor: ['Heritage preservationists', 'Community supporters', 'Long-term impact investors'],
    },
    externalUrl: 'https://ango.jp/culture/temple-002',
  },
];

// Portfolio mock data
export interface PortfolioItem {
  assetId: string;
  amount: number;
  purchaseDate: string;
}

export const mockPortfolio: PortfolioItem[] = [
  { assetId: 'carbon-001', amount: 50000, purchaseDate: '2024-03-15' },
  { assetId: 'whisky-001', amount: 80000, purchaseDate: '2024-06-22' },
  { assetId: 'regional-001', amount: 120000, purchaseDate: '2024-01-10' },
  { assetId: 'energy-001', amount: 65000, purchaseDate: '2024-08-05' },
  { assetId: 'culture-001', amount: 35000, purchaseDate: '2024-09-18' },
];

export const getAssetById = (id: string): Asset | undefined => {
  return assets.find(asset => asset.id === id);
};

export const getAssetsByCategory = (categoryId: string): Asset[] => {
  return assets.filter(asset => asset.categoryId === categoryId);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};
