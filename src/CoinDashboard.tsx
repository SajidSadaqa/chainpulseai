import React, { useState } from 'react';

// تعريف أنواع البيانات (TypeScript interface)
interface Coin {
  id: string;
  name: string;
  symbol: string;
  priceUSD: number;
  change24h: number;
}

// بيانات وهمية (Mock Data - WEB-101)
const mockCoins: Coin[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', priceUSD: 64250, change24h: 2.5 },
  { id: '2', name: 'Ethereum', symbol: 'ETH', priceUSD: 3450, change24h: -1.2 },
  { id: '3', name: 'Solana', symbol: 'SOL', priceUSD: 145, change24h: 5.8 },
];

export default function CoinDashboard() {
  // التحكم بحالات الصفحة (WEB-102)
  const [status, setStatus] = useState<'success' | 'loading' | 'error' | 'empty'>('success');

  // 1. حالة التحميل
  if (status === 'loading') {
    return <div style={{ padding: '20px', fontSize: '18px' }}>⏳ جاري تحميل بيانات الكريبتو...</div>;
  }

  // 2. حالة الخطأ
  if (status === 'error') {
    return <div style={{ padding: '20px', color: 'red', fontSize: '18px' }}>❌ فشل في جلب البيانات من الخادم.</div>;
  }

  // 3. حالة لا توجد بيانات
  if (status === 'empty') {
    return <div style={{ padding: '20px', fontSize: '18px' }}>📭 لا توجد بيانات عملات متاحة حالياً.</div>;
  }

  // 4. الحالة العادية لعرض البطاقات
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>ChainPulse AI - Crypto Dashboard</h2>

      {/* أزرار لاختبار الحالات الثلاث المطلوبة في WEB-102 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setStatus('success')}>عرض الكروت (Success)</button>
        <button onClick={() => setStatus('loading')}>جرب التحميل (Loading)</button>
        <button onClick={() => setStatus('error')}>جرب الخطأ (Error)</button>
        <button onClick={() => setStatus('empty')}>جرب الفراغ (Empty)</button>
      </div>

      {/* كروت العملات (WEB-101) */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {mockCoins.map((coin) => (
          <div
            key={coin.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              width: '200px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3>{coin.name} ({coin.symbol})</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>${coin.priceUSD.toLocaleString()}</p>
            <p style={{ color: coin.change24h >= 0 ? 'green' : 'red' }}>
              {coin.change24h >= 0 ? `+${coin.change24h}%` : `${coin.change24h}%`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}