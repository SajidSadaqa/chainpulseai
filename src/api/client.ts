export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.chainpulse.ai/v1';

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  updatedAt: string;
}

export interface MarketKPI {
  id: string;
  label: string;
  value: string;
  unit: string;
  period: string;
  delta: string;
  isPositive: boolean;
}

export interface MarketAPIResponse {
  data: MarketItem[];
  kpis: MarketKPI[];
  isStale: boolean;
  lastUpdated: string;
  error: string | null;
}

export type PeriodKey = '24H' | '7D' | '30D' | '90D';

export interface CoinHistoryPoint {
  timestamp: string;
  priceUsd: number;
  volumeBillions: number;
}

export interface CoinDetailResponse {
  symbol: string;
  name: string;
  currentPriceUsd: number;
  changePercent: number;
  period: PeriodKey;
  priceUnit: string;
  volumeUnit: string;
  series: CoinHistoryPoint[];
}

export interface AnalyticsOverviewResponse {
  movingAverage: {
    metric: string;
    windowLabel: string;
    unit: string;
    dates: string[];
    spotPrice: number[];
    sma7: number[];
    sma30: number[];
  };
  volatility: {
    metric: string;
    windowLabel: string;
    unit: string;
    assets: string[];
    values: number[];
  };
  correlation: {
    metric: string;
    windowLabel: string;
    scaleLabel: string;
    assets: string[];
    matrix: [number, number, number][];
  };
}

const MARKET_ITEMS: MarketItem[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64250.0, change24h: 2.5, volume24h: 34500000000, marketCap: 1265000000000, updatedAt: new Date().toISOString() },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450.5, change24h: -1.2, volume24h: 18200000000, marketCap: 415000000000, updatedAt: new Date().toISOString() },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 145.8, change24h: 5.8, volume24h: 5400000000, marketCap: 68500000000, updatedAt: new Date().toISOString() },
  { id: '4', symbol: 'AVAX', name: 'Avalanche', price: 28.4, change24h: -2.4, volume24h: 920000000, marketCap: 11200000000, updatedAt: new Date().toISOString() },
];

export async function fetchLiveMarkets(options?: { simulateError?: boolean; forceStale?: boolean; emptyData?: boolean }): Promise<MarketAPIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (options?.simulateError) {
        resolve({
          data: [],
          kpis: [],
          isStale: true,
          lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          error: 'شبكة الاتصال غير مستقرة - فشل جلب بيانات خادم محمود (HTTP 503)',
        });
        return;
      }

      if (options?.emptyData) {
        resolve({
          data: [],
          kpis: [],
          isStale: false,
          lastUpdated: new Date().toISOString(),
          error: null,
        });
        return;
      }

      const kpis: MarketKPI[] = [
        { id: 'mcap', label: 'Total Market Cap', value: '$2.34T', unit: 'USD ($)', period: '24h Window', delta: '+1.85%', isPositive: true },
        { id: 'vol', label: '24h Trading Volume', value: '$84.2B', unit: 'USD ($)', period: '24h Window', delta: '+6.40%', isPositive: true },
        { id: 'dom', label: 'BTC Market Dominance', value: '54.1%', unit: 'Market Share (%)', period: '24h Window', delta: '+0.32%', isPositive: true },
        { id: 'fear', label: 'Volatility Index', value: '42.8', unit: 'Index Points (0-100)', period: '24h Window', delta: '-1.15%', isPositive: false },
      ];

      const lastUpdated = options?.forceStale
        ? new Date(Date.now() - 10 * 60 * 1000).toISOString()
        : new Date().toISOString();

      resolve({
        data: MARKET_ITEMS,
        kpis,
        isStale: options?.forceStale || false,
        lastUpdated,
        error: null,
      });
    }, 350);
  });
}

export async function fetchCoinDetail(symbol: string, period: PeriodKey): Promise<CoinDetailResponse> {
  const upper = symbol.toUpperCase();
  const baseCoin = MARKET_ITEMS.find((c) => c.symbol === upper) || MARKET_ITEMS[0];

  const periodConfig: Record<PeriodKey, { labels: string[]; factors: number[]; volFactors: number[]; change: number }> = {
    '24H': {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
      factors: [0.975, 0.981, 0.978, 0.989, 0.994, 0.998, 1.0],
      volFactors: [0.85, 0.78, 0.92, 1.15, 1.08, 1.21, 1.0],
      change: baseCoin.change24h,
    },
    '7D': {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      factors: [0.92, 0.94, 0.93, 0.96, 0.98, 0.99, 1.0],
      volFactors: [0.9, 1.05, 0.88, 1.12, 1.25, 1.1, 1.0],
      change: Number((baseCoin.change24h * 2.4).toFixed(2)),
    },
    '30D': {
      labels: ['W1', 'W2', 'W3', 'W4', 'Current'],
      factors: [0.86, 0.91, 0.89, 0.96, 1.0],
      volFactors: [0.95, 1.18, 0.82, 1.14, 1.0],
      change: Number((baseCoin.change24h * 4.8).toFixed(2)),
    },
    '90D': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      factors: [0.78, 0.89, 1.0],
      volFactors: [0.88, 1.12, 1.0],
      change: Number((baseCoin.change24h * 8.1).toFixed(2)),
    },
  };

  const cfg = periodConfig[period];
  const baseVolB = Number((baseCoin.volume24h / 1e9).toFixed(2));

  const series: CoinHistoryPoint[] = cfg.labels.map((label, idx) => ({
    timestamp: label,
    priceUsd: Number((baseCoin.price * cfg.factors[idx]).toFixed(2)),
    volumeBillions: Number((baseVolB * cfg.volFactors[idx]).toFixed(2)),
  }));

  return {
    symbol: baseCoin.symbol,
    name: baseCoin.name,
    currentPriceUsd: baseCoin.price,
    changePercent: cfg.change,
    period,
    priceUnit: 'USD ($)',
    volumeUnit: 'Billions USD ($B)',
    series,
  };
}

export async function fetchAnalyticsData(): Promise<AnalyticsOverviewResponse> {
  return {
    movingAverage: {
      metric: 'BTC Spot Price vs Simple Moving Averages (SMA-7 & SMA-30)',
      windowLabel: '30-Day Daily Close Window',
      unit: 'USD ($)',
      dates: ['D-25', 'D-20', 'D-15', 'D-10', 'D-5', 'Today'],
      spotPrice: [59200, 60800, 60100, 62400, 63500, 64250],
      sma7: [58900, 59800, 60300, 61200, 62600, 63400],
      sma30: [57500, 58100, 58800, 59500, 60400, 61150],
    },
    volatility: {
      metric: 'Annualized Price Volatility (%)',
      windowLabel: '14-Day Rolling Window',
      unit: 'Percentage (%)',
      assets: ['BTC', 'ETH', 'SOL', 'AVAX'],
      values: [38.4, 46.2, 64.8, 71.5],
    },
    correlation: {
      metric: 'Pairwise Return Correlation (Pearson r)',
      windowLabel: '30-Day Daily Returns Window',
      scaleLabel: '-1.0 (Inverse) to +1.0 (Positive)',
      assets: ['BTC', 'ETH', 'SOL', 'AVAX'],
      matrix: [
        [0, 0, 1.0], [0, 1, 0.86], [0, 2, 0.74], [0, 3, 0.69],
        [1, 0, 0.86], [1, 1, 1.0], [1, 2, 0.79], [1, 3, 0.75],
        [2, 0, 0.74], [2, 1, 0.79], [2, 2, 1.0], [2, 3, 0.82],
        [3, 0, 0.69], [3, 1, 0.75], [3, 2, 0.82], [3, 3, 1.0],
      ],
    },
  };
}