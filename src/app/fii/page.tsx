'use client';

import AppLayout from '@/components/AppLayout';
import KPICard from '@/components/KPICard';
import { MOCK_TOP_FII, MOCK_FLOWS } from '@/lib/mockData';
import { Globe, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const today = MOCK_FLOWS[MOCK_FLOWS.length - 1];
const weekFlows = MOCK_FLOWS.slice(-5);
const weekNet = weekFlows.reduce((a, b) => a + b.fii_net, 0);
const monthFlows = MOCK_FLOWS.slice(-22);
const monthNet = monthFlows.reduce((a, b) => a + b.fii_net, 0);

export default function FIIPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'aum' | 'change'>('aum');

  const filtered = MOCK_TOP_FII
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.country.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'aum' ? b.aum_cr - a.aum_cr : b.change_cr - a.change_cr);

  const barData = MOCK_TOP_FII.slice(0, 8).map(f => ({
    name: f.name.split(' ')[0],
    change: Math.round(f.change_cr),
  }));

  return (
    <AppLayout title="FII Tracker" subtitle="Foreign Institutional Investor activity — Real-time">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard title="Today FII Net" value={`${today.fii_net >= 0 ? '+' : ''}₹${Math.round(today.fii_net).toLocaleString()} Cr`} trend={today.fii_net >= 0 ? 'up' : 'down'} trendValue="Today" accent={today.fii_net >= 0 ? 'blue' : 'red'} icon={<TrendingUp size={16} />} />
        <KPICard title="Week Net Flow" value={`${weekNet >= 0 ? '+' : ''}₹${Math.round(weekNet).toLocaleString()} Cr`} trend={weekNet >= 0 ? 'up' : 'down'} trendValue="5 sessions" accent={weekNet >= 0 ? 'green' : 'red'} sub="5-day" />
        <KPICard title="Month Net Flow" value={`${monthNet >= 0 ? '+' : ''}₹${Math.abs(Math.round(monthNet/1000)).toFixed(1)}K Cr`} trend={monthNet >= 0 ? 'up' : 'down'} trendValue="22 sessions" accent={monthNet >= 0 ? 'blue' : 'red'} sub="MTD" />
        <KPICard title="Active FIIs" value="842" sub="registered with SEBI" trend="up" trendValue="+12 YTD" accent="purple" icon={<Globe size={16} />} />
      </div>

      {/* Chart + Country breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Top FII Net Change (₹ Cr)</div>
            <div className="section-subtitle">Current quarter vs previous quarter AUM change</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#4a6178', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8ba5c0', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #2d4060', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`₹${v.toLocaleString()} Cr`, 'Net Change']}
              />
              <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={d.change >= 0 ? '#3b82f6' : '#ef4444'} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">By Country</div>
          </div>
          {[
            { c: 'USA', pct: 42, color: '#3b82f6' },
            { c: 'Singapore', pct: 21, color: '#8b5cf6' },
            { c: 'Norway', pct: 10, color: '#10b981' },
            { c: 'UK', pct: 9, color: '#f59e0b' },
            { c: 'Canada', pct: 7, color: '#f97316' },
            { c: 'Others', pct: 11, color: '#4a6178' },
          ].map(({ c, pct, color }) => (
            <div key={c} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#e8f4fd' }}>{c}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div className="section-title">All FII Institutions</div>
            <div className="section-subtitle">Sorted by {sortBy === 'aum' ? 'AUM' : 'net change'}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4a6178' }} />
              <input
                className="form-input"
                style={{ paddingLeft: 30, width: 200 }}
                placeholder="Search institution..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="aum">Sort: AUM</option>
              <option value="change">Sort: Net Change</option>
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Institution</th>
              <th>Country</th>
              <th style={{ textAlign: 'right' }}>AUM (₹ Cr)</th>
              <th style={{ textAlign: 'right' }}>Net Change</th>
              <th style={{ textAlign: 'right' }}>Change %</th>
              <th>Top Sectors</th>
              <th style={{ textAlign: 'center' }}>Holdings</th>
              <th style={{ textAlign: 'center' }}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.name}>
                <td style={{ color: '#4a6178' }}>{i + 1}</td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{f.name}</td>
                <td style={{ color: '#8ba5c0' }}>{f.country}</td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                  ₹{f.aum_cr.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: f.change_cr >= 0 ? '#10b981' : '#ef4444' }}>
                  {f.change_cr >= 0 ? '+' : ''}₹{Math.abs(f.change_cr).toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', fontSize: 12, color: f.change_pct >= 0 ? '#10b981' : '#ef4444' }}>
                  {f.change_pct >= 0 ? '+' : ''}{f.change_pct}%
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {f.sectors.slice(0, 2).map(s => (
                      <span key={s} className="badge badge-blue" style={{ fontSize: 9 }}>{s}</span>
                    ))}
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{f.holdings_count}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${f.trend === 'BUY' ? 'badge-green' : f.trend === 'SELL' ? 'badge-red' : 'badge-yellow'}`}>
                    {f.trend}
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
