import React, { useState, useEffect } from 'react';
import { Card, Badge, PageHeader, LoadingState, ErrorState } from '../components/UI';
import { fetchMockAPI, API_BASE_URL } from '../api/client';

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadData = async (shouldFail: boolean) => {
    setLoading(true);
    setApiError(null);
    const res = await fetchMockAPI(shouldFail);
    if (res.error) setApiError(res.error);
    else setApiData(res.data);
    setLoading(false);
  };

  useEffect(() => { loadData(false); }, []);

  return (
    <div>
      <PageHeader title="Market Dashboard Placeholder" subtitle={`Base API URL: ${API_BASE_URL}`} />
      
      <Card title="API Integration Demonstration (WEB-304)">
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <button onClick={() => loadData(false)} style={{ padding: '8px 12px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Test Success State</button>
          <button onClick={() => loadData(true)} style={{ padding: '8px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Test Error State</button>
        </div>

        {loading && <LoadingState />}
        {apiError && <ErrorState message={apiError} />}
        {apiData && !loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge type="success" text="API Normal Response" />
            <span style={{ fontSize: '14px', color: '#4a5568' }}>Status: {apiData.status} ({apiData.timestamp})</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export const AnalyticsPage = () => (
  <div>
    <PageHeader title="Analytics Route Placeholder" subtitle="Dedicated analytics views for crypto market metrics." />
    <Card title="Analytics Shared UI Test">
      <Badge type="info" text="Active Route: /analytics" />
      <p style={{ color: '#4a5568', marginTop: '10px' }}>This page reuses shared Card, Badge, and PageHeader UI components.</p>
    </Card>
  </div>
);

export const SettingsPage = () => (
  <div>
    <PageHeader title="Settings Route Placeholder" subtitle="Manage your dashboard preferences and API integrations." />
    <Card title="System Environment">
      <Badge type="info" text="Active Route: /settings" />
      <p style={{ color: '#4a5568', marginTop: '10px' }}>Configured Environment Base URL: <code>{API_BASE_URL}</code></p>
    </Card>
  </div>
);