'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { Flow } from '@/lib/api';

const formatCr = (v: number) => `₹${Math.abs(v / 1000).toFixed(1)}K Cr`;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#111827', border: '1px solid #2d4060',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: '#8ba5c0', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>₹{Math.abs(p.value).toFixed(0)} Cr</strong>
        </div>
      ))}
    </div>
  );
}

export function FIIDIIFlowChart({ flows }: { flows: Flow[] }) {
  if (!flows || flows.length === 0) return <div>No flow data</div>;
  const data = flows.slice(-14).map(d => ({
    date: d.date.slice(5),
    'FII Net': Math.round(d.fii_net),
    'DII Net': Math.round(d.dii_net),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={4}>
        <defs>
          <linearGradient id="fiiPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="diiPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#2d4060" />
        <Legend wrapperStyle={{ fontSize: 11, color: '#8ba5c0' }} />
        <Bar dataKey="FII Net" fill="#3b82f6" radius={[3, 3, 0, 0]}
          label={false}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.3))' }}
        />
        <Bar dataKey="DII Net" fill="#10b981" radius={[3, 3, 0, 0]}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.3))' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CumulativeFlowChart({ flows }: { flows: Flow[] }) {
  if (!flows || flows.length === 0) return <div>No flow data</div>;
  let fiiCum = 0, diiCum = 0;
  const data = flows.map(d => {
    fiiCum += d.fii_net;
    diiCum += d.dii_net;
    return {
      date: d.date.slice(5),
      FII: Math.round(fiiCum),
      DII: Math.round(diiCum),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradFII" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradDII" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#4a6178', fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
        <YAxis tick={{ fill: '#4a6178', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#2d4060" />
        <Area type="monotone" dataKey="FII" stroke="#3b82f6" strokeWidth={2} fill="url(#gradFII)" dot={false} />
        <Area type="monotone" dataKey="DII" stroke="#10b981" strokeWidth={2} fill="url(#gradDII)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
