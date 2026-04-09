// Central mock data for all pages — mimics what the FastAPI backend returns

export const MOCK_FLOWS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const fiiNet = (Math.random() - 0.45) * 4000;
  const diiNet = (Math.random() - 0.42) * 3000;
  return {
    date: date.toISOString().split('T')[0],
    fii_buy: Math.abs(fiiNet) + Math.random() * 2000 + 1000,
    fii_sell: Math.abs(fiiNet) + Math.random() * 2000 + 500,
    fii_net: fiiNet,
    dii_buy: Math.abs(diiNet) + Math.random() * 2000 + 800,
    dii_sell: Math.abs(diiNet) + Math.random() * 1500 + 400,
    dii_net: diiNet,
  };
});

export const MOCK_TOP_FII = [
  { name: 'GIC Private Limited', country: 'Singapore', aum_cr: 182400, change_cr: 3240, change_pct: 1.81, sectors: ['Banking', 'IT', 'Telecom'], holdings_count: 47, trend: 'BUY' },
  { name: 'Vanguard Group', country: 'USA', aum_cr: 143200, change_cr: -1890, change_pct: -1.30, sectors: ['IT', 'FMCG', 'Pharma'], holdings_count: 63, trend: 'SELL' },
  { name: 'BlackRock Inc.', country: 'USA', aum_cr: 136800, change_cr: 4120, change_pct: 3.10, sectors: ['Banking', 'Auto', 'Infra'], holdings_count: 58, trend: 'BUY' },
  { name: 'Norges Bank', country: 'Norway', aum_cr: 98700, change_cr: 2100, change_pct: 2.17, sectors: ['Energy', 'Banking'], holdings_count: 29, trend: 'BUY' },
  { name: 'Temasek Holdings', country: 'Singapore', aum_cr: 87300, change_cr: -640, change_pct: -0.73, sectors: ['Telecom', 'Pharma'], holdings_count: 18, trend: 'HOLD' },
  { name: 'CPPIB', country: 'Canada', aum_cr: 76500, change_cr: 1890, change_pct: 2.53, sectors: ['Infra', 'Realty'], holdings_count: 22, trend: 'BUY' },
  { name: 'Fidelity Investments', country: 'USA', aum_cr: 64200, change_cr: -2310, change_pct: -3.47, sectors: ['IT', 'Midcap'], holdings_count: 71, trend: 'SELL' },
  { name: 'Schroders PLC', country: 'UK', aum_cr: 52100, change_cr: 780, change_pct: 1.52, sectors: ['FMCG', 'Pharma'], holdings_count: 34, trend: 'BUY' },
  { name: 'Franklin Templeton', country: 'USA', aum_cr: 41800, change_cr: -490, change_pct: -1.16, sectors: ['Metals', 'Energy'], holdings_count: 27, trend: 'HOLD' },
  { name: 'Aberdeen Investments', country: 'UK', aum_cr: 33200, change_cr: 310, change_pct: 0.94, sectors: ['Smallcap', 'Agri'], holdings_count: 19, trend: 'BUY' },
];

export const MOCK_TOP_DII = [
  { name: 'SBI Mutual Fund', type: 'MF', aum_cr: 924000, change_cr: 8430, change_pct: 0.92, top_picks: ['SBI', 'HDFC Bank', 'Infosys'], trend: 'BUY' },
  { name: 'HDFC Mutual Fund', type: 'MF', aum_cr: 712000, change_cr: 6210, change_pct: 0.88, top_picks: ['HDFC Bank', 'RIL', 'TCS'], trend: 'BUY' },
  { name: 'Nippon India MF', type: 'MF', aum_cr: 489000, change_cr: 3120, change_pct: 0.64, top_picks: ['ITC', 'L&T', 'ICICI Bank'], trend: 'BUY' },
  { name: 'LIC', type: 'Insurance', aum_cr: 1820000, change_cr: 12400, change_pct: 0.69, top_picks: ['Nifty PSU Cos'], trend: 'BUY' },
  { name: 'ICICI Prudential MF', type: 'MF', aum_cr: 398000, change_cr: -1840, change_pct: -0.46, top_picks: ['Banking', 'Auto'], trend: 'SELL' },
  { name: 'Kotak Mahindra MF', type: 'MF', aum_cr: 324000, change_cr: 2870, change_pct: 0.89, top_picks: ['Midcap IT', 'Pharma'], trend: 'BUY' },
  { name: 'Axis Mutual Fund', type: 'MF', aum_cr: 278000, change_cr: -920, change_pct: -0.33, top_picks: ['Chemicals'], trend: 'HOLD' },
  { name: 'GIC Re', type: 'Insurance', aum_cr: 94000, change_cr: 1230, change_pct: 1.32, top_picks: ['PSU Banks', 'PPc'], trend: 'BUY' },
];

export const MOCK_SECTORS = [
  { name: 'Banking & Finance', fii_flow: 3240, dii_flow: 5610, total_flow: 8850, momentum: 82, weight_pct: 28.4, change_pct: 1.8 },
  { name: 'Information Technology', fii_flow: -1240, dii_flow: 2100, total_flow: 860, momentum: 54, weight_pct: 15.2, change_pct: 0.3 },
  { name: 'Oil & Gas', fii_flow: 890, dii_flow: 1230, total_flow: 2120, momentum: 67, weight_pct: 11.8, change_pct: 1.1 },
  { name: 'FMCG', fii_flow: -340, dii_flow: 890, total_flow: 550, momentum: 48, weight_pct: 9.4, change_pct: 0.2 },
  { name: 'Automobile', fii_flow: 1120, dii_flow: 1870, total_flow: 2990, momentum: 74, weight_pct: 6.8, change_pct: 1.6 },
  { name: 'Pharmaceuticals', fii_flow: 2100, dii_flow: 980, total_flow: 3080, momentum: 79, weight_pct: 5.9, change_pct: 2.4 },
  { name: 'Metals & Mining', fii_flow: -870, dii_flow: 640, total_flow: -230, momentum: 32, weight_pct: 4.3, change_pct: -0.4 },
  { name: 'Infrastructure', fii_flow: 1890, dii_flow: 3240, total_flow: 5130, momentum: 88, weight_pct: 4.1, change_pct: 3.2 },
  { name: 'Telecom', fii_flow: 2340, dii_flow: 870, total_flow: 3210, momentum: 76, weight_pct: 3.8, change_pct: 2.1 },
  { name: 'Real Estate', fii_flow: 780, dii_flow: 1200, total_flow: 1980, momentum: 65, weight_pct: 2.4, change_pct: 1.4 },
  { name: 'Chemicals', fii_flow: -230, dii_flow: 430, total_flow: 200, momentum: 41, weight_pct: 2.1, change_pct: 0.1 },
  { name: 'Power & Utilities', fii_flow: 1100, dii_flow: 2100, total_flow: 3200, momentum: 80, weight_pct: 2.0, change_pct: 2.3 },
];

export const MOCK_BULK_DEALS = [
  { date: '2025-04-07', symbol: 'HDFCBANK', company: 'HDFC Bank Ltd', client: 'GIC Private Limited', side: 'BUY', qty: 14200000, price: 1842.50, value_cr: 2616.35, exchange: 'NSE' },
  { date: '2025-04-07', symbol: 'RELIANCE', company: 'Reliance Industries', client: 'BlackRock Inc.', side: 'BUY', qty: 3800000, price: 2941.00, value_cr: 1117.58, exchange: 'BSE' },
  { date: '2025-04-07', symbol: 'TCS', company: 'Tata Consultancy', client: 'Vanguard Group', side: 'SELL', qty: 2100000, price: 4128.00, value_cr: 866.88, exchange: 'NSE' },
  { date: '2025-04-07', symbol: 'INFY', company: 'Infosys Ltd', client: 'Norges Bank', side: 'BUY', qty: 5400000, price: 1624.00, value_cr: 876.96, exchange: 'NSE' },
  { date: '2025-04-07', symbol: 'ICICIBANK', company: 'ICICI Bank Ltd', client: 'SBI Mutual Fund', side: 'BUY', qty: 8200000, price: 1248.50, value_cr: 1023.77, exchange: 'BSE' },
  { date: '2025-04-06', symbol: 'BHARTIARTL', company: 'Bharti Airtel', client: 'Temasek Holdings', side: 'BUY', qty: 4100000, price: 1876.00, value_cr: 769.16, exchange: 'NSE' },
  { date: '2025-04-06', symbol: 'SUNPHARMA', company: 'Sun Pharma', client: 'Fidelity Investments', side: 'SELL', qty: 1900000, price: 1782.00, value_cr: 338.58, exchange: 'BSE' },
  { date: '2025-04-06', symbol: 'LT', company: 'Larsen & Toubro', client: 'LIC', side: 'BUY', qty: 2800000, price: 3412.00, value_cr: 955.36, exchange: 'NSE' },
];

export const MOCK_INSIGHTS = {
  date: '2025-04-07',
  title: 'Smart Money Report — April 7, 2025',
  summary: 'FIIs turned net buyers after 3 sessions of selling, pumping ₹2,847 Cr into Banking and Telecom. DIIs maintained aggressive accumulation in PSU and Infrastructure plays. Institutional breadth at 68% — historically bullish for Nifty50.',
  key_points: [
    { icon: '🏦', text: 'FIIs net bought ₹2,847 Cr — first positive session in 4 days, led by GIC and BlackRock in HDFC Bank and Reliance.' },
    { icon: '📡', text: 'Telecom sector saw record FII inflow of ₹2,340 Cr. Bharti Airtel block deal worth ₹769 Cr signals 5G thesis builds.' },
    { icon: '🏗️', text: 'Infrastructure top DII pick for 3rd consecutive week. LIC added 28 lakh shares of L&T at ₹3,412.' },
    { icon: '💊', text: 'Pharma FII inflow ₹2,100 Cr — Sun Pharma, Dr. Reddy\'s benefiting from USD strength and US generic approvals.' },
    { icon: '⚠️', text: 'IT sector saw FII outflow of ₹1,240 Cr. Q4 guidance concerns persist. TCS, Infosys near-term headwinds.' },
    { icon: '🟢', text: 'Smart Money Score upgraded to 74/100 from 61 — strong buy signal per historical back-test patterns.' },
  ],
  full_report: `## Executive Summary
Today marked a pivotal reversal in FII sentiment. After three consecutive sessions of outflows totaling ₹8,200 Cr, foreign institutions turned net buyers with ₹2,847 Cr of purchases. The shift was broad-based across Banking, Telecom, and Pharma sectors.

## Key Themes

### 🏦 Banking Thesis Intact
GIC Private Limited and BlackRock led bulk deal purchases in HDFC Bank and ICICI Bank. Both stocks have corrected 8-12% from 52-week highs, creating attractive entry points for long-term buyers. NIM expansion expectations for Q1FY26 are supportive.

### 📡 Telecom — 5G Monetization Play
Temasek's block deal in Bharti Airtel at a premium signals strong conviction in 5G ARPU growth. Reliance Jio's upcoming IPO news may be a catalyst driving FII positioning in the space.

### 🏗️ Infrastructure — DII Conviction Buy
LIC continues to be the dominant buyer in infrastructure names (L&T, NTPC, Power Grid). PSU infrastructure firms trading at 40% discount to private peers. Budget spending cycle supportive.

### ⚠️ IT Under Pressure  
Vanguard and Fidelity both reduced IT exposure today. US tech spending slowdown and AI disruption narratives weigh on outsourcing revenue visibility. Wait for Q4 results before re-entry.

## FII/DII Flow Summary
| Type | Gross Buy | Gross Sell | Net |
|------|-----------|------------|-----|
| FII  | ₹12,840 Cr | ₹9,993 Cr | **+₹2,847 Cr** |
| DII  | ₹8,100 Cr  | ₹4,230 Cr | **+₹3,870 Cr** |

## Outlook
If FII buying sustains above ₹2,000 Cr for 3 sessions, Nifty could test 24,200. Watch Banking sector for leadership. Key risk: US CPI data due Thursday.`,
  smart_money_score: 74,
  sector_momentum: 67,
  institutional_confidence: 68,
};

export const MOCK_ALERTS = [
  { id: 1, type: 'LARGE_DEAL', severity: 'HIGH', institution: 'GIC Private Limited', company: 'HDFC Bank', value_cr: 2616, description: 'GIC bought 1.42 Cr shares of HDFC Bank worth ₹2,616 Cr in bulk deal', time: '15:58', is_read: false },
  { id: 2, type: 'STAKE_CHANGE', severity: 'HIGH', institution: 'BlackRock Inc.', company: 'Reliance Industries', value_cr: 1117, description: 'BlackRock increased stake from 1.2% to 1.8% — ₹1,117 Cr block deal', time: '15:45', is_read: false },
  { id: 3, type: 'SECTOR_FLOW', severity: 'MEDIUM', institution: 'Multiple FIIs', company: 'Telecom Sector', value_cr: 2340, description: 'Telecom sector FII inflow crossed ₹2,340 Cr — highest in 6 months', time: '15:30', is_read: false },
  { id: 4, type: 'LARGE_DEAL', severity: 'HIGH', institution: 'LIC', company: 'Larsen & Toubro', value_cr: 955, description: 'LIC bought 28L shares of L&T worth ₹955 Cr — sustained accumulation', time: '14:22', is_read: true },
  { id: 5, type: 'NEW_ENTRY', severity: 'MEDIUM', institution: 'Norges Bank', company: 'Infosys Ltd', value_cr: 877, description: 'Norges Bank new entry in Infosys — 54L shares at ₹1,624', time: '13:10', is_read: true },
  { id: 6, type: 'STAKE_CHANGE', severity: 'LOW', institution: 'Vanguard Group', company: 'TCS', value_cr: 867, description: 'Vanguard trimmed TCS position by 0.3% — ₹867 Cr block sale', time: '11:42', is_read: true },
];

export const MOCK_COMPANIES = [
  { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', price: 1842.50, change_pct: 2.14, fii_pct: 48.2, dii_pct: 18.4, promoter_pct: 0, public_pct: 33.4, smart_score: 82 },
  { ticker: 'RELIANCE', name: 'Reliance Industries', sector: 'Oil & Gas', price: 2941.00, change_pct: 0.87, fii_pct: 24.8, dii_pct: 22.1, promoter_pct: 50.3, public_pct: 2.8, smart_score: 76 },
  { ticker: 'TCS', name: 'Tata Consultancy', sector: 'IT', price: 4128.00, change_pct: -1.23, fii_pct: 17.2, dii_pct: 12.4, promoter_pct: 72.3, public_pct: -1.9, smart_score: 48 },
  { ticker: 'INFY', name: 'Infosys Ltd', sector: 'IT', price: 1624.00, change_pct: 0.56, fii_pct: 34.1, dii_pct: 14.8, promoter_pct: 14.9, public_pct: 36.2, smart_score: 61 },
  { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', price: 1248.50, change_pct: 1.89, fii_pct: 46.3, dii_pct: 16.2, promoter_pct: 0, public_pct: 37.5, smart_score: 79 },
  { ticker: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', price: 1876.00, change_pct: 3.41, fii_pct: 35.8, dii_pct: 12.4, promoter_pct: 55.9, public_pct: -4.1, smart_score: 85 },
  { ticker: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Pharma', price: 1782.00, change_pct: 2.78, fii_pct: 18.9, dii_pct: 20.3, promoter_pct: 54.7, public_pct: 6.1, smart_score: 72 },
  { ticker: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', price: 3412.00, change_pct: 1.54, fii_pct: 22.4, dii_pct: 28.9, promoter_pct: 0, public_pct: 48.7, smart_score: 88 },
];
