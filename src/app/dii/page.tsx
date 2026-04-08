'use client';

import AppLayout from '@/components/AppLayout';
import KPICard from '@/components/KPICard';
import { MOCK_TOP_DII, MOCK_FLOWS } from '@/lib/mockData';
import { TrendingUp, Shield } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const today = MOCK_FLOWS[MOCK_FLOWS.length - 1];
const weekNet = MOCK_FLOWS.slice(-5).reduce((a, b) => a + b.dii_net, 0);
const monthNet = MOCK_FLOWS.slice(-22).reduce((a, b) => a + b.dii_net, 0);

const typeBreakdown = [
  { name: 'Mutual Funds', value: 68, color: '#3b82f6' },
  { name: 'Insurance', value: 24, color: '#8b5cf6' },
  { name: 'Banks/FIs', value: 5, color: '#10b981' },
  { name: 'Others', value: 3, color: '#4a6178' },
];

export default function DIIPage() {
  const barData = MOCK_TOP_DII.map(d => ({
    name: d.name.split(' ')[0],
    change: Math.round(d.change_cr),
    aum: Math.round(d.aum_cr / 1000),
  }));

  return (
    <AppLayout title="DII Tracker" subtitle="Domestic Institutional Investor activity">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard title="Today DII Net" value={`${today.dii_net >= 0 ? '+' : ''}₹${Math.round(today.dii_net).toLocaleString()} Cr`} trend={today.dii_net >= 0 ? 'up' : 'down'} trendValue="Today" accent="green" icon={<TrendingUp size={16} />} />
        <KPICard title="Week DII Net" value={`+₹${Math.round(weekNet).toLocaleString()} Cr`} trend="up" trendValue="5 sessions" accent="green" sub="5-day" />
        <KPICard title="Month DII Net" value={`+₹${Math.abs(Math.round(monthNet/1000)).toFixed(1)}K Cr`} trend="up" trendValue="MTD" accent="blue" sub="22 sessions" />
        <KPICard title="MF Total AUM" value="₹68.4 Lac Cr" sub="All domestic MFs" trend="up" trendValue="+1.2% MoM" accent="purple" icon={<Shield size={16} />} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">DII AUM & Net Change</div>
            <div className="section-subtitle">Top institutions by deployment</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #2d4060', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8ba5c0' }} />
              <Bar dataKey="change" name="Net Change (₹ Cr)" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">DII Type Breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={40}
                dataKey="value"
                stroke="none"
              >
                {typeBreakdown.map((d, i) => (
                  <Cell key={i} fill={d.color} style={{ filter: `drop-shadow(0 0 6px ${d.color}60)` }} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #2d4060', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`${v}%`, 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {typeBreakdown.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                <span style={{ color: '#8ba5c0' }}>{d.name}</span>
                <span style={{ color: d.color, fontWeight: 700 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DII Table */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title">All DII Institutions</div>
          <div className="section-subtitle">Mutual Funds, Insurance & More</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Institution</th>
              <th style={{ textAlign: 'center' }}>Type</th>
              <th style={{ textAlign: 'right' }}>AUM (₹ Cr)</th>
              <th style={{ textAlign: 'right' }}>Net Change</th>
              <th style={{ textAlign: 'right' }}>Change %</th>
              <th>Top Picks</th>
              <th style={{ textAlign: 'center' }}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TOP_DII.map((d, i) => (
              <tr key={d.name}>
                <td style={{ color: '#4a6178' }}>{i + 1}</td>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${d.type === 'MF' ? 'badge-blue' : 'badge-purple'}`}>{d.type}</span>
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                  ₹{d.aum_cr.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: d.change_cr >= 0 ? '#10b981' : '#ef4444' }}>
                  {d.change_cr >= 0 ? '+' : ''}₹{Math.abs(d.change_cr).toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', fontSize: 12, color: d.change_pct >= 0 ? '#10b981' : '#ef4444' }}>
                  {d.change_pct >= 0 ? '+' : ''}{d.change_pct}%
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {d.top_picks.slice(0, 2).map(s => (
                      <span key={s} className="badge badge-green" style={{ fontSize: 9 }}>{s}</span>
                    ))}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${d.trend === 'BUY' ? 'badge-green' : d.trend === 'SELL' ? 'badge-red' : 'badge-yellow'}`}>
                    {d.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
