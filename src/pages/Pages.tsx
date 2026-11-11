import React, { useState, useEffect } from 'react';
import { Card, PageHeader, LoadingState, ErrorState, EmptyState, FreshnessIndicator, Badge } from '../components/UI';
import { MarketTable } from '../components/MarketTable';
import { fetchLiveMarkets, MarketItem, API_BASE_URL } from '../api/client';

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MarketItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadData = async (mode?: 'error' | 'stale' | 'empty' | 'normal') => {
    setLoading(true);
    setError(null);
    const res = await fetchLiveMarkets({
      simulateError: mode === 'error',
      forceStale: mode === 'stale',
      emptyData: mode === 'empty',
    });

    if (res.error) {
      setError(res.error);
    } else {
      setData(res.data);
      setIsStale(res.isStale);
      setLastUpdated(res.lastUpdated);
    }
    setLoading(false);
  };

  useEffect(() => { loadData('normal'); }, []);

  return (
    <div>
      <PageHeader title="Live Market Overview" subtitle="Real-time integration with backend endpoints and state management." />

      <Card title="محاكاة حالات الشبكة (للعرض في الـ Review)">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => loadData('normal')} style={{ padding: '8px 12px', background: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Live Normal Data</button>
          <button onClick={() => loadData('stale')} style={{ padding: '8px 12px', background: '#d69e2e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Stale Data (&gt;5m)</button>
          <button onClick={() => loadData('empty')} style={{ padding: '8px 12px', background: '#4a5568', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Empty State</button>
          <button onClick={() => loadData('error')} style={{ padding: '8px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Network Error</button>
        </div>
      </Card>

      {lastUpdated && !error && (
        <div style={{ marginBottom: '15px' }}>
          <FreshnessIndicator lastUpdated={lastUpdated} isStale={isStale} />
        </div>
      )}

      <Card title="بيانات أسواق العملات المباشرة">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => loadData('normal')} />}
        {!loading && !error && data.length === 0 && <EmptyState onRetry={() => loadData('normal')} />}
        {!loading && !error && data.length > 0 && <MarketTable data={data} />}
      </Card>
    </div>
  );
};

export const AnalyticsPage = () => (
  <div>
    <PageHeader title="Analytics Route Placeholder" subtitle="Dedicated analytics views for crypto market metrics." />
    <Card title="Analytics Integration">
      <Badge type="info" text="Active Route: /analytics" />
    </Card>
  </div>
);

export const SettingsPage = () => (
  <div>
    <PageHeader title="Settings Route Placeholder" subtitle="Manage your dashboard preferences and API integrations." />
    <Card title="System Environment">
      <Badge type="info" text="Active Route: /settings" />
      <p style={{ color: '#4a5568', marginTop: '10px' }}>API Endpoint: <code>{API_BASE_URL}/markets</code></p>
    </Card>
  </div>
);