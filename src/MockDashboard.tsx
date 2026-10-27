import React from 'react';
import ReactECharts from 'echarts-for-react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume: string;
}

const coinsData: Coin[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: '$64,250', change: '+2.5%', isPositive: true, volume: '$28.5B' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: '$3,450', change: '-1.2%', isPositive: false, volume: '$14.2B' },
  { id: '3', name: 'Solana', symbol: 'SOL', price: '$145', change: '+5.8%', isPositive: true, volume: '$4.1B' },
  { id: '4', name: 'Cardano', symbol: 'ADA', price: '$0.45', change: '+0.8%', isPositive: true, volume: '$850M' },
];

export default function MockDashboard() {
  const chartOption = {
    title: { text: 'BTC/USD Market Trend', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value', min: 60000 },
    series: [
      {
        data: [61000, 62500, 62000, 64000, 63500, 65000, 66000],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#ff9900', width: 3 },
      },
    ],
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1a202c', marginBottom: '20px' }}>ChainPulse AI - Market Dashboard</h1>

      {/* Top Cards Section */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
        {coinsData.slice(0, 3).map((coin) => (
          <div key={coin.id} style={{ flex: '1 1 250px', maxWidth: '350px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{coin.name} ({coin.symbol})</h3>
              <span style={{ color: coin.isPositive ? 'green' : 'red', fontWeight: 'bold' }}>{coin.change}</span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{coin.price}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        {/* @ts-ignore */}
        <ReactECharts option={chartOption} style={{ height: '350px', width: '100%' }} />
      </div>

      {/* Table Section */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <h2 style={{ marginBottom: '15px', fontSize: '18px' }}>Top Market Cryptocurrencies</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #edf2f7', color: '#718096' }}>
              <th style={{ padding: '12px 8px' }}>Asset</th>
              <th style={{ padding: '12px 8px' }}>Price</th>
              <th style={{ padding: '12px 8px' }}>24h Change</th>
              <th style={{ padding: '12px 8px' }}>24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {coinsData.map((coin) => (
              <tr key={coin.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{coin.name} <span style={{ color: '#a0aec0', fontWeight: 'normal' }}>{coin.symbol}</span></td>
                <td style={{ padding: '12px 8px' }}>{coin.price}</td>
                <td style={{ padding: '12px 8px', color: coin.isPositive ? 'green' : 'red', fontWeight: 'bold' }}>{coin.change}</td>
                <td style={{ padding: '12px 8px' }}>{coin.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}