'use client';

import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AgentRunner from './AgentRunner';
import { MARKET_INDICES } from '@/lib/mockData';
import { subscribeToAgentCompletion } from '@/lib/agentState';

export default function AppLayout({ children, title, subtitle }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const [marketData, setMarketData] = useState<any>(MARKET_INDICES);
  const [loading, setLoading] = useState(true);

  // Function to fetch market data from database
  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market');
      if (response.ok) {
        const data = await response.json();
        setMarketData({
          date: data.date,
          nifty50: {
            value: data.nifty50_value,
            change: data.nifty50_change,
            change_pct: data.nifty50_change_pct,
          },
          sensex: {
            value: data.sensex_value,
            change: data.sensex_change,
            change_pct: data.sensex_change_pct,
          },
          nse: {
            value: data.nifty50_change_pct,
          },
        });
      }
    } catch (error) {
      console.error('[v0] Failed to fetch market data:', error);
      // Fall back to mock data on error
      setMarketData(MARKET_INDICES);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and listen for agent completion
  useEffect(() => {
    // Fetch data on mount
    fetchMarketData();
    setLoading(false);

    const unsubscribe = subscribeToAgentCompletion((success, message) => {
      if (success) {
        // Refresh market data after agent completes
        fetchMarketData();
      }
    });

    // Listen for page visibility to refresh data on focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMarketData();
      }
    };

    window.addEventListener('focus', fetchMarketData);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', fetchMarketData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
                {new Date(marketData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ color: '#8ba5c0' }}>|</span>
              <span>
                NIFTY 50: <span style={{ 
                  color: marketData.nifty50.change_pct >= 0 ? '#10b981' : '#ef4444',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                }}>
                  {marketData.nifty50.value.toFixed(2)} 
                  <span style={{ fontSize: 9, marginLeft: 4 }}>
                    ({marketData.nifty50.change_pct >= 0 ? '+' : ''}{marketData.nifty50.change_pct.toFixed(2)}%)
                  </span>
                </span>
              </span>
              <span style={{ color: '#8ba5c0' }}>|</span>
              <span style={{ color: '#f59e0b' }}>NSE: {marketData.nse.value.toFixed(2)}%</span> 
              <span style={{ color: '#8ba5c0' }}>|</span>
              <span style={{ color: '#ef4444' }}>SENSEX: {marketData.sensex.change_pct.toFixed(2)}%</span>
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
