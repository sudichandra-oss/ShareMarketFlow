'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, TrendingUp, TrendingDown,
  PieChart, Search, Lightbulb, Bell, Zap,
  Activity, ChevronRight, Globe
} from 'lucide-react';
import { subscribeToAgentState } from '@/lib/agentState';

const navItems = [
  { href: '/',          icon: LayoutDashboard, label: 'Overview',        badge: null },
  { href: '/fii',       icon: Globe,           label: 'FII Tracker',     badge: '10' },
  { href: '/dii',       icon: TrendingUp,      label: 'DII Tracker',     badge: '8' },
  { href: '/sectors',   icon: PieChart,        label: 'Sector Analysis', badge: null },
  { href: '/company',   icon: Search,          label: 'Company Dive',    badge: null },
  { href: '/insights',  icon: Lightbulb,       label: 'AI Insights',     badge: 'NEW' },
  { href: '/alerts',    icon: Bell,            label: 'Alerts',          badge: '3' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [agentStatus, setAgentStatus] = useState({ status: 'idle', progress: [] as string[] });

  // Subscribe to agent state changes
  useEffect(() => {
    const unsubscribe = subscribeToAgentState((state) => {
      setAgentStatus({
        status: state.status,
        progress: state.progress,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#0d1117',
      borderRight: '1px solid #1e2d3d',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #1e2d3d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f4fd', letterSpacing: '-0.02em' }}>ShareMarket</div>
            <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 600, letterSpacing: '0.05em' }}>FLOW ⚡</div>
          </div>
        </div>
      </div>

      {/* Market Status */}
      <div style={{
        margin: '12px 12px 8px',
        padding: '8px 12px',
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div className="pulse-dot" style={{ background: '#10b981' }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#10b981' }}>MARKET CLOSED</div>
          <div style={{ fontSize: 9, color: '#4a6178' }}>Data as of 3:30 PM IST</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div className={`nav-item ${active ? 'nav-active' : ''}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 16px',
                margin: '1px 8px',
                borderRadius: active ? '0 8px 8px 0' : 8,
                color: active ? '#3b82f6' : '#8ba5c0',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 9999,
                    background: badge === 'NEW' ? 'rgba(139,92,246,0.2)' : 'rgba(59,130,246,0.15)',
                    color: badge === 'NEW' ? '#8b5cf6' : '#3b82f6',
                    border: `1px solid ${badge === 'NEW' ? 'rgba(139,92,246,0.3)' : 'rgba(59,130,246,0.2)'}`,
                  }}>{badge}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid #1e2d3d' }}>
        <div style={{
          padding: '10px 12px',
          background: agentStatus.status === 'running' 
            ? 'rgba(59,130,246,0.12)' 
            : 'rgba(59,130,246,0.08)',
          borderRadius: 8,
          border: '1px solid rgba(59,130,246,0.2)',
          transition: 'all 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Zap 
              size={12} 
              color={agentStatus.status === 'running' ? '#f59e0b' : '#3b82f6'}
              style={{
                animation: agentStatus.status === 'running' ? 'pulse 1.5s infinite' : 'none',
              }}
            />
            <span style={{ 
              fontSize: 10, 
              fontWeight: 700, 
              color: agentStatus.status === 'running' ? '#f59e0b' : '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {agentStatus.status === 'running' ? '🔄 RUNNING' : '✓ SCHEDULED'}
            </span>
          </div>
          <div style={{ fontSize: 9, color: '#4a6178' }}>
            {agentStatus.status === 'running' 
              ? `Progress: ${(agentStatus.progress?.length || 0)} step${(agentStatus.progress?.length || 0) !== 1 ? 's' : ''}`
              : 'Next run: Today 4:00 PM IST'
            }
          </div>
          <div style={{ marginTop: 6, height: 3, background: '#1e2d3d', borderRadius: 2 }}>
            <div style={{ 
              width: agentStatus.status === 'running' ? '100%' : '72%', 
              height: '100%', 
              background: agentStatus.status === 'running' 
                ? 'linear-gradient(90deg,#f59e0b,#3b82f6)' 
                : 'linear-gradient(90deg,#3b82f6,#8b5cf6)', 
              borderRadius: 2,
              transition: 'width 0.3s',
              animation: agentStatus.status === 'running' ? 'pulse 1.5s infinite' : 'none',
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </aside>
  );
}
