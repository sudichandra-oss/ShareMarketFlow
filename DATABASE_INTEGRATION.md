# Database Integration Guide

## Overview

ShareMarketFlow now uses Neon PostgreSQL to persist all agent-generated data. Instead of displaying mock data, the application:

1. **Fetches live data** from the cloud database via Next.js API routes
2. **Stores agent results** automatically when pipelines complete
3. **Updates all pages** with real data from database

## Database Schema

The following tables store all agent output:

### `market_indices`
Stores daily NIFTY 50 and SENSEX indices
- `date` - Date of the market data
- `nifty50_value`, `nifty50_change`, `nifty50_change_pct`
- `sensex_value`, `sensex_change`, `sensex_change_pct`

### `deals`
Individual stock deals analyzed by the agent
- `pipeline_run_id` - Reference to agent pipeline run
- `symbol`, `company_name`, `sector`, `deal_type`
- `fii_volume`, `dii_volume`, `net_flow`, `price_impact`, `confidence_score`

### `fii_dii_analysis`
Sector-wise FII/DII institutional flow analysis
- `sector` - Sector name
- `fii_inflow`, `fii_outflow`, `dii_inflow`, `dii_outflow`
- `net_institutional_flow`, `trend`

### `insights`
AI-generated market insights and observations
- `title`, `description`, `category`, `severity`
- `related_symbols` (array), `action_items` (array)

### `alerts`
Real-time alerts triggered by data conditions
- `symbol`, `alert_type`, `message`, `priority`
- `threshold_breached`, `current_value`, `threshold_value`

### `pipeline_runs`
Tracks each agent pipeline execution
- `status` - 'running', 'completed', 'failed'
- `result_json` - Stores final results

## API Routes

All data flows through these REST endpoints:

### GET `/api/market`
Fetches latest market indices

### POST `/api/market`
Saves market indices data

### GET `/api/deals?date=YYYY-MM-DD`
Fetches deals for a specific date

### POST `/api/deals`
Saves a single deal

### GET `/api/insights`
Fetches today's insights

### POST `/api/insights`
Saves an insight

### GET `/api/alerts`
Fetches today's active alerts

### POST `/api/alerts`
Saves an alert

## Setup Instructions

### 1. Execute Database Schema
```bash
# Already done during initial setup
# Creates all tables and indexes
```

### 2. Seed Initial Data
```bash
npx tsx scripts/02_seed_data.ts
```
This populates the database with sample data so you can test the application.

### 3. Environment Variables
Your Neon database is automatically connected via `@neondatabase/serverless`. No additional configuration needed.

## How Agent Results Are Stored

When the agent pipeline completes:

1. **Creates pipeline run** - Records execution metadata
2. **Saves market indices** - Latest NIFTY 50, SENSEX data
3. **Saves deals** - Individual stock analysis results
4. **Saves FII/DII analysis** - Sector-wise institutional flows
5. **Saves insights** - AI-generated market observations
6. **Saves alerts** - Critical thresholds breached

All timestamps are in IST (UTC+5:30).

## Data Flow

```
Agent Pipeline (Python Backend)
        ↓
    Completes execution
        ↓
    Sends results to API
        ↓
    POST /api/market, /api/deals, /api/insights, /api/alerts
        ↓
    Neon PostgreSQL Database
        ↓
    Frontend pages fetch via GET endpoints
        ↓
    Display real-time data to users
```

## Fetching Data in Components

Use the provided hooks:

```typescript
import { useMarketData } from '@/hooks/useMarketData';
import { useInsights } from '@/hooks/useInsights';
import { useDeals } from '@/hooks/useDeals';

export function MyComponent() {
  const { data: marketData } = useMarketData();
  const { insights } = useInsights();
  const { deals } = useDeals();

  // Use data in your component
}
```

## Real-time Updates

- **Market data** - Refreshes every 5 minutes
- **Insights** - Refreshes every 10 minutes  
- **Deals** - Refreshes every 5 minutes
- **Alerts** - Refreshes every 2 minutes

Manual refresh available via `refetch()` returned from hooks.

## Integration with Agent Pipeline

The agent pipeline (Python backend) must:

1. Create a pipeline run: `POST /api/backend/pipeline/run`
2. After completion, POST results:
   - `POST /api/market` - Market data
   - `POST /api/deals` - Deal results
   - `POST /api/insights` - Generated insights
   - `POST /api/alerts` - Triggered alerts

## Troubleshooting

### No data appearing?
1. Check if database migration ran: `scripts/01_init_schema.sql`
2. Verify Neon integration is connected
3. Seed database: `npx tsx scripts/02_seed_data.ts`
4. Check browser console for API errors

### Data is stale?
- Manually trigger refetch using component hook
- Check agent pipeline is completing successfully
- Verify API endpoints are returning data

### Queries failing?
- Check Neon dashboard for database status
- Verify SQL syntax in `src/lib/db.ts`
- Check environment variables are set

---

**Last Updated:** April 2025  
**Status:** ✅ Production Ready
