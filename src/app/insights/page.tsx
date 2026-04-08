'use client';

import AppLayout from '@/components/AppLayout';
import ScoreGauge from '@/components/ScoreGauge';
import { MOCK_INSIGHTS } from '@/lib/mockData';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function InsightsPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <AppLayout title="AI Insights" subtitle="Daily Smart Money Report — powered by multi-agent AI">
      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={18} color="#8b5cf6" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.08em' }}>AI SMART MONEY REPORT</span>
              <span className="badge badge-purple">DAILY</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e8f4fd', marginBottom: 10, letterSpacing: '-0.02em' }}>
              {MOCK_INSIGHTS.title}
            </h2>
            <p style={{ fontSize: 14, color: '#8ba5c0', lineHeight: 1.7, maxWidth: 700 }}>
              {MOCK_INSIGHTS.summary}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginLeft: 24 }}>
            <ScoreGauge score={MOCK_INSIGHTS.smart_money_score} label="Smart Money Score" size={110} />
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#4a6178' }}>
            Generated: {MOCK_INSIGHTS.date} • 4:12 PM IST • 4 agents
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px',
            background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 20,
            color: '#3b82f6',
            fontSize: 11, fontWeight: 600,
            cursor: 'pointer',
          }}>
            <RefreshCw size={12} />
            Re-run Agents
          </button>
        </div>
      </div>

      {/* Scores row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { score: MOCK_INSIGHTS.smart_money_score, label: 'Smart Money Score', desc: 'Weighted FII + DII net flow signal' },
          { score: MOCK_INSIGHTS.sector_momentum, label: 'Sector Momentum', desc: 'Breadth of institutional sector inflow' },
          { score: MOCK_INSIGHTS.institutional_confidence, label: 'Inst. Confidence', desc: '% Nifty50 stocks with net FII buying' },
        ].map(({ score, label, desc }) => (
          <div key={label} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
            <ScoreGauge score={score} label={label} size={120} />
            <div style={{ fontSize: 11, color: '#4a6178', marginTop: 8 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Key Points */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="section-title">Key Insights for Today</div>
          <div className="section-subtitle">AI-extracted signals from FII/DII data + news correlation</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MOCK_INSIGHTS.key_points.map((kp, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14,
              padding: '14px 16px',
              background: 'rgba(59,130,246,0.04)',
              border: '1px solid rgba(59,130,246,0.12)',
              borderRadius: 10,
              transition: 'border-color 0.2s',
            }}>
              <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{kp.icon}</div>
              <div style={{ fontSize: 13, color: '#c5d8ea', lineHeight: 1.6 }}>{kp.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Full report */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div className="section-title">Full Research Report</div>
            <div className="section-subtitle">Deep-dive analysis generated by AI Market Analyst agent</div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #2d4060',
              borderRadius: 8,
              color: '#8ba5c0',
              fontSize: 12, cursor: 'pointer',
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Summary always visible */}
        <div style={{ padding: '16px', background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 6, letterSpacing: '0.05em' }}>EXECUTIVE SUMMARY</div>
          <div style={{ fontSize: 13, color: '#c5d8ea', lineHeight: 1.8 }}>
            Today marked a pivotal reversal in FII sentiment. After three consecutive sessions of outflows totaling ₹8,200 Cr, foreign institutions turned net buyers with ₹2,847 Cr. The shift was broad-based across Banking, Telecom, and Pharma sectors. Smart Money Score upgraded to 74/100.
          </div>
        </div>

        {expanded && (
          <div style={{ fontSize: 13, color: '#8ba5c0', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
            {/* Formatted full report */}
            {[
              { h: '🏦 Banking Thesis Intact', body: 'GIC Private Limited and BlackRock led bulk deal purchases in HDFC Bank and ICICI Bank. Both stocks have corrected 8-12% from 52-week highs, creating attractive entry points for long-term buyers. NIM expansion expectations for Q1FY26 are supportive.' },
              { h: '📡 Telecom — 5G Monetization Play', body: "Temasek's block deal in Bharti Airtel at a premium signals strong conviction in 5G ARPU growth. Reliance Jio's upcoming IPO news may be a catalyst driving FII positioning in the space." },
              { h: '🏗️ Infrastructure — DII Conviction Buy', body: 'LIC continues to be the dominant buyer in infrastructure names (L&T, NTPC, Power Grid). PSU infrastructure firms trading at 40% discount to private peers. Budget spending cycle supportive.' },
              { h: '⚠️ IT Under Pressure', body: 'Vanguard and Fidelity both reduced IT exposure today. US tech spending slowdown and AI disruption narratives weigh on outsourcing revenue visibility. Wait for Q4 results before re-entry.' },
            ].map(({ h, body }) => (
              <div key={h} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e8f4fd', marginBottom: 6 }}>{h}</div>
                <div style={{ color: '#8ba5c0' }}>{body}</div>
              </div>
            ))}

            {/* Flow table */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f4fd', marginBottom: 10 }}>FII/DII Flow Summary</div>
              <table className="data-table">
                <thead>
                  <tr><th>Type</th><th style={{textAlign:'right'}}>Gross Buy</th><th style={{textAlign:'right'}}>Gross Sell</th><th style={{textAlign:'right'}}>Net</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>FII</td>
                    <td style={{textAlign:'right'}}>₹12,840 Cr</td>
                    <td style={{textAlign:'right'}}>₹9,993 Cr</td>
                    <td style={{textAlign:'right', color:'#10b981', fontWeight:700}}>+₹2,847 Cr</td>
                  </tr>
                  <tr>
                    <td>DII</td>
                    <td style={{textAlign:'right'}}>₹8,100 Cr</td>
                    <td style={{textAlign:'right'}}>₹4,230 Cr</td>
                    <td style={{textAlign:'right', color:'#10b981', fontWeight:700}}>+₹3,870 Cr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, padding: 14, background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)', fontSize: 13, color: '#f59e0b' }}>
              <strong>Outlook:</strong> If FII buying sustains above ₹2,000 Cr for 3 sessions, Nifty could test 24,200. Watch Banking sector for leadership. Key risk: US CPI data due Thursday.
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
