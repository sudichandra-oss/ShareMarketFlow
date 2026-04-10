import { Pool } from '@neondatabase/serverless';

// Initialize database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO market_indices 
      (date, nifty50_value, nifty50_change, nifty50_change_pct, sensex_value, sensex_change, sensex_change_pct, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (date) DO UPDATE SET
        nifty50_value = $2,
        nifty50_change = $3,
        nifty50_change_pct = $4,
        sensex_value = $5,
        sensex_change = $6,
        sensex_change_pct = $7,
        updated_at = NOW()
      RETURNING *`,
      [
        data.date,
        data.nifty50_value,
        data.nifty50_change,
        data.nifty50_change_pct,
        data.sensex_value,
        data.sensex_change,
        data.sensex_change_pct,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error saving market indices:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get latest market indices
 */
export async function getLatestMarketIndices() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM market_indices ORDER BY date DESC LIMIT 1'
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Error fetching market indices:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save deal data to database
 */
export async function saveDeal(data: {
  pipeline_run_id: string;
  symbol: string;
  company_name: string;
  sector: string;
  deal_type: string;
  fii_volume: number;
  dii_volume: number;
  net_flow: number;
  price_impact: number;
  confidence_score: number;
  analysis_json: any;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO deals 
      (pipeline_run_id, symbol, company_name, sector, deal_type, fii_volume, dii_volume, net_flow, price_impact, confidence_score, analysis_json, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *`,
      [
        data.pipeline_run_id,
        data.symbol,
        data.company_name,
        data.sector,
        data.deal_type,
        data.fii_volume,
        data.dii_volume,
        data.net_flow,
        data.price_impact,
        data.confidence_score,
        JSON.stringify(data.analysis_json),
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error saving deal:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get deals for a specific date
 */
export async function getDealsByDate(date: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT d.* FROM deals d
       JOIN pipeline_runs pr ON d.pipeline_run_id = pr.id
       WHERE DATE(pr.created_at) = $1
       ORDER BY d.confidence_score DESC`,
      [date]
    );
    return result.rows;
  } catch (error) {
    console.error('[v0] Error fetching deals:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save FII/DII analysis
 */
export async function saveFiiDiiAnalysis(data: {
  pipeline_run_id: string;
  sector: string;
  fii_inflow: number;
  fii_outflow: number;
  dii_inflow: number;
  dii_outflow: number;
  net_institutional_flow: number;
  trend: string;
  analysis_json: any;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO fii_dii_analysis 
      (pipeline_run_id, sector, fii_inflow, fii_outflow, dii_inflow, dii_outflow, net_institutional_flow, trend, analysis_json, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *`,
      [
        data.pipeline_run_id,
        data.sector,
        data.fii_inflow,
        data.fii_outflow,
        data.dii_inflow,
        data.dii_outflow,
        data.net_institutional_flow,
        data.trend,
        JSON.stringify(data.analysis_json),
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error saving FII/DII analysis:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get FII/DII analysis for today
 */
export async function getTodayFiiDiiAnalysis() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM fii_dii_analysis
       WHERE DATE(created_at) = CURRENT_DATE
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('[v0] Error fetching FII/DII analysis:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save insight
 */
export async function saveInsight(data: {
  pipeline_run_id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  related_symbols: string[];
  action_items: string[];
  analysis_json: any;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO insights 
      (pipeline_run_id, title, description, category, severity, related_symbols, action_items, analysis_json, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        data.pipeline_run_id,
        data.title,
        data.description,
        data.category,
        data.severity,
        JSON.stringify(data.related_symbols),
        JSON.stringify(data.action_items),
        JSON.stringify(data.analysis_json),
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error saving insight:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get insights for today
 */
export async function getTodayInsights() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM insights
       WHERE DATE(created_at) = CURRENT_DATE
       ORDER BY CASE severity WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
                created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('[v0] Error fetching insights:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save alert
 */
export async function saveAlert(data: {
  pipeline_run_id: string;
  symbol: string;
  alert_type: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  threshold_breached: string;
  current_value: number;
  threshold_value: number;
  recommended_action: string;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO alerts 
      (pipeline_run_id, symbol, alert_type, message, priority, threshold_breached, current_value, threshold_value, recommended_action, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *`,
      [
        data.pipeline_run_id,
        data.symbol,
        data.alert_type,
        data.message,
        data.priority,
        data.threshold_breached,
        data.current_value,
        data.threshold_value,
        data.recommended_action,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error saving alert:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get active alerts for today
 */
export async function getTodayAlerts() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM alerts
       WHERE DATE(created_at) = CURRENT_DATE
       AND is_read = false
       ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
                created_at DESC
       LIMIT 50`
    );
    return result.rows;
  } catch (error) {
    console.error('[v0] Error fetching alerts:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Create a new pipeline run
 */
export async function createPipelineRun(status: 'running' | 'completed' | 'failed') {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO pipeline_runs (status, created_at) VALUES ($1, NOW()) RETURNING id',
      [status]
    );
    return result.rows[0]?.id;
  } catch (error) {
    console.error('[v0] Error creating pipeline run:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Update pipeline run status
 */
export async function updatePipelineRunStatus(id: string, status: 'running' | 'completed' | 'failed', result?: any) {
  const client = await pool.connect();
  try {
    const query = result
      ? `UPDATE pipeline_runs 
         SET status = $1, result_json = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`
      : `UPDATE pipeline_runs 
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`;
    
    const params = result ? [status, JSON.stringify(result), id] : [status, id];
    return await client.query(query, params);
  } catch (error) {
    console.error('[v0] Error updating pipeline run:', error);
    throw error;
  } finally {
    client.release();
  }
}
