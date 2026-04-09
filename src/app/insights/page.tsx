'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ScoreGauge from '@/components/ScoreGauge';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { api, Insight } from '@/lib/api';

export default function InsightsPage() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLatestInsight();
        setInsight(data);
      } catch (err) {
        console.error('Failed to fetch insight', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AppLayout title="AI Insights" subtitle="Loading latest findings...">
        <div style={{ padding: 40, textAlign: 'center', color: '#8ba5c0' }}>Loading data...</div>
      </AppLayout>
    );
  }

  if (!insight) {
    return (
      <AppLayout title="AI Insights" subtitle="Daily Smart Money Report">
        <div style={{ padding: 40, textAlign: 'center', color: '#8ba5c0' }}>Failed to load insights.</div>
      </AppLayout>
    );
  }

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
              {insight.title}
            </h2>
            <p style={{ fontSize: 14, color: '#8ba5c0', lineHeight: 1.7, maxWidth: 700 }}>
              {insight.summary}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginLeft: 24 }}>
            <ScoreGauge score={insight.smart_money_score} label="Smart Money Score" size={110} />
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#4a6178' }}>
            Generated: {insight.report_date} • 4 agents
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
          { score: insight.smart_money_score, label: 'Smart Money Score', desc: 'Weighted FII + DII net flow signal' },
          { score: insight.sector_momentum, label: 'Sector Momentum', desc: 'Breadth of institutional sector inflow' },
          { score: insight.institutional_confidence, label: 'Inst. Confidence', desc: '% Nifty50 stocks with net FII buying' },
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
          {(insight.key_points || []).map((kp, i) => (
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
            {insight.summary}
          </div>
        </div>

        {expanded && (
          <div style={{ fontSize: 13, color: '#8ba5c0', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
            {insight.full_report || (
              /* Fallback if full_report wasn't provided */
              <div>{insight.summary}</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
