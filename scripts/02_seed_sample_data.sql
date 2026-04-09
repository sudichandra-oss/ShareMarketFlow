-- Sample data for development and testing

-- Insert today's market indices
INSERT INTO market_indices (date, nifty50_value, nifty50_change, nifty50_change_pct, sensex_value, sensex_change, sensex_change_pct, nse_change_pct)
VALUES ('2026-04-09', 24187.45, -101.30, -0.42, 79842.15, -303.60, -0.38, -0.42)
ON CONFLICT (date) DO NOTHING;

-- Insert sample deals
INSERT INTO deals (date, company, sector, deal_type, fii_value, dii_value, net_value, sentiment, analysis)
VALUES 
  ('2026-04-09', 'TCS', 'IT', 'BUY', 125.50, -45.20, 80.30, 'POSITIVE', 'Strong institutional buying in IT sector'),
  ('2026-04-09', 'RELIANCE', 'ENERGY', 'SELL', -85.60, 120.40, 34.80, 'MIXED', 'FII selling but DII support continues'),
  ('2026-04-09', 'HDFC', 'FINANCE', 'BUY', 95.75, 60.25, 156.00, 'POSITIVE', 'Strong institutional interest in banking sector'),
  ('2026-04-09', 'INFY', 'IT', 'BUY', 110.30, 55.70, 166.00, 'POSITIVE', 'Consistent buying pressure on IT stocks'),
  ('2026-04-09', 'BAJAJ-AUTO', 'AUTO', 'SELL', -45.80, 25.60, -20.20, 'NEGATIVE', 'Profit booking in auto sector')
ON CONFLICT DO NOTHING;

-- Insert sample FII/DII analysis
INSERT INTO fii_dii_analysis (date, total_fii_inflow, total_dii_inflow, net_flow, fii_sentiment, dii_sentiment, analysis)
VALUES ('2026-04-09', 245.75, 216.95, 28.80, 'POSITIVE', 'POSITIVE', 'Both FII and DII showing positive sentiment. Net inflow indicates strong institutional confidence.')
ON CONFLICT (date) DO UPDATE SET
total_fii_inflow = EXCLUDED.total_fii_inflow,
total_dii_inflow = EXCLUDED.total_dii_inflow,
net_flow = EXCLUDED.net_flow,
fii_sentiment = EXCLUDED.fii_sentiment,
dii_sentiment = EXCLUDED.dii_sentiment,
analysis = EXCLUDED.analysis;

-- Insert sample insights
INSERT INTO insights (date, title, description, category, priority, actionable)
VALUES
  ('2026-04-09', 'IT Sector Momentum', 'IT sector showing strong institutional buying momentum with consistent inflows', 'SECTOR', 'HIGH', true),
  ('2026-04-09', 'Banking Sector Strength', 'Banking stocks attracting significant institutional interest', 'SECTOR', 'HIGH', true),
  ('2026-04-09', 'Profit Booking in Auto', 'Auto sector showing profit booking after recent gains', 'SECTOR', 'MEDIUM', false),
  ('2026-04-09', 'Bullish Market Sentiment', 'Overall positive institutional sentiment with net inflows across sectors', 'MARKET', 'HIGH', true)
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (date, title, description, alert_type, severity, is_active)
VALUES
  ('2026-04-09', 'Strong Buying in IT', 'Institutional investors showing strong buying interest in IT sector', 'BUY_SIGNAL', 'HIGH', true),
  ('2026-04-09', 'Auto Sector Weakness', 'Auto sector showing profit booking, possible consolidation phase', 'SELL_SIGNAL', 'MEDIUM', true),
  ('2026-04-09', 'Positive FII Sentiment', 'FII inflows remain positive indicating foreign investor confidence', 'INFORMATION', 'MEDIUM', true)
ON CONFLICT DO NOTHING;

-- Insert sample pipeline run
INSERT INTO pipeline_runs (start_time, end_time, status, message, deals_processed, alerts_generated, insights_generated)
VALUES 
  (NOW() - INTERVAL '1 hour', NOW(), 'SUCCESS', 'Pipeline executed successfully', 5, 3, 4)
ON CONFLICT DO NOTHING;
