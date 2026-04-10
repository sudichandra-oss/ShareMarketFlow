"""Insights API route"""
from fastapi import APIRouter
from datetime import date

router = APIRouter()

MOCK_INSIGHT = {
    "report_date": str(date.today()),
    "title": f"Smart Money Report — {date.today().strftime('%B %d, %Y')}",
    "summary": "FIIs turned net buyers after 3 sessions of selling, pumping ₹2,847 Cr into Banking and Telecom. DIIs maintained aggressive accumulation in PSU and Infrastructure plays. Institutional breadth at 68% — historically bullish for Nifty50.",
    "key_points": [
        {"icon": "🏦", "text": "FIIs net bought ₹2,847 Cr — first positive session in 4 days, led by GIC and BlackRock in HDFC Bank and Reliance."},
        {"icon": "📡", "text": "Telecom sector saw record FII inflow of ₹2,340 Cr. Bharti Airtel block deal worth ₹769 Cr signals 5G thesis builds."},
        {"icon": "🏗️", "text": "Infrastructure top DII pick for 3rd consecutive week. LIC added 28 lakh shares of L&T at ₹3,412."},
        {"icon": "💊", "text": "Pharma FII inflow ₹2,100 Cr — Sun Pharma, Dr. Reddy's benefiting from USD strength and US generic approvals."},
        {"icon": "⚠️", "text": "IT sector saw FII outflow of ₹1,240 Cr. Q4 guidance concerns persist. TCS, Infosys near-term headwinds."},
        {"icon": "🟢", "text": "Smart Money Score upgraded to 74/100 from 61 — strong buy signal per historical back-test patterns."},
    ],
    "smart_money_score": 74,
    "sector_momentum": 67,
    "institutional_confidence": 68,
    "generated_by": "AI Agent Pipeline — CrewAI",
}


@router.get("/latest")
async def get_latest_insight():
    return MOCK_INSIGHT


@router.get("/history")
async def get_insight_history(limit: int = 7):
    return [MOCK_INSIGHT]  # In prod: query DB for past reports
