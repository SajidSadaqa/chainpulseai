import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', backgroundColor: '#1a202c', color: '#fff', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', color: '#ff9900', marginBottom: '30px' }}>ChainPulse AI</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>📊 Dashboard</Link>
          <Link to="/analytics" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>📈 Analytics</Link>
          <Link to="/settings" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>⚙️ Settings</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, backgroundColor: '#f7fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ backgroundColor: '#fff', padding: '15px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold' }}>Application Shell (Week 3)</span>
          <span style={{ color: '#718096', fontSize: '14px' }}>User: Amr (PR Specialist)</span>
        </header>

        {/* Dynamic Page Views */}
        <main style={{ padding: '30px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}