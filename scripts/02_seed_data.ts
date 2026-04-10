import { sql } from '@neondatabase/serverless';

/**
 * Seed database with initial data from mock data
 * Run with: npx tsx scripts/02_seed_data.ts
 */

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with initial data...');

    // Create pipeline run
    const pipelineResult = await sql`
      INSERT INTO pipeline_runs (status, created_at)
      VALUES ('completed', NOW())
      RETURNING id;
    `;
    const pipelineRunId = pipelineResult.rows[0]?.id;
    console.log('✓ Created pipeline run:', pipelineRunId);

    // Insert market indices
    await sql`
      INSERT INTO market_indices (
        date, nifty50_value, nifty50_change, nifty50_change_pct,
        sensex_value, sensex_change, sensex_change_pct, created_at
      )
      VALUES (
        CURRENT_DATE,
        24187.45, -101.30, -0.42,
        79842.15, -303.60, -0.38,
        NOW()
      )
      ON CONFLICT (date) DO NOTHING;
    `;
    console.log('✓ Inserted market indices');

    // Insert sample deals
    const deals = [
      { symbol: 'HDFC', name: 'HDFC Bank', sector: 'Banking', type: 'BUY', fii: 2500, dii: 1800, flow: 700, impact: 0.45 },
      { symbol: 'INFY', name: 'Infosys', sector: 'IT', type: 'SELL', fii: -1200, dii: 600, flow: -600, impact: -0.32 },
      { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', type: 'BUY', fii: 1800, dii: 2100, flow: 3900, impact: 0.28 },
      { symbol: 'RIL', name: 'Reliance', sector: 'Energy', type: 'HOLD', fii: 900, dii: 1200, flow: 2100, impact: 0.15 },
      { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'Financial Services', type: 'BUY', fii: 3200, dii: 1500, flow: 1700, impact: 0.52 },
    ];

    for (const deal of deals) {
      await sql`
        INSERT INTO deals (
          pipeline_run_id, symbol, company_name, sector, deal_type,
          fii_volume, dii_volume, net_flow, price_impact, confidence_score, created_at
        )
        VALUES (
          ${pipelineRunId},
          ${deal.symbol}, ${deal.name}, ${deal.sector}, ${deal.type},
          ${deal.fii}, ${deal.dii}, ${deal.flow}, ${deal.impact}, ${Math.random() * 100},
          NOW()
        );
      `;
    }
    console.log('✓ Inserted', deals.length, 'deals');

    // Insert FII/DII analysis
    const sectors = ['Banking', 'IT', 'FMCG', 'Energy', 'Financial Services'];
    for (const sector of sectors) {
      const fiiInflow = Math.random() * 3000;
      const diiInflow = Math.random() * 2500;
      await sql`
        INSERT INTO fii_dii_analysis (
          pipeline_run_id, sector, fii_inflow, fii_outflow, dii_inflow, dii_outflow,
          net_institutional_flow, trend, created_at
        )
        VALUES (
          ${pipelineRunId},
          ${sector},
          ${fiiInflow}, ${fiiInflow * 0.6}, ${diiInflow}, ${diiInflow * 0.5},
          ${fiiInflow + diiInflow}, 'BULLISH',
          NOW()
        );
      `;
    }
    console.log('✓ Inserted sector analysis');

    // Insert insights
    const insights = [
      {
        title: 'Banking Sector Rally Expected',
        desc: 'GIC and BlackRock led bulk deals in banking sector. NIM expansion expectations supportive.',
        cat: 'SECTOR_TREND',
        sev: 'high',
      },
      {
        title: 'IT Weakness Continues',
        desc: 'Vanguard and Fidelity reducing IT exposure. Wait for Q4 results.',
        cat: 'SECTOR_TREND',
        sev: 'medium',
      },
      {
        title: 'Smart Money Score Upgraded',
        desc: 'Score upgraded to 74/100 after FII reversal. Three consecutive buying sessions expected.',
        cat: 'MARKET_SIGNAL',
        sev: 'high',
      },
    ];

    for (const insight of insights) {
      await sql`
        INSERT INTO insights (
          pipeline_run_id, title, description, category, severity, related_symbols, action_items, created_at
        )
        VALUES (
          ${pipelineRunId},
          ${insight.title}, ${insight.desc}, ${insight.cat}, ${insight.sev},
          '["HDFC", "ICICI"]'::jsonb, '["Watch for sector leadership", "Monitor NIM expansion"]'::jsonb,
          NOW()
        );
      `;
    }
    console.log('✓ Inserted insights');

    // Insert alerts
    const alerts = [
      {
        symbol: 'HDFC',
        type: 'LARGE_DEAL',
        msg: 'GIC Private Limited bought HDFC Bank at premium',
        pri: 'high',
        thresh: 'bulk_deal_threshold',
        val: 2500,
      },
      {
        symbol: 'INFY',
        type: 'STAKE_CHANGE',
        msg: 'Vanguard reduced IT fund exposure by 0.8%',
        pri: 'medium',
        thresh: 'stake_change',
        val: 1200,
      },
      {
        symbol: 'ITC',
        type: 'SECTOR_FLOW',
        msg: 'FMCG sector receives net FII inflow of ₹1,800 Cr',
        pri: 'medium',
        thresh: 'sector_flow',
        val: 1800,
      },
    ];

    for (const alert of alerts) {
      await sql`
        INSERT INTO alerts (
          pipeline_run_id, symbol, alert_type, message, priority,
          threshold_breached, current_value, threshold_value, recommended_action, created_at
        )
        VALUES (
          ${pipelineRunId},
          ${alert.symbol}, ${alert.type}, ${alert.msg}, ${alert.pri},
          ${alert.thresh}, ${alert.val}, 1000, 'Monitor for follow-up deals',
          NOW()
        );
      `;
    }
    console.log('✓ Inserted alerts');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
