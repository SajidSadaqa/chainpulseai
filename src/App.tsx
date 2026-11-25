import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import { DashboardPage, CoinDetailPage, AnalyticsPage, SettingsPage } from './pages/Pages';
import { BlockchainPage } from './pages/BlockchainPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="coin/:coinId" element={<CoinDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="blockchain" element={<BlockchainPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}