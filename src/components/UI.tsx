import React from 'react';

export const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4a5568' }}>{title}</h3>
    {children}
  </div>
);

export const Badge: React.FC<{ type: 'success' | 'error' | 'info' | 'warning'; text: string }> = ({ type, text }) => {
  const colors = {
    success: { bg: '#def7ec', text: '#03543f' },
    error: { bg: '#fde8e8', text: '#9b1c1c' },
    info: { bg: '#e1effe', text: '#1e429f' },
    warning: { bg: '#fef3c7', text: '#92400e' },
  };
  return (
    <span style={{ backgroundColor: colors[type].bg, color: colors[type].text, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
      {text}
    </span>
  );
};

export const FreshnessIndicator: React.FC<{ lastUpdated: string; isStale: boolean }> = ({ lastUpdated, isStale }) => {
  const formattedTime = new Date(lastUpdated).toLocaleTimeString();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
      <Badge type={isStale ? 'warning' : 'success'} text={isStale ? 'Stale Data (>5m)' : 'Live Data'} />
      <span style={{ color: '#718096' }}>آخر تحديث: {formattedTime}</span>
    </div>
  );
};

export const LoadingState = () => (
  <div style={{ padding: '30px', textAlign: 'center', color: '#3182ce', fontWeight: 'bold' }}>
    جاري جلب أحدث بيانات السوق...
  </div>
);

export const EmptyState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f7fafc', border: '1px dashed #cbd5e0', borderRadius: '8px' }}>
    <p style={{ color: '#718096', margin: '0 0 10px 0' }}>لا توجد بيانات متاحة حالياً في السوق.</p>
    <button onClick={onRetry} style={{ padding: '6px 14px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>إعادة المحاولة</button>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div style={{ padding: '15px', backgroundColor: '#fde8e8', border: '1px solid #f8b4b4', color: '#9b1c1c', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>{message}</span>
    <button onClick={onRetry} style={{ padding: '6px 12px', background: '#9b1c1c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>إعادة الاتصال</button>
  </div>
);

export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ marginBottom: '20px' }}>
    <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c' }}>{title}</h1>
    <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>{subtitle}</p>
  </div>
);