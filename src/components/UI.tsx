import React from 'react';

export const Card: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <section
    aria-label={title}
    style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      marginBottom: '16px',
      width: '100%',
      maxWidth: '100%',
    }}
  >
    <div style={{ marginBottom: '12px' }}>
      <h2 style={{ margin: 0, fontSize: '17px', color: '#1a202c' }}>{title}</h2>
      {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4a5568' }}>{subtitle}</p>}
    </div>
    {children}
  </section>
);

export const Badge: React.FC<{ type: 'success' | 'error' | 'info' | 'warning'; text: string }> = ({ type, text }) => {
  const colors = {
    success: { bg: '#def7ec', text: '#03543f' },
    error: { bg: '#fde8e8', text: '#9b1c1c' },
    info: { bg: '#e1effe', text: '#1e429f' },
    warning: { bg: '#fef3c7', text: '#92400e' },
  };
  return (
    <span style={{ backgroundColor: colors[type].bg, color: colors[type].text, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
      {text}
    </span>
  );
};

export const FreshnessIndicator: React.FC<{ lastUpdated: string; isStale: boolean }> = ({ lastUpdated, isStale }) => {
  const formattedTime = new Date(lastUpdated).toLocaleTimeString();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', flexWrap: 'wrap' }}>
      <Badge type={isStale ? 'warning' : 'success'} text={isStale ? 'Stale Data (&gt;5m)' : 'Live Data'} />
      <span style={{ color: '#4a5568' }}>آخر تحديث: {formattedTime}</span>
    </div>
  );
};

export const LoadingState = () => (
  <div role="status" style={{ padding: '28px', textAlign: 'center', color: '#2b6cb0', fontWeight: 'bold' }}>
    جاري تحميل بيانات السوق والتحليلات...
  </div>
);

export const EmptyState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div style={{ padding: '28px', textAlign: 'center', backgroundColor: '#f7fafc', border: '1px dashed #cbd5e0', borderRadius: '8px' }}>
    <p style={{ color: '#4a5568', margin: '0 0 12px 0' }}>لا توجد بيانات متاحة حالياً.</p>
    <button onClick={onRetry} style={{ padding: '8px 16px', background: '#2b6cb0', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
      إعادة المحاولة
    </button>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div role="alert" style={{ padding: '16px', backgroundColor: '#fde8e8', border: '1px solid #f8b4b4', color: '#9b1c1c', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
    <span>{message}</span>
    <button onClick={onRetry} style={{ padding: '6px 14px', background: '#9b1c1c', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
      إعادة الاتصال
    </button>
  </div>
);

export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <header style={{ marginBottom: '20px' }}>
    <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c' }}>{title}</h1>
    <p style={{ margin: '6px 0 0 0', color: '#4a5568', fontSize: '14px' }}>{subtitle}</p>
  </header>
);