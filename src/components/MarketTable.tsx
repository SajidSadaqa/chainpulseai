import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketItem } from '../api/client';

export const MarketTable: React.FC<{ data: MarketItem[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<'name' | 'price' | 'change24h'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'price' | 'change24h') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'name') return a.name.localeCompare(b.name) * factor;
    return (a[sortField] - b[sortField]) * factor;
  });

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table aria-label="Live Cryptocurrency Market Table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '540px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #cbd5e0', color: '#2d3748', backgroundColor: '#f7fafc' }}>
            <th scope="col" style={{ padding: '12px' }}>
              <button type="button" onClick={() => handleSort('name')} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                العملة (Coin) {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th scope="col" style={{ padding: '12px' }}>
              <button type="button" onClick={() => handleSort('price')} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                السعر ($ USD) {sortField === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th scope="col" style={{ padding: '12px' }}>
              <button type="button" onClick={() => handleSort('change24h')} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                التغير (24h %) {sortField === 'change24h' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th scope="col" style={{ padding: '12px' }}>حجم التداول (24h $B)</th>
            <th scope="col" style={{ padding: '12px' }}>التفاصيل (Chart)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>
                {item.name} <span style={{ color: '#4a5568', fontSize: '12px' }}>({item.symbol})</span>
              </td>
              <td style={{ padding: '12px' }}>${item.price.toLocaleString()}</td>
              <td style={{ padding: '12px', color: item.change24h >= 0 ? '#22543d' : '#9b2c2c', fontWeight: 'bold' }}>
                {item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`}
              </td>
              <td style={{ padding: '12px', color: '#4a5568' }}>${(item.volume24h / 1e9).toFixed(2)}B</td>
              <td style={{ padding: '12px' }}>
                <Link
                  to={`/coin/${item.symbol}`}
                  aria-label={`View ${item.name} price and volume chart`}
                  style={{ color: '#2b6cb0', fontWeight: 600, textDecoration: 'underline' }}
                >
                  عرض الرسم البياني
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};