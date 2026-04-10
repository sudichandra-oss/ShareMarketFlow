# Quick Reference - Database Integration

## What Changed?

### Before
❌ All data was **mock data** (hardcoded in `mockData.ts`)  
❌ No data persistence  
❌ Agent results weren't saved  

### After
✅ All data from **Neon PostgreSQL**  
✅ Complete data persistence  
✅ Agent results automatically saved  

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Database operations |
| `src/app/api/market/route.ts` | Market data API |
| `src/app/api/deals/route.ts` | Deals API |
| `src/app/api/insights/route.ts` | Insights API |
| `src/app/api/alerts/route.ts` | Alerts API |
| `src/hooks/useMarketData.ts` | React hook for market data |
| `src/hooks/useInsights.ts` | React hook for insights |
| `src/hooks/useDeals.ts` | React hook for deals |

## How to Use

### Fetch Data in Components

```typescript
import { useMarketData } from '@/hooks/useMarketData';

export function MyComponent() {
  const { data: market } = useMarketData();
  
  return <div>NIFTY: {market?.nifty50_value}</div>;
}
```

### Manually Call APIs

```typescript
// Fetch market data
const market = await fetch('/api/market').then(r => r.json());

// Save a deal
await fetch('/api/deals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    symbol: 'TCS', 
    company_name: 'Tata Consultancy Services',
    // ... other fields
  })
});
```

## Agent Integration

### When Agent Completes:

```python
# 1. Save market data
requests.post('http://localhost:3000/api/market', json={...})

# 2. Save deals
for deal in deals:
    requests.post('http://localhost:3000/api/deals', json=deal)

# 3. Save insights
for insight in insights:
    requests.post('http://localhost:3000/api/insights', json=insight)

# 4. Save alerts
for alert in alerts:
    requests.post('http://localhost:3000/api/alerts', json=alert)
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/market` | GET | Fetch latest market indices |
| `/api/market` | POST | Save market indices |
| `/api/deals` | GET | Fetch deals for a date |
| `/api/deals` | POST | Save a deal |
| `/api/insights` | GET | Fetch today's insights |
| `/api/insights` | POST | Save an insight |
| `/api/alerts` | GET | Fetch today's alerts |
| `/api/alerts` | POST | Save an alert |

## Database Tables

```
market_indices      → Daily NIFTY 50, SENSEX data
deals               → Stock deals analyzed
fii_dii_analysis    → Sector-wise flows
insights            → AI-generated insights
alerts              → Triggered alerts
pipeline_runs       → Agent execution tracking
```

## Quick Test

```bash
# Check if data is in database
curl http://localhost:3000/api/market

# Should return something like:
# {
#   "date": "2025-04-07",
#   "nifty50_value": 24187.45,
#   "nifty50_change_pct": -0.42,
#   ...
# }
```

## Refresh Intervals

- Market data: Every 5 minutes
- Insights: Every 10 minutes
- Deals: Every 5 minutes
- Alerts: Every 2 minutes

## To Seed Sample Data

```bash
npx tsx scripts/02_seed_data.ts
```

## To Update Market Data from Agent

The agent should send this data:

```json
{
  "date": "2025-04-07",
  "nifty50_value": 24187.45,
  "nifty50_change": -101.30,
  "nifty50_change_pct": -0.42,
  "sensex_value": 79842.15,
  "sensex_change": -303.60,
  "sensex_change_pct": -0.38
}
```

## Common Tasks

### Display NIFTY 50 in Header
```typescript
const { data: market } = useMarketData();
<span>{market?.nifty50_value.toFixed(2)}</span>
```

### Show Today's Alerts
```typescript
const { alerts } = useAlerts();
{alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
```

### Save Deal from Backend
```python
requests.post('http://localhost:3000/api/deals', json={
    'pipeline_run_id': run_id,
    'symbol': 'HDFC',
    'company_name': 'HDFC Bank',
    'sector': 'Banking',
    'deal_type': 'BUY',
    'fii_volume': 2500,
    'dii_volume': 1800,
    'net_flow': 700,
    'price_impact': 0.45,
    'confidence_score': 85.5
})
```

## Troubleshooting

**No data showing?**
- Check database migration ran: `scripts/01_init_schema.sql` ✅
- Seed data: `npx tsx scripts/02_seed_data.ts`
- Check API endpoint: `curl http://localhost:3000/api/market`

**Data is old?**
- Agent hasn't run yet, or
- Agent isn't posting to API endpoints, or
- Check backend integration (see `BACKEND_INTEGRATION_GUIDE.md`)

**Errors in console?**
- Check if API routes exist: `src/app/api/market/route.ts` etc
- Verify Neon database is connected
- Check browser network tab for API errors

## Files to Read

1. **For Backend Integration:** `BACKEND_INTEGRATION_GUIDE.md`
2. **For Full Details:** `DATABASE_INTEGRATION.md`
3. **For Setup:** `DATABASE_SETUP_SUMMARY.md`

---

**Status:** ✅ Production Ready  
**Database:** Neon PostgreSQL  
**Framework:** Next.js + TypeScript  
**Last Updated:** April 2025
