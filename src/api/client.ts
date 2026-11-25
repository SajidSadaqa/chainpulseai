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

// ============================================================================
// WEEK 6: Blockchain Explorer Types & Read-Only Public Lookup API
// ============================================================================

export type BlockchainNetworkId = 'ethereum' | 'bitcoin' | 'unsupported';

export interface BlockchainNetworkSummary {
  networkId: BlockchainNetworkId;
  networkName: string;
  chainDescriptor: string;
  latestBlock: string;
  blockUnit: string;
  baseFeeValue: string;
  baseFeeUnit: string;
  throughputValue: string;
  throughputUnit: string;
  updatedAt: string;
}

export interface BlockchainTxRecord {
  hash: string;
  networkName: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  blockHeight: string;
  confirmations: number;
  timestampUtc: string;
  fromAddress: string;
  toAddress: string;
  amountValue: string;
  amountUnit: string;
  feeValue: string;
  feeUnit: string;
}

export type BlockchainErrorCode =
  | 'INVALID_HASH'
  | 'NOT_FOUND'
  | 'PROVIDER_ERROR'
  | 'UNSUPPORTED_NETWORK';

export interface BlockchainLookupResponse {
  tx: BlockchainTxRecord | null;
  errorCode: BlockchainErrorCode | null;
  errorTitle: string | null;
  errorMessage: string | null;
}

export const SAMPLE_ETH_TX_HASH = '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060';
export const SAMPLE_BTC_TX_HASH = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
export const SAMPLE_NOT_FOUND_HASH = '0x000000000000000000000000000000000000000000000000000000000000dead';
export const SAMPLE_PROVIDER_ERROR_HASH = '0x9999999999999999999999999999999999999999999999999999999999999999';

const PUBLIC_TRANSACTIONS: Record<string, BlockchainTxRecord> = {
  [SAMPLE_ETH_TX_HASH.toLowerCase()]: {
    hash: SAMPLE_ETH_TX_HASH,
    networkName: 'Ethereum Mainnet',
    status: 'Confirmed',
    blockHeight: '#21,264,885',
    confirmations: 42,
    timestampUtc: '2026-11-25 13:15:24 UTC',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    amountValue: '2.4500',
    amountUnit: 'ETH',
    feeValue: '0.00042',
    feeUnit: 'ETH',
  },
  [SAMPLE_BTC_TX_HASH.toLowerCase()]: {
    hash: SAMPLE_BTC_TX_HASH,
    networkName: 'Bitcoin Mainnet',
    status: 'Confirmed',
    blockHeight: '#871,920',
    confirmations: 18,
    timestampUtc: '2026-11-25 12:48:10 UTC',
    fromAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    toAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amountValue: '0.38500000',
    amountUnit: 'BTC',
    feeValue: '0.00004120',
    feeUnit: 'BTC',
  },
};

export async function fetchBlockchainSummary(networkId: BlockchainNetworkId): Promise<BlockchainNetworkSummary> {
  const now = new Date().toISOString();
  if (networkId === 'bitcoin') {
    return {
      networkId: 'bitcoin',
      networkName: 'Bitcoin Mainnet',
      chainDescriptor: 'Network: BTC Mainnet (Public RPC)',
      latestBlock: '#871,938',
      blockUnit: 'Block Height',
      baseFeeValue: '14.2',
      baseFeeUnit: 'sat/vB',
      throughputValue: '6.8',
      throughputUnit: 'tx/sec',
      updatedAt: now,
    };
  }

  return {
    networkId: 'ethereum',
    networkName: 'Ethereum Mainnet',
    chainDescriptor: 'Network: ETH Mainnet (Chain ID: 1)',
    latestBlock: '#21,264,927',
    blockUnit: 'Block Height',
    baseFeeValue: '18.4',
    baseFeeUnit: 'Gwei',
    throughputValue: '15.4',
    throughputUnit: 'tx/sec',
    updatedAt: now,
  };
}

export async function searchBlockchainTransaction(
  rawHash: string,
  networkId: BlockchainNetworkId
): Promise<BlockchainLookupResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trimmed = rawHash.trim();

      // 1. Unsupported network check
      if (networkId === 'unsupported') {
        resolve({
          tx: null,
          errorCode: 'UNSUPPORTED_NETWORK',
          errorTitle: 'Unsupported Network Selected',
          errorMessage:
            'هذه الشبكة غير مدعومة حالياً في المستكشف. الشبكات المتاحة للقراءة العامة هي: Ethereum Mainnet و Bitcoin Mainnet.',
        });
        return;
      }

      // 2. Hash format validation
      const isEthFormat = /^0x[a-fA-F0-9]{64}$/.test(trimmed);
      const isBtcFormat = /^[a-fA-F0-9]{64}$/.test(trimmed);

      if (!trimmed || (networkId === 'ethereum' && !isEthFormat) || (networkId === 'bitcoin' && !isBtcFormat)) {
        const expectedHint =
          networkId === 'ethereum'
            ? 'يجب أن يبدأ الهاش بـ 0x ويتكون من 66 خانة سداسية عشرية (Hex).'
            : 'يجب أن يتكون هاش البيتكوين من 64 خانة سداسية عشرية (Hex) بدون 0x.';

        resolve({
          tx: null,
          errorCode: 'INVALID_HASH',
          errorTitle: 'Invalid Transaction Hash Format',
          errorMessage: `صيغة رقم المعاملة غير صحيحة لشبكة ${networkId === 'ethereum' ? 'Ethereum' : 'Bitcoin'}. ${expectedHint}`,
        });
        return;
      }

      // 3. Normalized backend/provider RPC error
      if (trimmed.toLowerCase() === SAMPLE_PROVIDER_ERROR_HASH) {
        resolve({
          tx: null,
          errorCode: 'PROVIDER_ERROR',
          errorTitle: 'Blockchain Provider Error (HTTP 502)',
          errorMessage:
            'تعذر الاتصال بعقدة المزود الخارجي (RPC Node Timeout). يرجى إعادة المحاولة بعد قليل.',
        });
        return;
      }

      // 4. Lookup known public transaction
      const found = PUBLIC_TRANSACTIONS[trimmed.toLowerCase()];
      if (!found) {
        resolve({
          tx: null,
          errorCode: 'NOT_FOUND',
          errorTitle: 'Transaction Not Found',
          errorMessage:
            'الهاش صحيح الصيغة لكن لم يتم العثور على المعاملة في السجل العام أو أنها لم تُؤكد بعد على هذه الشبكة.',
        });
        return;
      }

      resolve({
        tx: found,
        errorCode: null,
        errorTitle: null,
        errorMessage: null,
      });
    }, 300);
  });
}