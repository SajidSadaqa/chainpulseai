export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.chainpulse.ai/v1';

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  updatedAt: string;
}

export interface MarketAPIResponse {
  data: MarketItem[];
  isStale: boolean;
  lastUpdated: string;
  error: string | null;
}

export async function fetchLiveMarkets(options?: { simulateError?: boolean; forceStale?: boolean; emptyData?: boolean }): Promise<MarketAPIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (options?.simulateError) {
        resolve({
          data: [],
          isStale: true,
          lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          error: 'شبكة الاتصال غير مستقرة - فشل جلب بيانات خادم محمود (HTTP 503)',
        });
        return;
      }

      if (options?.emptyData) {
        resolve({
          data: [],
          isStale: false,
          lastUpdated: new Date().toISOString(),
          error: null,
        });
        return;
      }

      const mockData: MarketItem[] = [
        { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64250.00, change24h: 2.5, volume24h: 34500000000, updatedAt: new Date().toISOString() },
        { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450.50, change24h: -1.2, volume24h: 18200000000, updatedAt: new Date().toISOString() },
        { id: '3', symbol: 'SOL', name: 'Solana', price: 145.80, change24h: 5.8, volume24h: 5400000000, updatedAt: new Date().toISOString() },
        { id: '4', symbol: 'AVAX', name: 'Avalanche', price: 28.40, change24h: 0.9, volume24h: 920000000, updatedAt: new Date().toISOString() },
      ];

      const lastUpdated = options?.forceStale 
        ? new Date(Date.now() - 10 * 60 * 1000).toISOString()
        : new Date().toISOString();

      resolve({
        data: mockData,
        isStale: options?.forceStale || false,
        lastUpdated,
        error: null,
      });
    }, 500);
  });
}