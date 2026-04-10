'use client';

import AppLayout from '@/components/AppLayout';
import { MOCK_ALERTS } from '@/lib/mockData';
import { Bell, BellOff, AlertTriangle, TrendingUp, Info, Filter } from 'lucide-react';
import { useState } from 'react';

const SEVERITY_CONFIG = {
  HIGH:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   icon: AlertTriangle },
  MEDIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  icon: TrendingUp },
  LOW:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  icon: Info },
};

const TYPE_LABELS: Record<string, string> = {
  LARGE_DEAL: '💰 Large Deal',
  STAKE_CHANGE: '📊 Stake Change',
  SECTOR_FLOW: '🏭 Sector Flow',
  NEW_ENTRY: '🆕 New Entry',
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = alerts.filter(a =>
    (filter === 'ALL' || a.severity === filter) &&
    (typeFilter === 'ALL' || a.type === typeFilter)
  );
  const unread = alerts.filter(a => !a.is_read).length;

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
  const markRead = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));

  return (
    <AppLayout title="Alerts & Notifications" subtitle="Real-time FII/DII activity alerts">
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Unread Alerts', value: unread, color: '#ef4444', sub: 'today' },
          { label: 'High Priority', value: alerts.filter(a => a.severity === 'HIGH').length, color: '#ef4444', sub: '3 unread' },
          { label: 'Large Deals', value: alerts.filter(a => a.type === 'LARGE_DEAL').length, color: '#f59e0b', sub: '> ₹1000 Cr' },
          { label: 'Stake Changes', value: alerts.filter(a => a.type === 'STAKE_CHANGE').length, color: '#3b82f6', sub: '> 0.5% change' },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="glass-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: '#4a6178', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: '#4a6178', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Filters + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: `1px solid ${filter === s ? '#3b82f6' : '#1e2d3d'}`,
                background: filter === s ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: filter === s ? '#3b82f6' : '#4a6178',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
          <select
            className="form-input"
            style={{ fontSize: 12 }}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="LARGE_DEAL">Large Deals</option>
            <option value="STAKE_CHANGE">Stake Changes</option>
            <option value="SECTOR_FLOW">Sector Flows</option>
            <option value="NEW_ENTRY">New Entries</option>
          </select>
        </div>
        <button
          onClick={markAllRead}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 8,
            color: '#3b82f6', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <BellOff size={14} />
          Mark all as read
        </button>
      </div>

      {/* Alert cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG];
          const SevIcon = cfg.icon;
          return (
            <div
              key={alert.id}
              onClick={() => markRead(alert.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '16px 20px',
                background: alert.is_read ? 'rgba(17,24,39,0.5)' : cfg.bg,
                border: `1px solid ${alert.is_read ? '#1e2d3d' : cfg.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: alert.is_read ? 0.7 : 1,
              }}
            >
              {/* Severity icon */}
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: `${cfg.color}22`,
                border: `1px solid ${cfg.color}44`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SevIcon size={18} color={cfg.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: '0.04em' }}>
                    {alert.severity}
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: 9 }}>{TYPE_LABELS[alert.type]}</span>
                  {!alert.is_read && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e8f4fd', marginBottom: 4 }}>
                  {alert.institution} — {alert.company}
                </div>
                <div style={{ fontSize: 13, color: '#8ba5c0' }}>{alert.description}</div>
              </div>

              {/* Right: value + time */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>
                  ₹{alert.value_cr.toLocaleString()} Cr
                </div>
                <div style={{ fontSize: 11, color: '#4a6178', marginTop: 4 }}>{alert.time} IST</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert config */}
      <div className="glass-card" style={{ padding: 20, marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title">Alert Configuration</div>
          <div className="section-subtitle">Set thresholds for automatic notifications</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { label: 'FII/DII Flow Threshold', value: '₹1,000 Cr', desc: 'Alert when net flow exceeds this' },
            { label: 'Stake Change Alert', value: '1.0%', desc: 'Alert on shareholding change > X%' },
            { label: 'Bulk Deal Threshold', value: '₹500 Cr', desc: 'Individual deal size to alert' },
            { label: 'Smart Money Score Drop', value: '10 pts', desc: 'Alert on score decline' },
          ].map(({ label, value, desc }) => (
            <div key={label} style={{
              padding: '14px 16px',
              background: 'rgba(59,130,246,0.04)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: 12, color: '#8ba5c0', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#4a6178' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
