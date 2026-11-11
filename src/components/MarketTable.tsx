import React, { useState } from 'react';
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
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#4a5568', backgroundColor: '#f7fafc' }}>
            <th onClick={() => handleSort('name')} style={{ padding: '12px', cursor: 'pointer' }}>
              العملة {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('price')} style={{ padding: '12px', cursor: 'pointer' }}>
              السعر ($) {sortField === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('change24h')} style={{ padding: '12px', cursor: 'pointer' }}>
              التغير 24h {sortField === 'change24h' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th style={{ padding: '12px' }}>حجم التداول (Volume)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #edf2f7' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name} <span style={{ color: '#a0aec0', fontSize: '12px' }}>{item.symbol}</span></td>
              <td style={{ padding: '12px' }}>${item.price.toLocaleString()}</td>
              <td style={{ padding: '12px', color: item.change24h >= 0 ? '#38a169' : '#e53e3e', fontWeight: 'bold' }}>
                {item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`}
              </td>
              <td style={{ padding: '12px', color: '#718096' }}>${(item.volume24h / 1e9).toFixed(2)}B</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};