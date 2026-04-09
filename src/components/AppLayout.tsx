'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AgentRunner from './AgentRunner';

export default function AppLayout({ children, title, subtitle }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080b14' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          padding: '16px 28px',
          borderBottom: '1px solid #1e2d3d',
          background: 'rgba(13,17,23,0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky', top: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#e8f4fd', letterSpacing: '-0.02em' }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 12, color: '#4a6178', marginTop: 2 }}>{subtitle}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, color: '#4a6178' }}>
              Mon, Apr 7, 2025 &nbsp;|&nbsp; <span style={{ color: '#f59e0b' }}>NSE: -0.42%</span> &nbsp;|&nbsp; <span style={{ color: '#ef4444' }}>SENSEX: -0.38%</span>
            </div>
            <AgentRunner />
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px 28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
