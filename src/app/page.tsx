'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import KPICard from '@/components/KPICard';
import ScoreGauge from '@/components/ScoreGauge';
import { FIIDIIFlowChart, CumulativeFlowChart } from '@/components/FlowCharts';
import { TrendingUp, TrendingDown, ArrowUpRight, Zap } from 'lucide-react';
import { api, Flow, BulkDeal, Insight, InstitutionActivity } from '@/lib/api';

export default function OverviewPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [deals, setDeals] = useState<BulkDeal[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [topFii, setTopFii] = useState<InstitutionActivity[]>([]);
  const [topDii, setTopDii] = useState<InstitutionActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fRes, dRes, iRes, fiiRes, diiRes] = await Promise.all([
          api.getDailyFlows(30),
          api.getDeals(),
          api.getLatestInsight(),
          api.getTopFII(5),
          api.getTopDII(5),
        ]);
        setFlows(fRes);
        setDeals(dRes);
        setInsight(iRes);
        setTopFii(fiiRes);
        setTopDii(diiRes);
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Overview Dashboard" subtitle="Loading metrics...">
        <div style={{ padding: 40, textAlign: 'center', color: '#8ba5c0' }}>Loading data...</div>
      </AppLayout>
    );
  }

  const today = flows.length > 0 ? flows[flows.length - 1] : null;
  const yesterday = flows.length > 1 ? flows[flows.length - 2] : null;

  return (
    <AppLayout title="Overview Dashboard" subtitle={insight?.title || 'FII/DII Intelligence'}>
      {/* KPI Row */}
      {today && yesterday && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <KPICard
            title="FII Net Flow Today"
            value={`${today.fii_net >= 0 ? '+' : ''}₹${Math.round(today.fii_net).toLocaleString()} Cr`}
            sub="vs yesterday"
            trend={today.fii_net >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(((today.fii_net - yesterday.fii_net) / Math.abs(yesterday.fii_net)) * 100).toFixed(1)}%`}
            accent={today.fii_net >= 0 ? 'blue' : 'red'}
            icon={today.fii_net >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          />
          <KPICard
            title="DII Net Flow Today"
            value={`${today.dii_net >= 0 ? '+' : ''}₹${Math.round(today.dii_net).toLocaleString()} Cr`}
            sub="vs yesterday"
            trend={today.dii_net >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(((today.dii_net - yesterday.dii_net) / Math.abs(yesterday.dii_net)) * 100).toFixed(1)}%`}
            accent={today.dii_net >= 0 ? 'green' : 'red'}
            icon={today.dii_net >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          />
          <KPICard
            title="Bulk Deals Today"
            value={deals.filter(d => d.date === today.date).length.toString() || '0'}
            sub="Active Deals"
            trend="up"
            trendValue=""
            accent="purple"
            icon={<Zap size={16} />}
          />
          <KPICard
            title="Smart Money Score"
            value={`${insight?.smart_money_score || 0}/100`}
            sub="Overall Confidence"
            trend="up"
            trendValue=""
            accent="yellow"
            icon={<ArrowUpRight size={16} />}
          />
        </div>
      )}

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Flow chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Daily FII vs DII Net Flow</div>
            <div className="section-subtitle">Last 14 sessions — ₹ Crore</div>
          </div>
          <FIIDIIFlowChart flows={flows} />
        </div>

        {/* Scores */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Intelligence Metrics</div>
            <div className="section-subtitle">AI-computed market signals</div>
          </div>
          {insight && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
                <ScoreGauge score={insight.smart_money_score} label="Smart Money Score" size={130} />
                <ScoreGauge score={insight.sector_momentum} label="Sector Momentum" size={130} />
                <ScoreGauge score={insight.institutional_confidence} label="Inst. Confidence" size={130} />
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
                💡 {insight.summary.slice(0, 120)}...
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cumulative + Deals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">30-Day Cumulative Flows</div>
            <div className="section-subtitle">Net institutional position build-up</div>
          </div>
          <CumulativeFlowChart flows={flows} />
        </div>

        {/* Top movers */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">Latest Bulk Deals</div>
            <div className="section-subtitle">NSE + BSE combined</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 200 }}>
            {deals.slice(0, 5).map((d, i) => (
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
              {topFii.map((f) => (
                <tr key={f.name}>
                  <td style={{ fontSize: 12 }}>{f.name}</td>
                  <td style={{ fontSize: 11, color: '#4a6178' }}>{f.country || 'Global'}</td>
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
              {topDii.map((d) => (
                <tr key={d.name}>
                  <td style={{ fontSize: 12 }}>{d.name}</td>
                  <td>
                    <span className={`badge ${d.type === 'MF' ? 'badge-blue' : 'badge-purple'}`}>
                      {d.type || 'Inst'}
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
