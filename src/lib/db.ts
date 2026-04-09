import { sql } from '@vercel/postgres';

/**
 * Save market indices to database
 */
export async function saveMarketIndices(data: {
  date: string;
  nifty50_value: number;
  nifty50_change: number;
  nifty50_change_pct: number;
  sensex_value: number;
  sensex_change: number;
  sensex_change_pct: number;
  nse_change_pct: number;
}) {
  try {
    await sql`
      INSERT INTO market_indices 
      (date, nifty50_value, nifty50_change, nifty50_change_pct, sensex_value, sensex_change, sensex_change_pct, nse_change_pct)
      VALUES (${data.date}, ${data.nifty50_value}, ${data.nifty50_change}, ${data.nifty50_change_pct}, ${data.sensex_value}, ${data.sensex_change}, ${data.sensex_change_pct}, ${data.nse_change_pct})
      ON CONFLICT (date) DO UPDATE SET
      nifty50_value = ${data.nifty50_value},
      nifty50_change = ${data.nifty50_change},
      nifty50_change_pct = ${data.nifty50_change_pct},
      sensex_value = ${data.sensex_value},
      sensex_change = ${data.sensex_change},
      sensex_change_pct = ${data.sensex_change_pct},
      nse_change_pct = ${data.nse_change_pct},
      updated_at = NOW()
    `;
  } catch (error) {
    console.error('[v0] Failed to save market indices:', error);
    throw error;
  }
}

/**
 * Get latest market indices
 */
export async function getLatestMarketIndices() {
  try {
    const result = await sql`
      SELECT * FROM market_indices 
      ORDER BY date DESC 
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Failed to get market indices:', error);
    throw error;
  }
}

/**
 * Save deals to database
 */
export async function saveDeal(data: {
  date: string;
  company: string;
  sector: string;
  deal_type: string;
  fii_value: number;
  dii_value: number;
  net_value: number;
  sentiment: string;
  analysis: string;
}) {
  try {
    await sql`
      INSERT INTO deals 
      (date, company, sector, deal_type, fii_value, dii_value, net_value, sentiment, analysis)
      VALUES (${data.date}, ${data.company}, ${data.sector}, ${data.deal_type}, ${data.fii_value}, ${data.dii_value}, ${data.net_value}, ${data.sentiment}, ${data.analysis})
    `;
  } catch (error) {
    console.error('[v0] Failed to save deal:', error);
    throw error;
  }
}

/**
 * Get deals for a specific date
 */
export async function getDealsByDate(date: string) {
  try {
    const result = await sql`
      SELECT * FROM deals 
      WHERE date = ${date}
      ORDER BY net_value DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('[v0] Failed to get deals:', error);
    throw error;
  }
}

/**
 * Save FII/DII analysis
 */
export async function saveFiiDiiAnalysis(data: {
  date: string;
  total_fii_inflow: number;
  total_dii_inflow: number;
  net_flow: number;
  fii_sentiment: string;
  dii_sentiment: string;
  analysis: string;
}) {
  try {
    await sql`
      INSERT INTO fii_dii_analysis 
      (date, total_fii_inflow, total_dii_inflow, net_flow, fii_sentiment, dii_sentiment, analysis)
      VALUES (${data.date}, ${data.total_fii_inflow}, ${data.total_dii_inflow}, ${data.net_flow}, ${data.fii_sentiment}, ${data.dii_sentiment}, ${data.analysis})
      ON CONFLICT (date) DO UPDATE SET
      total_fii_inflow = ${data.total_fii_inflow},
      total_dii_inflow = ${data.total_dii_inflow},
      net_flow = ${data.net_flow},
      fii_sentiment = ${data.fii_sentiment},
      dii_sentiment = ${data.dii_sentiment},
      analysis = ${data.analysis},
      updated_at = NOW()
    `;
  } catch (error) {
    console.error('[v0] Failed to save FII/DII analysis:', error);
    throw error;
  }
}

/**
 * Get latest FII/DII analysis
 */
export async function getLatestFiiDiiAnalysis() {
  try {
    const result = await sql`
      SELECT * FROM fii_dii_analysis 
      ORDER BY date DESC 
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Failed to get FII/DII analysis:', error);
    throw error;
  }
}

/**
 * Save insight
 */
export async function saveInsight(data: {
  date: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  actionable: boolean;
}) {
  try {
    await sql`
      INSERT INTO insights 
      (date, title, description, category, priority, actionable)
      VALUES (${data.date}, ${data.title}, ${data.description}, ${data.category}, ${data.priority}, ${data.actionable})
    `;
  } catch (error) {
    console.error('[v0] Failed to save insight:', error);
    throw error;
  }
}

/**
 * Get insights for a specific date
 */
export async function getInsightsByDate(date: string) {
  try {
    const result = await sql`
      SELECT * FROM insights 
      WHERE date = ${date}
      ORDER BY priority DESC, created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('[v0] Failed to get insights:', error);
    throw error;
  }
}

/**
 * Save alert
 */
export async function saveAlert(data: {
  date: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  is_active: boolean;
}) {
  try {
    await sql`
      INSERT INTO alerts 
      (date, title, description, alert_type, severity, is_active)
      VALUES (${data.date}, ${data.title}, ${data.description}, ${data.alert_type}, ${data.severity}, ${data.is_active})
    `;
  } catch (error) {
    console.error('[v0] Failed to save alert:', error);
    throw error;
  }
}

/**
 * Get active alerts
 */
export async function getActiveAlerts() {
  try {
    const result = await sql`
      SELECT * FROM alerts 
      WHERE is_active = true
      ORDER BY severity DESC, created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('[v0] Failed to get alerts:', error);
    throw error;
  }
}

/**
 * Save pipeline run
 */
export async function savePipelineRun(data: {
  start_time: string;
  end_time?: string;
  status: string;
  message?: string;
  deals_processed: number;
  alerts_generated: number;
  insights_generated: number;
}) {
  try {
    const result = await sql`
      INSERT INTO pipeline_runs 
      (start_time, end_time, status, message, deals_processed, alerts_generated, insights_generated)
      VALUES (${data.start_time}, ${data.end_time}, ${data.status}, ${data.message}, ${data.deals_processed}, ${data.alerts_generated}, ${data.insights_generated})
      RETURNING id
    `;
    return result.rows[0].id;
  } catch (error) {
    console.error('[v0] Failed to save pipeline run:', error);
    throw error;
  }
}

/**
 * Get latest pipeline run
 */
export async function getLatestPipelineRun() {
  try {
    const result = await sql`
      SELECT * FROM pipeline_runs 
      ORDER BY start_time DESC 
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Failed to get pipeline run:', error);
    throw error;
  }
}
