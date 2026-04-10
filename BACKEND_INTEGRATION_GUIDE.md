# Python Backend Integration Guide

## Overview

The Python backend (FastAPI) now needs to send its results to the Next.js API routes for database persistence.

## Pipeline Completion Flow

When your agent pipeline completes, it should POST results to these endpoints:

### 1. Save Market Indices

```python
import requests
import json
from datetime import date

def save_market_data(nifty50_value, nifty50_change, nifty50_change_pct, 
                     sensex_value, sensex_change, sensex_change_pct):
    """Save daily market indices to database"""
    
    url = "http://localhost:3000/api/market"  # or your deployed URL
    
    payload = {
        "date": str(date.today()),
        "nifty50_value": nifty50_value,
        "nifty50_change": nifty50_change,
        "nifty50_change_pct": nifty50_change_pct,
        "sensex_value": sensex_value,
        "sensex_change": sensex_change,
        "sensex_change_pct": sensex_change_pct,
    }
    
    response = requests.post(url, json=payload)
    return response.json()
```

### 2. Save Deals

```python
def save_deals(pipeline_run_id, deals_list):
    """Save analyzed deals to database"""
    
    url = "http://localhost:3000/api/deals"
    
    for deal in deals_list:
        payload = {
            "pipeline_run_id": pipeline_run_id,
            "symbol": deal["symbol"],
            "company_name": deal["company_name"],
            "sector": deal["sector"],
            "deal_type": deal["deal_type"],  # BUY, SELL, HOLD
            "fii_volume": deal["fii_volume"],
            "dii_volume": deal["dii_volume"],
            "net_flow": deal["net_flow"],
            "price_impact": deal["price_impact"],
            "confidence_score": deal["confidence_score"],
            "analysis_json": deal.get("full_analysis", {}),
        }
        
        response = requests.post(url, json=payload)
        print(f"Saved deal: {deal['symbol']}")
```

### 3. Save Insights

```python
def save_insights(pipeline_run_id, insights_list):
    """Save AI-generated insights to database"""
    
    url = "http://localhost:3000/api/insights"
    
    for insight in insights_list:
        payload = {
            "pipeline_run_id": pipeline_run_id,
            "title": insight["title"],
            "description": insight["description"],
            "category": insight["category"],  # SECTOR_TREND, MARKET_SIGNAL, etc
            "severity": insight["severity"],  # high, medium, low
            "related_symbols": insight.get("related_symbols", []),
            "action_items": insight.get("action_items", []),
            "analysis_json": insight.get("full_analysis", {}),
        }
        
        response = requests.post(url, json=payload)
        print(f"Saved insight: {insight['title']}")
```

### 4. Save Alerts

```python
def save_alerts(pipeline_run_id, alerts_list):
    """Save triggered alerts to database"""
    
    url = "http://localhost:3000/api/alerts"
    
    for alert in alerts_list:
        payload = {
            "pipeline_run_id": pipeline_run_id,
            "symbol": alert["symbol"],
            "alert_type": alert["type"],  # LARGE_DEAL, STAKE_CHANGE, SECTOR_FLOW
            "message": alert["message"],
            "priority": alert["priority"],  # high, medium, low
            "threshold_breached": alert["threshold_name"],
            "current_value": alert["current_value"],
            "threshold_value": alert["threshold_value"],
            "recommended_action": alert.get("action", ""),
        }
        
        response = requests.post(url, json=payload)
        print(f"Saved alert: {alert['message']}")
```

## Complete Pipeline Integration Example

```python
# backend/api/routes/agents.py

import requests
import asyncio
from datetime import date
from fastapi import APIRouter

router = APIRouter()

API_BASE_URL = "http://localhost:3000"  # Change to your deployment URL

@router.post("/run")
async def trigger_pipeline(background_tasks: BackgroundTasks):
    """Trigger agent pipeline and save results to database"""
    
    background_tasks.add_task(_run_pipeline_and_save)
    return {"status": "started", "message": "Agent pipeline triggered"}


async def _run_pipeline_and_save():
    """Run pipeline and save results to database"""
    
    try:
        # 1. Run your agent pipeline
        from agents.pipeline import run_pipeline
        
        print("[Agent] Starting pipeline execution...")
        result = await asyncio.to_thread(run_pipeline)
        
        # 2. Save market indices
        print("[Agent] Saving market data...")
        market_response = requests.post(
            f"{API_BASE_URL}/api/market",
            json={
                "date": str(date.today()),
                "nifty50_value": result.get("nifty50_value", 24187.45),
                "nifty50_change": result.get("nifty50_change", -101.30),
                "nifty50_change_pct": result.get("nifty50_change_pct", -0.42),
                "sensex_value": result.get("sensex_value", 79842.15),
                "sensex_change": result.get("sensex_change", -303.60),
                "sensex_change_pct": result.get("sensex_change_pct", -0.38),
            }
        )
        
        # 3. Save deals
        if "deals" in result:
            print("[Agent] Saving deals...")
            for deal in result["deals"]:
                requests.post(f"{API_BASE_URL}/api/deals", json=deal)
        
        # 4. Save insights
        if "insights" in result:
            print("[Agent] Saving insights...")
            for insight in result["insights"]:
                requests.post(f"{API_BASE_URL}/api/insights", json=insight)
        
        # 5. Save alerts
        if "alerts" in result:
            print("[Agent] Saving alerts...")
            for alert in result["alerts"]:
                requests.post(f"{API_BASE_URL}/api/alerts", json=alert)
        
        print("[Agent] Pipeline completed and results saved!")
        
    except Exception as e:
        print(f"[Agent] Error: {str(e)}")
```

## Expected Result Format from Agent

Your `run_pipeline()` should return a dictionary like:

```python
{
    "status": "completed",
    "timestamp": "2025-04-07T16:30:00Z",
    
    # Market data
    "nifty50_value": 24187.45,
    "nifty50_change": -101.30,
    "nifty50_change_pct": -0.42,
    "sensex_value": 79842.15,
    "sensex_change": -303.60,
    "sensex_change_pct": -0.38,
    
    # Deals analyzed
    "deals": [
        {
            "symbol": "HDFC",
            "company_name": "HDFC Bank",
            "sector": "Banking",
            "deal_type": "BUY",
            "fii_volume": 2500,
            "dii_volume": 1800,
            "net_flow": 700,
            "price_impact": 0.45,
            "confidence_score": 85.5,
            "full_analysis": { /* detailed analysis */ }
        },
        # ... more deals
    ],
    
    # AI insights
    "insights": [
        {
            "title": "Banking Sector Rally Expected",
            "description": "GIC and BlackRock led bulk deals...",
            "category": "SECTOR_TREND",
            "severity": "high",
            "related_symbols": ["HDFC", "ICICI", "AXIS"],
            "action_items": ["Monitor for follow-up deals", "Watch NIM expansion"],
            "full_analysis": { /* deep analysis */ }
        },
        # ... more insights
    ],
    
    # Alerts triggered
    "alerts": [
        {
            "symbol": "HDFC",
            "type": "LARGE_DEAL",
            "message": "GIC Private Limited bought HDFC Bank at premium",
            "priority": "high",
            "threshold_name": "bulk_deal_threshold",
            "current_value": 2500,
            "threshold_value": 1000,
            "action": "Monitor for sector leadership"
        },
        # ... more alerts
    ],
}
```

## Database Schema Reference

When saving to API, use these field names:

### Deals Table
```
symbol, company_name, sector, deal_type (BUY/SELL/HOLD)
fii_volume, dii_volume, net_flow, price_impact, confidence_score
analysis_json (for detailed breakdown)
```

### Insights Table
```
title, description, category, severity (high/medium/low)
related_symbols (JSON array), action_items (JSON array)
analysis_json
```

### Alerts Table
```
symbol, alert_type (LARGE_DEAL/STAKE_CHANGE/SECTOR_FLOW)
message, priority (high/medium/low)
threshold_breached, current_value, threshold_value
recommended_action
```

### Market Indices Table
```
date, nifty50_value, nifty50_change, nifty50_change_pct
sensex_value, sensex_change, sensex_change_pct
```

## Error Handling

```python
import requests
from requests.exceptions import RequestException

def safe_save_to_api(endpoint, data, retries=3):
    """Save data with retry logic"""
    
    for attempt in range(retries):
        try:
            response = requests.post(
                f"{API_BASE_URL}{endpoint}",
                json=data,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt < retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
    
    print(f"Failed to save to {endpoint} after {retries} attempts")
    return None
```

## Testing the Integration

### 1. Check API Routes are Working
```bash
# Get market data
curl http://localhost:3000/api/market

# Get deals
curl http://localhost:3000/api/deals

# Get insights
curl http://localhost:3000/api/insights

# Get alerts
curl http://localhost:3000/api/alerts
```

### 2. Test Posting Data
```bash
curl -X POST http://localhost:3000/api/market \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-04-07",
    "nifty50_value": 24187.45,
    "nifty50_change": -101.30,
    "nifty50_change_pct": -0.42,
    "sensex_value": 79842.15,
    "sensex_change": -303.60,
    "sensex_change_pct": -0.38
  }'
```

### 3. Monitor Database
After agent runs:
```bash
# Check if data was saved
curl http://localhost:3000/api/market
curl http://localhost:3000/api/deals?date=2025-04-07
```

## Deployment

When deploying to production:

1. Update `API_BASE_URL` in your backend:
   ```python
   API_BASE_URL = "https://your-domain.com"
   ```

2. Ensure CORS is not blocking requests between backend and frontend

3. Verify Neon database connection is working in production

## Summary

Your pipeline now has a complete data pipeline:

```
Python Agent → Analyzes Market Data
                    ↓
           Creates Deals, Insights, Alerts
                    ↓
           POST Results to Next.js API
                    ↓
           Data Stored in Neon PostgreSQL
                    ↓
           Frontend Fetches and Displays
```

---

**Next Step:** Update your `backend/agents/pipeline.py` to call these endpoints after completion.
