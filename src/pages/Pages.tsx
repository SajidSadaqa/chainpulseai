import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { EChartsOption } from 'echarts';
import { Card, PageHeader, LoadingState, ErrorState, EmptyState, FreshnessIndicator, Badge } from '../components/UI';
import { MarketTable } from '../components/MarketTable';
import { EChartBox } from '../components/EChartBox';
import {
  fetchLiveMarkets,
  fetchCoinDetail,
  fetchAnalyticsData,
  MarketItem,
  MarketKPI,
  PeriodKey,
  CoinDetailResponse,
  AnalyticsOverviewResponse,
  API_BASE_URL,
} from '../api/client';

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MarketItem[]>([]);
  const [kpis, setKpis] = useState<MarketKPI[]>([]);
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
      setKpis(res.kpis);
      setIsStale(res.isStale);
      setLastUpdated(res.lastUpdated);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData('normal');
  }, []);

  const topGainers = useMemo(
    () => [...data].filter((c) => c.change24h >= 0).sort((a, b) => b.change24h - a.change24h),
    [data]
  );

  const topLosers = useMemo(
    () => [...data].filter((c) => c.change24h < 0).sort((a, b) => a.change24h - b.change24h),
    [data]
  );

  return (
    <div>
      <PageHeader
        title="Market Overview Dashboard"
        subtitle="Explicit KPIs, 24h top gainers/losers, and live market table with unit &amp; period clarity."
      />

      <Card title="محاكاة حالات الشبكة (Network State Controls)">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => loadData('normal')} style={{ padding: '8px 12px', background: '#276749', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Live Normal Data
          </button>
          <button type="button" onClick={() => loadData('stale')} style={{ padding: '8px 12px', background: '#975a16', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {'Stale Data (>5m)'}
          </button>
          <button type="button" onClick={() => loadData('empty')} style={{ padding: '8px 12px', background: '#4a5568', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Empty State
          </button>
          <button type="button" onClick={() => loadData('error')} style={{ padding: '8px 12px', background: '#9b2c2c', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Network Error
          </button>
        </div>
      </Card>

      {lastUpdated && !error && (
        <div style={{ marginBottom: '16px' }}>
          <FreshnessIndicator lastUpdated={lastUpdated} isStale={isStale} />
        </div>
      )}

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={() => loadData('normal')} />}
      {!loading && !error && data.length === 0 && <EmptyState onRetry={() => loadData('normal')} />}

      {!loading && !error && data.length > 0 && (
        <>
          {/* WEB-501: Market KPI Cards with explicit values, units, and period labels */}
          <div aria-label="Market Key Performance Indicators" className="kpi-grid">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#4a5568' }}>{kpi.label}</span>
                  <Badge type="info" text={kpi.period} />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', margin: '4px 0' }}>{kpi.value}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4a5568' }}>
                  <span>Unit: {kpi.unit}</span>
                  <span style={{ fontWeight: 'bold', color: kpi.isPositive ? '#22543d' : '#9b2c2c' }}>{kpi.delta} (24h)</span>
                </div>
              </div>
            ))}
          </div>

          {/* WEB-501: Top Gainers & Top Losers Sections */}
          <div className="two-col-grid">
            <Card title="Top Gainers (24h Window)" subtitle="Metric: 24h Price Change (%) | Unit: USD ($)">
              {topGainers.map((coin) => (
                <div key={coin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #edf2f7' }}>
                  <div>
                    <Link to={`/coin/${coin.symbol}`} style={{ fontWeight: 'bold', color: '#1a202c', textDecoration: 'underline' }}>
                      {coin.name} ({coin.symbol})
                    </Link>
                    <div style={{ fontSize: '12px', color: '#4a5568' }}>Price: ${coin.price.toLocaleString()} USD</div>
                  </div>
                  <Badge type="success" text={`+${coin.change24h}% / 24h`} />
                </div>
              ))}
            </Card>

            <Card title="Top Losers (24h Window)" subtitle="Metric: 24h Price Change (%) | Unit: USD ($)">
              {topLosers.map((coin) => (
                <div key={coin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #edf2f7' }}>
                  <div>
                    <Link to={`/coin/${coin.symbol}`} style={{ fontWeight: 'bold', color: '#1a202c', textDecoration: 'underline' }}>
                      {coin.name} ({coin.symbol})
                    </Link>
                    <div style={{ fontSize: '12px', color: '#4a5568' }}>Price: ${coin.price.toLocaleString()} USD</div>
                  </div>
                  <Badge type="error" text={`${coin.change24h}% / 24h`} />
                </div>
              ))}
            </Card>
          </div>

          {/* Live Market Table */}
          <Card title="بيانات أسواق العملات المباشرة (Live Market Table)" subtitle="Click any column header to sort or open the coin chart view">
            <MarketTable data={data} />
          </Card>
        </>
      )}
    </div>
  );
};

// WEB-502: Coin Detail Page with Price/Volume Chart and Period Controls
export const CoinDetailPage = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const activeSymbol = (coinId || 'BTC').toUpperCase();

  const [period, setPeriod] = useState<PeriodKey>('7D');
  const [detail, setDetail] = useState<CoinDetailResponse | null>(null);

  useEffect(() => {
    let active = true;
    fetchCoinDetail(activeSymbol, period).then((res) => {
      if (active) setDetail(res);
    });
    return () => {
      active = false;
    };
  }, [activeSymbol, period]);

  const chartOption: EChartsOption = useMemo(() => {
    if (!detail) return {};
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [`Price (${detail.priceUnit})`, `Volume (${detail.volumeUnit})`],
        bottom: 0,
      },
      grid: { left: '60px', right: '60px', top: '35px', bottom: '45px' },
      xAxis: {
        type: 'category',
        data: detail.series.map((s) => s.timestamp),
        name: `Period (${detail.period})`,
      },
      yAxis: [
        {
          type: 'value',
          name: `Price (${detail.priceUnit})`,
          scale: true,
        },
        {
          type: 'value',
          name: `Volume (${detail.volumeUnit})`,
          scale: true,
        },
      ],
      series: [
        {
          name: `Price (${detail.priceUnit})`,
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          data: detail.series.map((s) => s.priceUsd),
          itemStyle: { color: '#2b6cb0' },
        },
        {
          name: `Volume (${detail.volumeUnit})`,
          type: 'bar',
          yAxisIndex: 1,
          data: detail.series.map((s) => s.volumeBillions),
          itemStyle: { color: '#cbd5e0' },
        },
      ],
    };
  }, [detail]);

  const periods: PeriodKey[] = ['24H', '7D', '30D', '90D'];
  const coins = ['BTC', 'ETH', 'SOL', 'AVAX'];

  return (
    <div>
      <PageHeader
        title="Coin Detail &amp; Price/Volume Time-Series"
        subtitle="Interactive dual-axis chart updating scales, timestamps, and units dynamically per period."
      />

      <Card title="اختيار العملة والفترة الزمنية (Coin &amp; Period Controls)">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div role="group" aria-label="Select Cryptocurrency" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {coins.map((sym) => (
              <button
                key={sym}
                type="button"
                aria-pressed={activeSymbol === sym}
                onClick={() => navigate(`/coin/${sym}`)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e0',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: activeSymbol === sym ? '#1a202c' : '#ffffff',
                  color: activeSymbol === sym ? '#ffffff' : '#1a202c',
                }}
              >
                {sym}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Select Time Period" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #2b6cb0',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: period === p ? '#2b6cb0' : '#ffffff',
                  color: period === p ? '#ffffff' : '#2b6cb0',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {!detail ? (
        <LoadingState />
      ) : (
        <Card
          title={`${detail.name} (${detail.symbol}) — Price &amp; Volume (${detail.period} Window)`}
          subtitle={`Current Price: $${detail.currentPriceUsd.toLocaleString()} USD | Period Return (${detail.period}): ${detail.changePercent >= 0 ? '+' : ''}${detail.changePercent}% | Left Axis: ${detail.priceUnit} | Right Axis: ${detail.volumeUnit}`}
        >
          <EChartBox
            option={chartOption}
            height={350}
            ariaLabel={`${detail.name} price in USD and trading volume in billions over ${detail.period}`}
          />
        </Card>
      )}
    </div>
  );
};

// WEB-503: Analytics Views for Moving Average, Volatility, and Correlation
export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsOverviewResponse | null>(null);

  useEffect(() => {
    fetchAnalyticsData().then(setAnalytics);
  }, []);

  const maOption: EChartsOption = useMemo(() => {
    if (!analytics) return {};
    const { dates, spotPrice, sma7, sma30, unit } = analytics.movingAverage;
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Spot Price ($)', 'SMA-7 ($)', 'SMA-30 ($)'], bottom: 0 },
      grid: { left: '65px', right: '25px', top: '30px', bottom: '45px' },
      xAxis: { type: 'category', data: dates, name: 'Window' },
      yAxis: { type: 'value', name: unit, scale: true },
      series: [
        { name: 'Spot Price ($)', type: 'line', data: spotPrice, itemStyle: { color: '#1a202c' } },
        { name: 'SMA-7 ($)', type: 'line', data: sma7, itemStyle: { color: '#2b6cb0' } },
        { name: 'SMA-30 ($)', type: 'line', data: sma30, itemStyle: { color: '#dd6b20' } },
      ],
    };
  }, [analytics]);

  const volOption: EChartsOption = useMemo(() => {
    if (!analytics) return {};
    const { assets, values, unit } = analytics.volatility;
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: '55px', right: '25px', top: '30px', bottom: '35px' },
      xAxis: { type: 'category', data: assets, name: 'Asset' },
      yAxis: { type: 'value', name: unit },
      series: [
        {
          name: '14-Day Volatility (%)',
          type: 'bar',
          data: values,
          itemStyle: { color: '#805ad5' },
        },
      ],
    };
  }, [analytics]);

  const corrOption: EChartsOption = useMemo(() => {
    if (!analytics) return {};
    const { assets, matrix } = analytics.correlation;
    return {
      tooltip: { position: 'top' },
      grid: { left: '55px', right: '25px', top: '20px', bottom: '55px' },
      xAxis: { type: 'category', data: assets },
      yAxis: { type: 'category', data: assets },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
      },
      series: [
        {
          name: 'Pearson Correlation (30D)',
          type: 'heatmap',
          data: matrix,
          label: { show: true },
        },
      ],
    };
  }, [analytics]);

  if (!analytics) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Visual Market Analytics"
        subtitle="Server-computed statistical views with explicit metric definitions, units, and time windows."
      />

      <Card
        title={`1. Moving Average Comparison — ${analytics.movingAverage.windowLabel}`}
        subtitle={`Metric: ${analytics.movingAverage.metric} | Unit: ${analytics.movingAverage.unit}`}
      >
        <EChartBox
          option={maOption}
          height={310}
          ariaLabel="Moving average comparison chart showing Spot Price, 7-day SMA, and 30-day SMA in USD"
        />
      </Card>

      <div className="two-col-grid">
        <Card
          title={`2. Rolling Volatility — ${analytics.volatility.windowLabel}`}
          subtitle={`Metric: ${analytics.volatility.metric} | Unit: ${analytics.volatility.unit}`}
        >
          <EChartBox
            option={volOption}
            height={290}
            ariaLabel="Bar chart showing 14-day annualized volatility percentage across BTC, ETH, SOL, and AVAX"
          />
        </Card>

        <Card
          title={`3. Correlation Matrix — ${analytics.correlation.windowLabel}`}
          subtitle={`Metric: ${analytics.correlation.metric} | Scale: ${analytics.correlation.scaleLabel}`}
        >
          <EChartBox
            option={corrOption}
            height={290}
            ariaLabel="Heatmap showing 30-day return correlation coefficients between BTC, ETH, SOL, and AVAX"
          />
        </Card>
      </div>
    </div>
  );
};

export const SettingsPage = () => (
  <div>
    <PageHeader title="System &amp; API Settings" subtitle="Backend contract alignment and environment configuration." />
    <Card title="Backend Integration Status">
      <Badge type="info" text="Active Route: /settings" />
      <p style={{ color: '#4a5568', marginTop: '12px' }}>
        Configured Base Endpoint: <code>{API_BASE_URL}</code>
      </p>
      <p style={{ color: '#4a5568', margin: 0 }}>
        Analytics Computation: Server-side pre-aggregated metrics (SMA, Rolling Volatility, Correlation Matrix).
      </p>
    </Card>
  </div>
);