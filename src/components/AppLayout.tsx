'use client';

import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AgentRunner from './AgentRunner';
import { subscribeToAgentCompletion } from '@/lib/agentState';
import { useMarketData } from '@/lib/hooks';

export default function AppLayout({ children, title, subtitle }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  // Fetch market data from database
  const { data: marketData, refetch: refetchMarketData } = useMarketData();

  // Listen for agent completion and refresh market data
  useEffect(() => {
    const unsubscribe = subscribeToAgentCompletion((success, message) => {
      if (success) {
        // Refresh market data after agent completes
        refetchMarketData();
      }
    });

    // Listen for page visibility to refresh data on focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchMarketData();
      }
    };

    window.addEventListener('focus', refetchMarketData);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', refetchMarketData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetchMarketData]);

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
            <div style={{ fontSize: 11, color: '#4a6178', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>
                {marketData ? new Date(marketData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ color: '#8ba5c0' }}>|</span>
              {marketData ? (
                <>
                  <span>
                    NIFTY 50: <span style={{ 
                      color: marketData.nifty50_change_pct >= 0 ? '#10b981' : '#ef4444',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 600,
                    }}>
                      {marketData.nifty50_value.toFixed(2)} 
                      <span style={{ fontSize: 9, marginLeft: 4 }}>
                        ({marketData.nifty50_change_pct >= 0 ? '+' : ''}{marketData.nifty50_change_pct.toFixed(2)}%)
                      </span>
                    </span>
                  </span>
                  <span style={{ color: '#8ba5c0' }}>|</span>
                  <span style={{ color: '#f59e0b' }}>NSE: {marketData.nse_change_pct.toFixed(2)}%</span> 
                  <span style={{ color: '#8ba5c0' }}>|</span>
                  <span style={{ color: '#ef4444' }}>SENSEX: {marketData.sensex_change_pct.toFixed(2)}%</span>
                </>
              ) : (
                <span style={{ color: '#4a6178' }}>Loading market data...</span>
              )}
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
