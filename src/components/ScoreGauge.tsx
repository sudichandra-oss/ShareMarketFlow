'use client';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
}

export default function ScoreGauge({ score, label, size = 120 }: ScoreGaugeProps) {
  const radius = (size / 2) - 12;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? '#10b981'
    : score >= 55 ? '#3b82f6'
    : score >= 40 ? '#f59e0b'
    : '#ef4444';

  const label2 = score >= 75 ? 'STRONG BUY'
    : score >= 55 ? 'ACCUMULATE'
    : score >= 40 ? 'NEUTRAL'
    : 'CAUTION';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
          {/* Background arc */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke="#1e2d3d"
            strokeWidth={10}
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease',
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
          {/* Ticks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI + (tick / 100) * Math.PI;
            const cx = size / 2 + (radius + 2) * Math.cos(angle);
            const cy = size / 2 + (radius + 2) * Math.sin(angle);
            return (
              <g key={tick}>
                <circle cx={cx} cy={cy} r={2} fill="#2d4060" />
              </g>
            );
          })}
        </svg>
        {/* Score text */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: size * 0.22, fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.06em', marginTop: 2 }}>{label2}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#8ba5c0', fontWeight: 500, textAlign: 'center' }}>{label}</div>
    </div>
  );
}
