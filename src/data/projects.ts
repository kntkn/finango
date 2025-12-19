// Project & Asset Data for Finango RWA Marketplace

export interface Project {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  image: string;
  color: string;
  icon: string;
  category: 'membership' | 'nft' | 'investment' | 'experience';
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  image: string;
  price: number;
  unit: string;
  unitJa: string;
  available: number;
  sold: number;
  externalUrl: string;
}

export interface TokenBalance {
  tokenId: string;
  name: string;
  symbol: string;
  balance: number;
  color: string;
  icon: string;
}

export interface TokenBenefit {
  id: string;
  tokenId: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  cost: number;
  image: string;
}

export interface PortfolioItem {
  assetId: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number;
}

// ============================================
// 9 PROJECTS
// ============================================

export const projects: Project[] = [
  {
    id: 'unicask',
    name: 'UniCask',
    nameJa: 'UniCask',
    description: 'Fractional ownership of premium whisky casks. Own a piece of rare aged whisky.',
    descriptionJa: 'プレミアムウイスキー樽の小口保有権。希少な熟成ウイスキーの一部を所有。',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800',
    color: '#d97706',
    icon: 'wine',
    category: 'investment',
  },
  {
    id: 'decopon',
    name: 'Decopon',
    nameJa: 'Decopon',
    description: 'J-Credit NFTs for carbon offset. Each NFT represents 1 ton of verified carbon credits.',
    descriptionJa: 'カーボンオフセット用Jクレジット NFT。各NFTは1トンの認証済みカーボンクレジット。',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    color: '#22c55e',
    icon: 'leaf',
    category: 'nft',
  },
  {
    id: 'japango',
    name: 'JAPANGO',
    nameJa: 'JAPANGO',
    description: 'Premium membership NFTs with exclusive travel and wellness benefits.',
    descriptionJa: '旅行とウェルネス特典付きプレミアムメンバーシップNFT。',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    color: '#ec4899',
    icon: 'sparkles',
    category: 'membership',
  },
  {
    id: 'ango',
    name: 'ANGO',
    nameJa: 'ANGO',
    description: 'Renovated kominka (traditional Japanese house) membership with 1-week stay rights.',
    descriptionJa: '古民家再生メンバーシップ。1週間の宿泊権利付き。',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
    color: '#3b82f6',
    icon: 'home',
    category: 'membership',
  },
  {
    id: 'nanjo',
    name: 'Nanjo City, Okinawa',
    nameJa: '沖縄県南城市',
    description: 'Experience NFTs for exclusive local events and tours in Nanjo City.',
    descriptionJa: '南城市限定イベント・ツアー参加権NFT。',
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800',
    color: '#06b6d4',
    icon: 'palmtree',
    category: 'experience',
  },
  {
    id: 'ikusaka',
    name: 'Ikusaka Village, Nagano',
    nameJa: '長野県生坂村',
    description: 'Rural experience NFTs for farming, nature, and local culture activities.',
    descriptionJa: '農業・自然・地域文化体験NFT。',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
    color: '#84cc16',
    icon: 'mountain',
    category: 'experience',
  },
  {
    id: 'tono',
    name: 'Tono City, Iwate',
    nameJa: '岩手県遠野市',
    description: 'Festival participation and horseback riding experience NFTs.',
    descriptionJa: '祭り参加・乗馬体験NFT。',
    image: 'https://images.unsplash.com/photo-1553755322-56baa43a694c?w=800',
    color: '#f59e0b',
    icon: 'flag',
    category: 'experience',
  },
  {
    id: 'ipc-space',
    name: 'IPC Space Travel',
    nameJa: 'IPC宇宙旅行',
    description: 'Boarding pass NFTs for suborbital space travel. Queue position determines priority.',
    descriptionJa: '準軌道宇宙旅行の搭乗整理券NFT。番号順で搭乗優先権。',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    color: '#8b5cf6',
    icon: 'rocket',
    category: 'nft',
  },
  {
    id: 'movie-set',
    name: 'Movie Set NFT',
    nameJa: '映画セットNFT',
    description: 'Own props and furniture from major film productions. Delivered after filming.',
    descriptionJa: '映画撮影で使用されたセット・小道具の所有権NFT。撮影終了後に配送。',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    color: '#ef4444',
    icon: 'clapperboard',
    category: 'nft',
  },
];

// ============================================
// ASSETS BY PROJECT
// ============================================

export const assets: Asset[] = [
  // UniCask - 2 whisky casks
  {
    id: 'unicask-hanyu-10',
    projectId: 'unicask',
    name: 'Hanyu 10 Year 1/100',
    nameJa: '羽生 10年 1/100',
    description: 'Fractional ownership of a rare Hanyu 10-year single malt cask.',
    descriptionJa: '希少な羽生10年シングルモルト樽の1/100小口保有権。',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    price: 150000,
    unit: '1/100 share',
    unitJa: '1/100 口',
    available: 23,
    sold: 77,
    externalUrl: 'https://ango.jp/unicask/hanyu-10',
  },
  {
    id: 'unicask-springbank-30',
    projectId: 'unicask',
    name: 'Springbank 30 Year 1/100',
    nameJa: 'スプリングバンク 30年 1/100',
    description: 'Fractional ownership of a legendary Springbank 30-year cask.',
    descriptionJa: '伝説のスプリングバンク30年樽の1/100小口保有権。',
    image: 'https://images.unsplash.com/photo-1582819509237-d24b35f4e2bb?w=800',
    price: 500000,
    unit: '1/100 share',
    unitJa: '1/100 口',
    available: 45,
    sold: 55,
    externalUrl: 'https://ango.jp/unicask/springbank-30',
  },

  // Decopon - 5 J-Credit NFTs
  {
    id: 'decopon-forest-hokkaido',
    projectId: 'decopon',
    name: 'Hokkaido Forest Credit',
    nameJa: '北海道森林クレジット',
    description: '1 ton carbon credit from Hokkaido forest conservation project.',
    descriptionJa: '北海道森林保全プロジェクトの1トンカーボンクレジット。',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800',
    price: 3000,
    unit: '1 ton',
    unitJa: '1トン',
    available: 500,
    sold: 234,
    externalUrl: 'https://ango.jp/decopon/hokkaido-forest',
  },
  {
    id: 'decopon-solar-kyushu',
    projectId: 'decopon',
    name: 'Kyushu Solar Credit',
    nameJa: '九州太陽光クレジット',
    description: '1 ton carbon credit from Kyushu solar power project.',
    descriptionJa: '九州太陽光発電プロジェクトの1トンカーボンクレジット。',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    price: 2500,
    unit: '1 ton',
    unitJa: '1トン',
    available: 800,
    sold: 412,
    externalUrl: 'https://ango.jp/decopon/kyushu-solar',
  },
  {
    id: 'decopon-wind-tohoku',
    projectId: 'decopon',
    name: 'Tohoku Wind Credit',
    nameJa: '東北風力クレジット',
    description: '1 ton carbon credit from Tohoku wind power project.',
    descriptionJa: '東北風力発電プロジェクトの1トンカーボンクレジット。',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800',
    price: 2800,
    unit: '1 ton',
    unitJa: '1トン',
    available: 600,
    sold: 189,
    externalUrl: 'https://ango.jp/decopon/tohoku-wind',
  },
  {
    id: 'decopon-biomass-shikoku',
    projectId: 'decopon',
    name: 'Shikoku Biomass Credit',
    nameJa: '四国バイオマスクレジット',
    description: '1 ton carbon credit from Shikoku biomass energy project.',
    descriptionJa: '四国バイオマスエネルギープロジェクトの1トンカーボンクレジット。',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    price: 3200,
    unit: '1 ton',
    unitJa: '1トン',
    available: 400,
    sold: 156,
    externalUrl: 'https://ango.jp/decopon/shikoku-biomass',
  },
  {
    id: 'decopon-mangrove-okinawa',
    projectId: 'decopon',
    name: 'Okinawa Mangrove Credit',
    nameJa: '沖縄マングローブクレジット',
    description: '1 ton blue carbon credit from Okinawa mangrove restoration.',
    descriptionJa: '沖縄マングローブ再生のブルーカーボン1トンクレジット。',
    image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
    price: 4500,
    unit: '1 ton',
    unitJa: '1トン',
    available: 200,
    sold: 78,
    externalUrl: 'https://ango.jp/decopon/okinawa-mangrove',
  },

  // JAPANGO - 2 memberships
  {
    id: 'japango-stay-2nights',
    projectId: 'japango',
    name: '2-Night Stay Membership',
    nameJa: '2泊無料メンバーシップ',
    description: 'NFT membership with 2 free nights at JAPANGO partner ryokans.',
    descriptionJa: 'JAPANGO提携旅館での2泊無料宿泊権付きメンバーシップNFT。',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    price: 80000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 100,
    sold: 34,
    externalUrl: 'https://ango.jp/japango/stay-2nights',
  },
  {
    id: 'japango-yoga',
    projectId: 'japango',
    name: 'Yoga Experience Membership',
    nameJa: 'ヨガ体験メンバーシップ',
    description: 'NFT membership with exclusive yoga retreat access.',
    descriptionJa: '限定ヨガリトリート参加権付きメンバーシップNFT。',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
    price: 50000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 150,
    sold: 67,
    externalUrl: 'https://ango.jp/japango/yoga',
  },

  // ANGO - 5 kominka memberships
  {
    id: 'ango-nasu',
    projectId: 'ango',
    name: 'Nasu Kominka Membership',
    nameJa: '那須古民家メンバーシップ',
    description: 'Renovated kominka in Nasu with 1-week annual stay rights.',
    descriptionJa: '那須の再生古民家。年間1週間の宿泊権付き。',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
    price: 300000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 50,
    sold: 23,
    externalUrl: 'https://ango.jp/ango/nasu',
  },
  {
    id: 'ango-kujukuri',
    projectId: 'ango',
    name: 'Kujukuri Kominka Membership',
    nameJa: '九十九里古民家メンバーシップ',
    description: 'Beachside kominka in Kujukuri with 1-week annual stay rights.',
    descriptionJa: '九十九里海沿いの再生古民家。年間1週間の宿泊権付き。',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    price: 350000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 40,
    sold: 18,
    externalUrl: 'https://ango.jp/ango/kujukuri',
  },
  {
    id: 'ango-atami',
    projectId: 'ango',
    name: 'Atami Kominka Membership',
    nameJa: '熱海古民家メンバーシップ',
    description: 'Hot spring kominka in Atami with 1-week annual stay rights.',
    descriptionJa: '熱海温泉地の再生古民家。年間1週間の宿泊権付き。',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
    price: 400000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 35,
    sold: 21,
    externalUrl: 'https://ango.jp/ango/atami',
  },
  {
    id: 'ango-yugawara',
    projectId: 'ango',
    name: 'Yugawara Kominka Membership',
    nameJa: '湯河原古民家メンバーシップ',
    description: 'Mountain retreat kominka in Yugawara with 1-week annual stay rights.',
    descriptionJa: '湯河原の山間再生古民家。年間1週間の宿泊権付き。',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    price: 280000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 45,
    sold: 12,
    externalUrl: 'https://ango.jp/ango/yugawara',
  },
  {
    id: 'ango-yamanakako',
    projectId: 'ango',
    name: 'Yamanakako Kominka Membership',
    nameJa: '山中湖古民家メンバーシップ',
    description: 'Lakeside kominka near Mt. Fuji with 1-week annual stay rights.',
    descriptionJa: '富士山麓・山中湖畔の再生古民家。年間1週間の宿泊権付き。',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800',
    price: 450000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 30,
    sold: 19,
    externalUrl: 'https://ango.jp/ango/yamanakako',
  },

  // Nanjo City - 3 experience NFTs
  {
    id: 'nanjo-sefa-tour',
    projectId: 'nanjo',
    name: 'Sefa Utaki Sacred Tour',
    nameJa: '斎場御嶽スピリチュアルツアー',
    description: 'Exclusive guided tour of the UNESCO World Heritage Sefa Utaki.',
    descriptionJa: 'ユネスコ世界遺産・斎場御嶽の限定ガイドツアー参加権。',
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800',
    price: 15000,
    unit: '1 experience',
    unitJa: '1回',
    available: 200,
    sold: 89,
    externalUrl: 'https://ango.jp/nanjo/sefa-tour',
  },
  {
    id: 'nanjo-cafe-hopping',
    projectId: 'nanjo',
    name: 'Ocean View Cafe Tour',
    nameJa: 'オーシャンビューカフェ巡り',
    description: 'Guided tour of scenic cafes along the Nanjo coastline.',
    descriptionJa: '南城市海岸線の絶景カフェ巡りツアー参加権。',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    price: 8000,
    unit: '1 experience',
    unitJa: '1回',
    available: 300,
    sold: 145,
    externalUrl: 'https://ango.jp/nanjo/cafe-tour',
  },
  {
    id: 'nanjo-nirai-sunset',
    projectId: 'nanjo',
    name: 'Nirai Kanai Sunset Event',
    nameJa: 'ニライカナイ夕日イベント',
    description: 'Exclusive sunset viewing event at the Nirai Kanai Bridge.',
    descriptionJa: 'ニライカナイ橋での限定サンセットイベント参加権。',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800',
    price: 12000,
    unit: '1 experience',
    unitJa: '1回',
    available: 100,
    sold: 56,
    externalUrl: 'https://ango.jp/nanjo/nirai-sunset',
  },

  // Ikusaka Village - 3 experience NFTs
  {
    id: 'ikusaka-rice-farming',
    projectId: 'ikusaka',
    name: 'Rice Farming Experience',
    nameJa: '棚田米作り体験',
    description: 'Hands-on rice planting and harvesting in terraced paddies.',
    descriptionJa: '棚田での田植え・稲刈り体験参加権。',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    price: 10000,
    unit: '1 experience',
    unitJa: '1回',
    available: 150,
    sold: 67,
    externalUrl: 'https://ango.jp/ikusaka/rice-farming',
  },
  {
    id: 'ikusaka-stargazing',
    projectId: 'ikusaka',
    name: 'Mountain Stargazing Night',
    nameJa: '山間星空観察会',
    description: 'Exclusive stargazing event in the pollution-free mountain air.',
    descriptionJa: '光害ゼロの山間部での限定星空観察イベント。',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800',
    price: 8000,
    unit: '1 experience',
    unitJa: '1回',
    available: 100,
    sold: 34,
    externalUrl: 'https://ango.jp/ikusaka/stargazing',
  },
  {
    id: 'ikusaka-soba-making',
    projectId: 'ikusaka',
    name: 'Artisan Soba Workshop',
    nameJa: '職人蕎麦打ち体験',
    description: 'Learn traditional soba making from local artisans.',
    descriptionJa: '地元職人から学ぶ伝統蕎麦打ち体験。',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    price: 12000,
    unit: '1 experience',
    unitJa: '1回',
    available: 80,
    sold: 45,
    externalUrl: 'https://ango.jp/ikusaka/soba-making',
  },

  // Tono City - 3 experience NFTs
  {
    id: 'tono-festival',
    projectId: 'tono',
    name: 'Tono Matsuri Participation',
    nameJa: '遠野まつり参加権',
    description: 'Participate in the famous Tono Festival as a local member.',
    descriptionJa: '遠野まつりに地元メンバーとして参加できる権利。',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800',
    price: 25000,
    unit: '1 experience',
    unitJa: '1回',
    available: 50,
    sold: 23,
    externalUrl: 'https://ango.jp/tono/festival',
  },
  {
    id: 'tono-horseback',
    projectId: 'tono',
    name: 'Chagu Chagu Umakko Ride',
    nameJa: 'チャグチャグ馬コ乗馬体験',
    description: 'Horseback riding experience with traditional Chagu Chagu horses.',
    descriptionJa: '伝統のチャグチャグ馬コでの乗馬体験。',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
    price: 18000,
    unit: '1 experience',
    unitJa: '1回',
    available: 100,
    sold: 56,
    externalUrl: 'https://ango.jp/tono/horseback',
  },
  {
    id: 'tono-kappa-legend',
    projectId: 'tono',
    name: 'Kappa Legend Night Tour',
    nameJa: 'カッパ伝説ナイトツアー',
    description: 'Nighttime tour exploring the legendary Kappa folklore of Tono.',
    descriptionJa: '遠野物語のカッパ伝説を巡るナイトツアー。',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
    price: 8000,
    unit: '1 experience',
    unitJa: '1回',
    available: 150,
    sold: 78,
    externalUrl: 'https://ango.jp/tono/kappa-tour',
  },

  // IPC Space Travel - 2 boarding passes
  {
    id: 'ipc-boarding-101',
    projectId: 'ipc-space',
    name: 'Boarding Pass #101-200',
    nameJa: '搭乗整理券 #101-200',
    description: 'Priority boarding pass for early space travelers. Queue position 101-200.',
    descriptionJa: '優先搭乗整理券。搭乗順位 101-200番。',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    price: 5000000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 45,
    sold: 55,
    externalUrl: 'https://ango.jp/ipc-space/boarding-101',
  },
  {
    id: 'ipc-boarding-500',
    projectId: 'ipc-space',
    name: 'Boarding Pass #500+',
    nameJa: '搭乗整理券 #500以降',
    description: 'Standard boarding pass for space travel. Queue position 500 onwards.',
    descriptionJa: '標準搭乗整理券。搭乗順位 500番以降。',
    image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800',
    price: 2000000,
    unit: '1 NFT',
    unitJa: '1 NFT',
    available: 300,
    sold: 123,
    externalUrl: 'https://ango.jp/ipc-space/boarding-500',
  },

  // Movie Set NFT - 5 props
  {
    id: 'movie-desk',
    projectId: 'movie-set',
    name: 'Prosecutor\'s Desk',
    nameJa: '検察官デスク',
    description: 'The iconic desk used in the prosecutor\'s office scenes.',
    descriptionJa: '検察官執務室シーンで使用されたデスク。',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
    price: 500000,
    unit: '1 item',
    unitJa: '1点',
    available: 1,
    sold: 0,
    externalUrl: 'https://ango.jp/movie-set/desk',
  },
  {
    id: 'movie-suit',
    projectId: 'movie-set',
    name: 'Lead Actor Suit',
    nameJa: '主演スーツ',
    description: 'The signature suit worn by the lead actor in key scenes.',
    descriptionJa: '主演俳優が重要シーンで着用したスーツ。',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    price: 800000,
    unit: '1 item',
    unitJa: '1点',
    available: 1,
    sold: 0,
    externalUrl: 'https://ango.jp/movie-set/suit',
  },
  {
    id: 'movie-chair',
    projectId: 'movie-set',
    name: 'Courtroom Chair',
    nameJa: '法廷チェア',
    description: 'Authentic courtroom chair from the trial scenes.',
    descriptionJa: '裁判シーンで使用された法廷用チェア。',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    price: 150000,
    unit: '1 item',
    unitJa: '1点',
    available: 5,
    sold: 2,
    externalUrl: 'https://ango.jp/movie-set/chair',
  },
  {
    id: 'movie-lamp',
    projectId: 'movie-set',
    name: 'Office Desk Lamp',
    nameJa: 'オフィスデスクランプ',
    description: 'Vintage desk lamp from the prosecutor\'s office.',
    descriptionJa: '検察官執務室のヴィンテージデスクランプ。',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    price: 80000,
    unit: '1 item',
    unitJa: '1点',
    available: 3,
    sold: 1,
    externalUrl: 'https://ango.jp/movie-set/lamp',
  },
  {
    id: 'movie-briefcase',
    projectId: 'movie-set',
    name: 'Evidence Briefcase',
    nameJa: '証拠品ブリーフケース',
    description: 'The briefcase used to carry key evidence in the film.',
    descriptionJa: '映画内で重要な証拠を運ぶのに使用されたブリーフケース。',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    price: 120000,
    unit: '1 item',
    unitJa: '1点',
    available: 2,
    sold: 1,
    externalUrl: 'https://ango.jp/movie-set/briefcase',
  },
];

// ============================================
// MOCK PORTFOLIO & TOKENS
// ============================================

export const mockPortfolio: PortfolioItem[] = [
  { assetId: 'unicask-hanyu-10', quantity: 2, purchaseDate: '2024-03-15', purchasePrice: 150000 },
  { assetId: 'ango-nasu', quantity: 1, purchaseDate: '2024-06-22', purchasePrice: 300000 },
  { assetId: 'decopon-forest-hokkaido', quantity: 10, purchaseDate: '2024-01-10', purchasePrice: 3000 },
  { assetId: 'nanjo-sefa-tour', quantity: 2, purchaseDate: '2024-08-05', purchasePrice: 15000 },
  { assetId: 'ipc-boarding-500', quantity: 1, purchaseDate: '2024-09-18', purchasePrice: 2000000 },
];

export const mockTokens: TokenBalance[] = [
  { tokenId: 'ango', name: 'ANGO', symbol: 'ANGO', balance: 1200, color: '#3b82f6', icon: 'home' },
  { tokenId: 'nanjo', name: '南城', symbol: 'NANJO', balance: 500, color: '#06b6d4', icon: 'palmtree' },
  { tokenId: 'space', name: '宇宙', symbol: 'SPACE', balance: 300, color: '#8b5cf6', icon: 'rocket' },
];

// Token benefits - what you can exchange tokens for
export const tokenBenefits: TokenBenefit[] = [
  // ANGO token benefits
  {
    id: 'ango-1night',
    tokenId: 'ango',
    name: '1 Night Stay',
    nameJa: '1泊宿泊',
    description: 'Stay 1 night at any ANGO kominka property',
    descriptionJa: 'ANGOの古民家に1泊宿泊',
    cost: 10,
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800',
  },
  {
    id: 'ango-bbq',
    tokenId: 'ango',
    name: 'BBQ Set',
    nameJa: 'BBQセット',
    description: 'Premium BBQ set for your stay',
    descriptionJa: '滞在時のプレミアムBBQセット',
    cost: 5,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
  },
  {
    id: 'ango-onsen',
    tokenId: 'ango',
    name: 'Private Onsen',
    nameJa: '貸切温泉',
    description: '2-hour private onsen session',
    descriptionJa: '2時間の貸切温泉利用',
    cost: 3,
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
  },
  // Nanjo token benefits
  {
    id: 'nanjo-tour',
    tokenId: 'nanjo',
    name: 'Guided Tour',
    nameJa: 'ガイドツアー',
    description: 'Half-day guided tour of Nanjo highlights',
    descriptionJa: '南城市の名所を巡る半日ガイドツアー',
    cost: 20,
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800',
  },
  {
    id: 'nanjo-lunch',
    tokenId: 'nanjo',
    name: 'Local Lunch',
    nameJa: '地元ランチ',
    description: 'Traditional Okinawan lunch at partner restaurant',
    descriptionJa: '提携レストランでの沖縄料理ランチ',
    cost: 8,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  },
  // Space token benefits
  {
    id: 'space-vr',
    tokenId: 'space',
    name: 'VR Experience',
    nameJa: 'VR体験',
    description: 'Space travel VR simulation experience',
    descriptionJa: '宇宙旅行VRシミュレーション体験',
    cost: 15,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
  },
  {
    id: 'space-meetup',
    tokenId: 'space',
    name: 'Astronaut Meetup',
    nameJa: '宇宙飛行士交流会',
    description: 'Exclusive meetup with astronaut trainees',
    descriptionJa: '宇宙飛行士訓練生との限定交流会',
    cost: 50,
    image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800',
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getAssetById(id: string): Asset | undefined {
  return assets.find(a => a.id === id);
}

export function getAssetsByProject(projectId: string): Asset[] {
  return assets.filter(a => a.projectId === projectId);
}

export function getProjectByAsset(assetId: string): Project | undefined {
  const asset = getAssetById(assetId);
  if (!asset) return undefined;
  return getProjectById(asset.projectId);
}

export function getBenefitsByToken(tokenId: string): TokenBenefit[] {
  return tokenBenefits.filter(b => b.tokenId === tokenId);
}
