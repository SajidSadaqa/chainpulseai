import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#f6ad55', marginBottom: '20px' }}>
          ChainPulse AI
        </div>
        <nav aria-label="Main Navigation" className="app-nav">
          <NavLink to="/" end className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>
            Market Overview
          </NavLink>
          <NavLink to="/coin/BTC" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>
            Coin Detail Chart
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>
            Visual Analytics
          </NavLink>
          <NavLink to="/blockchain" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>
            Blockchain Explorer
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>
            Settings
          </NavLink>
        </nav>
      </aside>

      <div className="app-main-wrapper">
        <div className="app-header">
          <span style={{ fontWeight: 'bold', color: '#1a202c' }}>Blockchain Explorer &amp; Visual Analytics (Week 6)</span>
          <span style={{ color: '#4a5568', fontSize: '14px' }}>User: Amr</span>
        </div>

        <main id="main-content" className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}