"""Institution routes — FII top, DII top, bulk deals"""

from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

MOCK_FII = [
    {"name": "GIC Private Limited", "country": "Singapore", "aum_cr": 182400, "change_cr": 3240, "change_pct": 1.81, "sectors": ["Banking", "IT", "Telecom"], "holdings_count": 47, "trend": "BUY"},
    {"name": "Vanguard Group", "country": "USA", "aum_cr": 143200, "change_cr": -1890, "change_pct": -1.30, "sectors": ["IT", "FMCG", "Pharma"], "holdings_count": 63, "trend": "SELL"},
    {"name": "BlackRock Inc.", "country": "USA", "aum_cr": 136800, "change_cr": 4120, "change_pct": 3.10, "sectors": ["Banking", "Auto", "Infra"], "holdings_count": 58, "trend": "BUY"},
    {"name": "Norges Bank", "country": "Norway", "aum_cr": 98700, "change_cr": 2100, "change_pct": 2.17, "sectors": ["Energy", "Banking"], "holdings_count": 29, "trend": "BUY"},
    {"name": "Temasek Holdings", "country": "Singapore", "aum_cr": 87300, "change_cr": -640, "change_pct": -0.73, "sectors": ["Telecom", "Pharma"], "holdings_count": 18, "trend": "HOLD"},
    {"name": "CPPIB", "country": "Canada", "aum_cr": 76500, "change_cr": 1890, "change_pct": 2.53, "sectors": ["Infra", "Realty"], "holdings_count": 22, "trend": "BUY"},
    {"name": "Fidelity Investments", "country": "USA", "aum_cr": 64200, "change_cr": -2310, "change_pct": -3.47, "sectors": ["IT", "Midcap"], "holdings_count": 71, "trend": "SELL"},
    {"name": "Schroders PLC", "country": "UK", "aum_cr": 52100, "change_cr": 780, "change_pct": 1.52, "sectors": ["FMCG", "Pharma"], "holdings_count": 34, "trend": "BUY"},
]

MOCK_DII = [
    {"name": "SBI Mutual Fund", "type": "MF", "aum_cr": 924000, "change_cr": 8430, "change_pct": 0.92, "top_picks": ["SBI", "HDFC Bank", "Infosys"], "trend": "BUY"},
    {"name": "HDFC Mutual Fund", "type": "MF", "aum_cr": 712000, "change_cr": 6210, "change_pct": 0.88, "top_picks": ["HDFC Bank", "RIL", "TCS"], "trend": "BUY"},
    {"name": "Nippon India MF", "type": "MF", "aum_cr": 489000, "change_cr": 3120, "change_pct": 0.64, "top_picks": ["ITC", "L&T", "ICICI Bank"], "trend": "BUY"},
    {"name": "LIC", "type": "Insurance", "aum_cr": 1820000, "change_cr": 12400, "change_pct": 0.69, "top_picks": ["Nifty PSU Cos"], "trend": "BUY"},
    {"name": "ICICI Prudential MF", "type": "MF", "aum_cr": 398000, "change_cr": -1840, "change_pct": -0.46, "top_picks": ["Banking", "Auto"], "trend": "SELL"},
    {"name": "Kotak Mahindra MF", "type": "MF", "aum_cr": 324000, "change_cr": 2870, "change_pct": 0.89, "top_picks": ["Midcap IT", "Pharma"], "trend": "BUY"},
]

MOCK_BULK_DEALS = [
    {"date": "2025-04-07", "symbol": "HDFCBANK", "company": "HDFC Bank Ltd", "client": "GIC Private Limited", "side": "BUY", "qty": 14200000, "price": 1842.50, "value_cr": 2616.35, "exchange": "NSE"},
    {"date": "2025-04-07", "symbol": "RELIANCE", "company": "Reliance Industries", "client": "BlackRock Inc.", "side": "BUY", "qty": 3800000, "price": 2941.00, "value_cr": 1117.58, "exchange": "BSE"},
    {"date": "2025-04-07", "symbol": "TCS", "company": "Tata Consultancy", "client": "Vanguard Group", "side": "SELL", "qty": 2100000, "price": 4128.00, "value_cr": 866.88, "exchange": "NSE"},
    {"date": "2025-04-07", "symbol": "INFY", "company": "Infosys Ltd", "client": "Norges Bank", "side": "BUY", "qty": 5400000, "price": 1624.00, "value_cr": 876.96, "exchange": "NSE"},
    {"date": "2025-04-07", "symbol": "ICICIBANK", "company": "ICICI Bank Ltd", "client": "SBI Mutual Fund", "side": "BUY", "qty": 8200000, "price": 1248.50, "value_cr": 1023.77, "exchange": "BSE"},
]


@router.get("/fii/top")
async def get_top_fii(limit: int = Query(10, ge=1, le=50)):
    return MOCK_FII[:limit]


@router.get("/dii/top")
async def get_top_dii(limit: int = Query(10, ge=1, le=50)):
    return MOCK_DII[:limit]


@router.get("/deals")
async def get_bulk_deals(
    date: Optional[str] = None,
    exchange: Optional[str] = None,
    side: Optional[str] = None,
):
    deals = MOCK_BULK_DEALS
    if date:
        deals = [d for d in deals if d["date"] == date]
    if exchange:
        deals = [d for d in deals if d["exchange"] == exchange.upper()]
    if side:
        deals = [d for d in deals if d["side"] == side.upper()]
    return deals
