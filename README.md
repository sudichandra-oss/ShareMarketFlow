# ShareMarketFlow ⚡

> Bloomberg-style AI-powered FII/DII institutional investor tracking platform for Indian markets.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=next.js&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-8B5CF6?style=flat)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

## 🎯 Overview

ShareMarketFlow automatically tracks where institutional money is flowing in Indian markets — every day after market close. It uses a 6-agent AI pipeline to collect, clean, analyze, and report on FII/DII activity across sectors and companies.

## 📊 Dashboard Pages

| Page | URL | Description |
|------|-----|-------------|
| Overview | `/` | KPI cards, FII/DII flow charts, Smart Money Scores |
| FII Tracker | `/fii` | Top FIIs, country breakdown, holdings table |
| DII Tracker | `/dii` | Top MFs + Insurance, AUM breakdown |
| Sector Analysis | `/sectors` | Momentum heatmap, FII vs DII by sector |
| Company Deep Dive | `/company` | Ownership %, Smart Money Score per stock |
| AI Insights | `/insights` | Daily Smart Money Report |
| Alerts | `/alerts` | Large deal & stake change notifications |

## 🤖 AI Agent Pipeline

The pipeline runs automatically at **4:00 PM IST** on weekdays:

```
Data Collector → Data Cleaner → Market Analyzer → Insight Generator → Alert Agent
```

| Agent | Role |
|-------|------|
| Collector | Scrapes NSE bulk deals, Yahoo Finance holdings, financial news |
| Cleaner | Normalizes institution/company names, removes duplicates |
| Analyzer | Computes Smart Money Score, sector rotation signals |
| Insights | Generates human-readable daily report (LLM-powered) |
| Alert | Triggers threshold-based alerts (deal > ₹500 Cr etc.) |

## 🚀 Quick Start

### Frontend (Next.js)

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### With Docker Compose

```bash
# copy and fill in your keys
cp backend/.env.example backend/.env

docker-compose up
```

## ⚙️ Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/sharemarketflow
OPENAI_API_KEY=sk-...      # Optional — for AI insight generation
```

## 🗄️ Database Schema

Five PostgreSQL tables:
- `institutional_flows` — Daily FII/DII gross buy/sell/net
- `holdings` — Quarterly shareholding data per institution/company
- `deals` — NSE/BSE bulk and block deal records
- `insights` — AI-generated daily Smart Money Reports
- `alerts` — Threshold-triggered notification history

## 🔌 API Endpoints

```
GET  /api/flows/daily          FII/DII daily net flows (last N days)
GET  /api/flows/summary        Today / Week / Month summary
GET  /api/fii/top              Top FII institutions by AUM
GET  /api/dii/top              Top DII institutions by AUM
GET  /api/deals                Bulk/block deals with filters
GET  /api/sectors              Sector momentum + flow data
GET  /api/insights/latest      Latest AI Smart Money Report
GET  /api/alerts               Alert history with filters
POST /api/agents/run           Manually trigger agent pipeline
GET  /api/agents/status        Pipeline run status
```

## 🧠 Intelligence Metrics

| Metric | Description | Range |
|--------|-------------|-------|
| Smart Money Score | FII+DII momentum signal | 0–100 |
| Sector Momentum | Breadth of institutional sector buying | 0–100 |
| Institutional Confidence | % Nifty50 with net FII buying | 0–100 |

## 📁 Project Structure

```
ShareMarketFlow/
├── src/
│   ├── app/                    # Next.js pages (7 routes)
│   ├── components/             # Shared UI components
│   └── lib/
│       └── mockData.ts         # Dev mock data
├── backend/
│   ├── main.py                 # FastAPI entry
│   ├── agents/                 # CrewAI agents (5)
│   ├── api/routes/             # REST endpoints
│   ├── db/                     # SQLAlchemy models
│   └── scheduler.py           # 4 PM IST cron
├── docker-compose.yml
└── README.md
```

## 🔮 Roadmap (Phase 2)

- [ ] WhatsApp bot via Twilio/WATI — daily digest + alerts
- [ ] Email reports via SendGrid
- [ ] Learning Agent — back-test signal accuracy
- [ ] Mobile PWA
- [ ] Supabase production database
- [ ] Auth (NextAuth)

## 📜 Data Sources

- **NSE India** — Bulk/block deals (public API)
- **BSE India** — Block deals (public web)
- **Yahoo Finance** — Institutional holdings via `yfinance`
- **Economic Times / Moneycontrol** — Financial news headlines
- **SEBI** — FII registration data

> ⚠️ This platform uses publicly available data only. Not investment advice.
