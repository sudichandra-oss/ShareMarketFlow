'use client';

interface KPICardProps {
  title: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accent?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  icon?: React.ReactNode;
}

const ACCENTS = {
  blue:   { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  glow: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  green:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  glow: 'rgba(16,185,129,0.15)', color: '#10b981' },
  red:    { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   glow: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
  yellow: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  glow: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  purple: { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.25)',  glow: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
};

export default function KPICard({ title, value, sub, trend, trendValue, accent = 'blue', icon }: KPICardProps) {
  const a = ACCENTS[accent];

  return (
    <div style={{
      background: a.bg,
      border: `1px solid ${a.border}`,
      borderRadius: 12,
      padding: '16px 20px',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${a.glow}`;
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      (e.currentTarget as HTMLElement).style.transform = 'none';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#4a6178', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</span>
        {icon && <span style={{ color: a.color, opacity: 0.8 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#e8f4fd', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trendValue && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#8ba5c0',
            background: trend === 'up' ? 'rgba(16,185,129,0.12)' : trend === 'down' ? 'rgba(239,68,68,0.12)' : 'rgba(138,165,192,0.12)',
            padding: '2px 8px', borderRadius: 9999,
          }}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {trendValue}
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: '#4a6178' }}>{sub}</span>}
      </div>
    </div>
  );
}
