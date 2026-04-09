'use client';

import AppLayout from '@/components/AppLayout';
import KPICard from '@/components/KPICard';
import SectorHeatmap from '@/components/SectorHeatmap';
import { MOCK_SECTORS } from '@/lib/mockData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ScatterChart, Scatter, Cell
} from 'recharts';

export default function SectorsPage() {
  const topSector = [...MOCK_SECTORS].sort((a, b) => b.total_flow - a.total_flow)[0];
  const totalFII = MOCK_SECTORS.reduce((a, b) => a + b.fii_flow, 0);
  const totalDII = MOCK_SECTORS.reduce((a, b) => a + b.dii_flow, 0);

  const flowData = MOCK_SECTORS.slice(0, 8).map(s => ({
    name: s.name.split(' ')[0],
    FII: Math.round(s.fii_flow),
    DII: Math.round(s.dii_flow),
  }));

  return (
    <AppLayout title="Sector Analysis" subtitle="Institutional money flow by market sector">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard title="Top Sector Today" value={topSector.name.split(' ')[0]} sub={`₹${topSector.total_flow.toLocaleString()} Cr inflow`} trend="up" trendValue={`+${topSector.change_pct}%`} accent="green" icon={<ArrowUpRight size={16} />} />
        <KPICard title="FII Sector Total" value={`${totalFII >= 0 ? '+' : ''}₹${totalFII.toLocaleString()} Cr`} trend={totalFII >= 0 ? 'up' : 'down'} trendValue="All sectors" accent={totalFII >= 0 ? 'blue' : 'red'} />
        <KPICard title="DII Sector Total" value={`+₹${totalDII.toLocaleString()} Cr`} trend="up" trendValue="All sectors" accent="green" />
        <KPICard title="Sectors in +ve Flow" value={`${MOCK_SECTORS.filter(s => s.total_flow > 0).length}/${MOCK_SECTORS.length}`} sub="sectors bullish" trend="up" trendValue="67% breadth" accent="purple" />
      </div>

      {/* Heatmap */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title">Sector Momentum Heatmap</div>
          <div className="section-subtitle">Institutional momentum score by sector (AI-computed)</div>
        </div>
        <SectorHeatmap />
      </div>

      {/* FII vs DII bar by sector */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">FII vs DII Flow by Sector</div>
            <div className="section-subtitle">₹ Crore net flows today</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={flowData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #2d4060', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`₹${v.toLocaleString()} Cr`]}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8ba5c0' }} />
              <Bar dataKey="FII" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="DII" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector table */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Sector Rankings</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 320 }}>
            {[...MOCK_SECTORS].sort((a, b) => b.total_flow - a.total_flow).map((s, i) => (
              <div key={s.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(30,45,61,0.5)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#4a6178', width: 18 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e8f4fd' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: '#4a6178' }}>{s.weight_pct}% Nifty weight</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.total_flow >= 0 ? '#10b981' : '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
                    {s.total_flow >= 0 ? '+' : ''}₹{s.total_flow.toLocaleString()} Cr
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                    {s.change_pct >= 0 ? <ArrowUpRight size={10} color="#10b981" /> : <ArrowDownRight size={10} color="#ef4444" />}
                    <span style={{ fontSize: 10, color: s.change_pct >= 0 ? '#10b981' : '#ef4444' }}>{s.change_pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
