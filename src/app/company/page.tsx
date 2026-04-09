'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Search } from 'lucide-react';
import { api, Company, BulkDeal } from '@/lib/api';

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<BulkDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [compRes, dealRes] = await Promise.all([
          api.getCompanies(),
          api.getDeals(),
        ]);
        setCompanies(compRes || []);
        setDeals(dealRes || []);
      } catch (err) {
        console.error('Failed to load company data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = companies.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.ticker || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.sector || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AppLayout title="Company Deep Dive" subtitle="Loading data...">
        <div style={{ padding: 40, textAlign: 'center', color: '#8ba5c0' }}>Loading data...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Company Deep Dive" subtitle="Institutional ownership by company">
      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a6178' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 40, width: '100%', fontSize: 14, padding: '12px 12px 12px 40px' }}
            placeholder="Search by company, ticker or sector..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Company cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {filtered.map(c => (
          <div key={c.ticker} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#e8f4fd' }}>{c.ticker}</div>
                <div style={{ fontSize: 12, color: '#8ba5c0' }}>{c.name}</div>
                <span className="badge badge-blue" style={{ marginTop: 4, fontSize: 9 }}>{c.sector}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#e8f4fd' }}>
                  ₹{c.price.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: c.change_pct >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {c.change_pct >= 0 ? '▲' : '▼'} {Math.abs(c.change_pct)}%
                </div>
              </div>
            </div>

            {/* Ownership bars */}
            <div style={{ marginBottom: 16 }}>
              {[
                { label: 'FII', pct: c.fii_pct, color: '#3b82f6' },
                { label: 'DII', pct: c.dii_pct, color: '#10b981' },
                { label: 'Promoter', pct: c.promoter_pct, color: '#8b5cf6' },
              ].map(({ label, pct, color }) => pct > 0 && (
                <div key={label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: '#8ba5c0' }}>{label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Score */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: '#4a6178', marginBottom: 2 }}>Smart Money Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ height: 6, width: 100, background: '#1e2d3d', borderRadius: 3 }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: `${c.smart_score}%`,
                      background: c.smart_score >= 75 ? '#10b981' : c.smart_score >= 55 ? '#3b82f6' : '#f59e0b',
                    }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: c.smart_score >= 75 ? '#10b981' : c.smart_score >= 55 ? '#3b82f6' : '#f59e0b' }}>
                    {c.smart_score}
                  </span>
                </div>
              </div>
              <span className={`badge ${c.smart_score >= 75 ? 'badge-green' : c.smart_score >= 55 ? 'badge-blue' : 'badge-yellow'}`}>
                {c.smart_score >= 75 ? 'STRONG BUY' : c.smart_score >= 55 ? 'BUY' : 'NEUTRAL'}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#8ba5c0', gridColumn: '1 / -1' }}>
            No companies found.
          </div>
        )}
      </div>

      {/* Recent bulk deals for these companies */}
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title">Recent Bulk & Block Deals</div>
          <div className="section-subtitle">NSE + BSE highlighted transactions</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Company</th>
              <th>Client / Institution</th>
              <th>Exchange</th>
              <th style={{ textAlign: 'center' }}>Side</th>
              <th style={{ textAlign: 'right' }}>Quantity</th>
              <th style={{ textAlign: 'right' }}>Price (₹)</th>
              <th style={{ textAlign: 'right' }}>Value (₹ Cr)</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <tr key={i}>
                <td style={{ color: '#4a6178', fontSize: 11 }}>{d.date}</td>
                <td style={{ fontWeight: 700, color: '#3b82f6' }}>{d.symbol}</td>
                <td style={{ fontSize: 12 }}>{d.company}</td>
                <td style={{ fontSize: 12, color: '#8ba5c0' }}>{d.client}</td>
                <td><span className="badge badge-blue" style={{ fontSize: 9 }}>{d.exchange}</span></td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${d.side === 'BUY' ? 'badge-green' : 'badge-red'}`}>{d.side}</span>
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                  {d.qty.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                  {d.price.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: d.side === 'BUY' ? '#10b981' : '#ef4444' }}>
                  ₹{d.value_cr.toFixed(2)}
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 20, color: '#8ba5c0' }}>No recent deals found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
