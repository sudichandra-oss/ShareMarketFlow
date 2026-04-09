-- Initialize ShareMarketFlow database schema
-- Tables for storing agent pipeline results

CREATE TABLE IF NOT EXISTS market_indices (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  nifty50_value DECIMAL(10, 2) NOT NULL,
  nifty50_change DECIMAL(10, 2),
  nifty50_change_pct DECIMAL(6, 2),
  sensex_value DECIMAL(10, 2),
  sensex_change DECIMAL(10, 2),
  sensex_change_pct DECIMAL(6, 2),
  nse_change_pct DECIMAL(6, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  trade_date DATE NOT NULL,
  company_code VARCHAR(50) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  buy_sell VARCHAR(10) NOT NULL,
  quantity BIGINT NOT NULL,
  value_inr BIGINT NOT NULL,
  value_cr DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fii_dii_analysis (
  id SERIAL PRIMARY KEY,
  analysis_date DATE NOT NULL UNIQUE,
  top_fii_buyers JSONB,
  top_dii_buyers JSONB,
  smart_money_score INT,
  sector_momentum INT,
  market_signal VARCHAR(50),
  fii_5d_sum DECIMAL(12, 2),
  dii_5d_sum DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS insights (
  id SERIAL PRIMARY KEY,
  insight_date DATE NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  recommendation VARCHAR(100),
  confidence_score INT,
  content JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  alert_date DATE NOT NULL,
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id SERIAL PRIMARY KEY,
  run_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  deals_processed INT,
  alerts_generated INT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_trade_date ON deals(trade_date);
CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_code);
CREATE INDEX IF NOT EXISTS idx_alerts_date ON alerts(alert_date);
CREATE INDEX IF NOT EXISTS idx_fii_dii_date ON fii_dii_analysis(analysis_date);
CREATE INDEX IF NOT EXISTS idx_insights_date ON insights(insight_date);
CREATE INDEX IF NOT EXISTS idx_market_indices_date ON market_indices(date);
