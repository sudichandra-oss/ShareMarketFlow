'use client';

import AppLayout from '@/components/AppLayout';
import KPICard from '@/components/KPICard';
import ScoreGauge from '@/components/ScoreGauge';
import { FIIDIIFlowChart, CumulativeFlowChart } from '@/components/FlowCharts';
import { MOCK_FLOWS, MOCK_BULK_DEALS, MOCK_INSIGHTS, MOCK_TOP_FII, MOCK_TOP_DII } from '@/lib/mockData';
import { TrendingUp, TrendingDown, ArrowUpRight, Zap } from 'lucide-react';

const today = MOCK_FLOWS[MOCK_FLOWS.length - 1];

export default function OverviewPage() {
  return (
    <AppLayout title="Overview Dashboard" subtitle="FII/DII Intelligence — April 7, 2025">
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard
          title="FII Net Flow Today"
          value={`${today.fii_net >= 0 ? '+' : ''}₹${Math.round(today.fii_net).toLocaleString()} Cr`}
          sub="vs yesterday"
          trend={today.fii_net >= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(((today.fii_net - MOCK_FLOWS[MOCK_FLOWS.length-2].fii_net) / Math.abs(MOCK_FLOWS[MOCK_FLOWS.length-2].fii_net))*100).toFixed(1)}%`}
          accent={today.fii_net >= 0 ? 'blue' : 'red'}
          icon={<TrendingUp size={16} />}
        />
        <KPICard
          title="DII Net Flow Today"
          value={`${today.dii_net >= 0 ? '+' : ''}₹${Math.round(today.dii_net).toLocaleString()} Cr`}
          sub="vs yesterday"
          trend={today.dii_net >= 0 ? 'up' : 'down'}
          trendValue="2.4%"
          accent={today.dii_net >= 0 ? 'green' : 'red'}
          icon={<TrendingUp size={16} />}
        />
        <KPICard
          title="Bulk Deals Today"
          value="8"
          sub="₹7,580 Cr total"
          trend="up"
          trendValue="3 new"
          accent="purple"
          icon={<Zap size={16} />}
        />
        <KPICard
          title="Smart Money Score"
          value="74/100"
          sub="Upgraded from 61"
          trend="up"
          trendValue="+13 pts"
          accent="yellow"
          icon={<ArrowUpRight size={16} />}
        />
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Flow chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Daily FII vs DII Net Flow</div>
            <div className="section-subtitle">Last 14 sessions — ₹ Crore</div>
          </div>
          <FIIDIIFlowChart />
        </div>

        {/* Scores */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Intelligence Metrics</div>
            <div className="section-subtitle">AI-computed market signals</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
            <ScoreGauge score={MOCK_INSIGHTS.smart_money_score} label="Smart Money Score" size={130} />
            <ScoreGauge score={MOCK_INSIGHTS.sector_momentum} label="Sector Momentum" size={130} />
            <ScoreGauge score={MOCK_INSIGHTS.institutional_confidence} label="Inst. Confidence" size={130} />
          </div>
          <div style={{
            marginTop: 20,
            padding: '10px 14px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8,
            fontSize: 12,
            color: '#10b981',
          }}>
            💡 {MOCK_INSIGHTS.summary.slice(0, 120)}...
          </div>
        </div>
      </div>

      {/* Cumulative + Deals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">30-Day Cumulative Flows</div>
            <div className="section-subtitle">Net institutional position build-up</div>
          </div>
          <CumulativeFlowChart />
        </div>

        {/* Top movers */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Today&apos;s Bulk Deals</div>
            <div className="section-subtitle">NSE + BSE combined</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 200 }}>
            {MOCK_BULK_DEALS.slice(0, 5).map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: i < 4 ? '1px solid rgba(30,45,61,0.5)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#e8f4fd' }}>{d.symbol}</div>
                  <div style={{ fontSize: 10, color: '#4a6178' }}>{d.client.slice(0, 22)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${d.side === 'BUY' ? 'badge-green' : 'badge-red'}`}>
                    {d.side}
                  </span>
                  <div style={{ fontSize: 11, color: '#8ba5c0', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    ₹{d.value_cr.toFixed(0)} Cr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FII + DII mini tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Top FII Activity</div>
            <div className="section-subtitle">By AUM in Indian markets</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Country</th>
                <th style={{ textAlign: 'right' }}>Net Change</th>
                <th style={{ textAlign: 'center' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_FII.slice(0, 5).map((f) => (
                <tr key={f.name}>
                  <td style={{ fontSize: 12 }}>{f.name}</td>
                  <td style={{ fontSize: 11, color: '#4a6178' }}>{f.country}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: f.change_cr >= 0 ? '#10b981' : '#ef4444' }}>
                    {f.change_cr >= 0 ? '+' : ''}₹{Math.abs(f.change_cr).toLocaleString()} Cr
                  </td>
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

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Top DII Activity</div>
            <div className="section-subtitle">Mutual Funds + Insurance</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Net Change</th>
                <th style={{ textAlign: 'center' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_DII.slice(0, 5).map((d) => (
                <tr key={d.name}>
                  <td style={{ fontSize: 12 }}>{d.name}</td>
                  <td>
                    <span className={`badge ${d.type === 'MF' ? 'badge-blue' : 'badge-purple'}`}>
                      {d.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: d.change_cr >= 0 ? '#10b981' : '#ef4444' }}>
                    {d.change_cr >= 0 ? '+' : ''}₹{Math.abs(d.change_cr).toLocaleString()} Cr
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
      </div>
    </AppLayout>
  );
}
