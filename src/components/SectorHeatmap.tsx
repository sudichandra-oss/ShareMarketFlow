'use client';

import { SectorData } from '@/lib/api';

function getMomentumColor(momentum: number): string {
  if (momentum >= 80) return '#10b981';
  if (momentum >= 65) return '#3b82f6';
  if (momentum >= 50) return '#f59e0b';
  if (momentum >= 35) return '#f97316';
  return '#ef4444';
}

function getMomentumBg(momentum: number): string {
  const c = getMomentumColor(momentum);
  const opacity = 0.08 + (momentum / 100) * 0.18;
  return c.replace('#', 'rgba(') + `,${opacity})` // won't work cleanly, use static
    .replace('rgba(', '').replace(/,.*/, '');
  // Just use inline logic below
}

export default function SectorHeatmap({ sectors }: { sectors?: SectorData[] }) {
  if (!sectors || sectors.length === 0) return <div>Loading sector data...</div>;

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {sectors.map((s) => {
          const color = getMomentumColor(s.momentum);
          const bgOpacity = 0.06 + (s.momentum / 100) * 0.14;
          const bg = color === '#10b981'
            ? `rgba(16,185,129,${bgOpacity})`
            : color === '#3b82f6'
            ? `rgba(59,130,246,${bgOpacity})`
            : color === '#f59e0b'
            ? `rgba(245,158,11,${bgOpacity})`
            : color === '#f97316'
            ? `rgba(249,115,22,${bgOpacity})`
            : `rgba(239,68,68,${bgOpacity})`;

          return (
            <div
              key={s.name}
              className="heatmap-cell"
              style={{
                background: bg,
                border: `1px solid ${color}30`,
                padding: '12px',
                minHeight: 90,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#e8f4fd', lineHeight: 1.3 }}>{s.name}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>
                  {s.momentum}
                  <span style={{ fontSize: 10, fontWeight: 400, color: '#8ba5c0', marginLeft: 2 }}>/100</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#4a6178' }}>{s.weight_pct}% weight</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: s.change_pct >= 0 ? '#10b981' : '#ef4444',
                  }}>
                    {s.change_pct >= 0 ? '+' : ''}{s.change_pct}%
                  </span>
                </div>
                <div style={{ marginTop: 6, height: 2, background: '#1e2d3d', borderRadius: 1 }}>
                  <div style={{ width: `${s.momentum}%`, height: '100%', background: color, borderRadius: 1 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'flex-end' }}>
        {[
          { label: 'Strong Buy (80+)', color: '#10b981' },
          { label: 'Buy (65-79)', color: '#3b82f6' },
          { label: 'Neutral (50-64)', color: '#f59e0b' },
          { label: 'Weak (<50)', color: '#ef4444' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#4a6178' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
