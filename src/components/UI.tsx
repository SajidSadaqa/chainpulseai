import React from 'react';

// Shared Card Component
export const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4a5568' }}>{title}</h3>
    {children}
  </div>
);

// Shared Badge Component
export const Badge: React.FC<{ type: 'success' | 'error' | 'info'; text: string }> = ({ type, text }) => {
  const colors = {
    success: { bg: '#def7ec', text: '#03543f' },
    error: { bg: '#fde8e8', text: '#9b1c1c' },
    info: { bg: '#e1effe', text: '#1e429f' },
  };
  return (
    <span style={{ backgroundColor: colors[type].bg, color: colors[type].text, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
      {text}
    </span>
  );
};

// Shared Page Header
export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ marginBottom: '20px' }}>
    <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c' }}>{title}</h1>
    <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>{subtitle}</p>
  </div>
);

// Shared Loading & Error States
export const LoadingState = () => <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>جاري تحميل البيانات...</div>;

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ padding: '15px', backgroundColor: '#fde8e8', color: '#9b1c1c', borderRadius: '8px', marginBottom: '15px' }}>
    ⚠️ خطأ: {message}
  </div>
);