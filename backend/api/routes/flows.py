"""API routes — FII/DII daily flows"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from db.database import get_db
from db.models import InstitutionalFlow
from datetime import date, timedelta

router = APIRouter()

@router.get("/daily")
async def get_daily_flows(days: int = 30, db: AsyncSession = Depends(get_db)):
    """FII/DII daily net flow for last N days."""
    start = date.today() - timedelta(days=days)
    fii_q = select(InstitutionalFlow).where(
        InstitutionalFlow.type == "FII",
        InstitutionalFlow.date >= start,
    ).order_by(InstitutionalFlow.date)
    dii_q = select(InstitutionalFlow).where(
        InstitutionalFlow.type == "DII",
        InstitutionalFlow.date >= start,
    ).order_by(InstitutionalFlow.date)

    fii_rows = (await db.execute(fii_q)).scalars().all()
    dii_rows = (await db.execute(dii_q)).scalars().all()

    fii_map = {str(r.date): r for r in fii_rows}
    dii_map = {str(r.date): r for r in dii_rows}
    all_dates = sorted(set(fii_map) | set(dii_map))

    return [
        {
            "date": d,
            "fii_buy": float(fii_map[d].gross_buy or 0) if d in fii_map else 0,
            "fii_sell": float(fii_map[d].gross_sell or 0) if d in fii_map else 0,
            "fii_net": float(fii_map[d].net_flow or 0) if d in fii_map else 0,
            "dii_buy": float(dii_map[d].gross_buy or 0) if d in dii_map else 0,
            "dii_sell": float(dii_map[d].gross_sell or 0) if d in dii_map else 0,
            "dii_net": float(dii_map[d].net_flow or 0) if d in dii_map else 0,
        }
        for d in all_dates
    ]


@router.get("/summary")
async def get_flow_summary(db: AsyncSession = Depends(get_db)):
    """Today's / MTD / YTD summary."""
    # We will fetch up to 30 days
    start = date.today() - timedelta(days=30)
    q = select(InstitutionalFlow).where(InstitutionalFlow.date >= start).order_by(desc(InstitutionalFlow.date))
    rows = (await db.execute(q)).scalars().all()
    
    if not rows:
        return {"today": {"fii_net": 0, "dii_net": 0}, "week": {"fii_net": 0, "dii_net": 0}, "month": {"fii_net": 0, "dii_net": 0}}
        
    latest_date = rows[0].date
    today_rows = [r for r in rows if r.date == latest_date]
    week_start = date.today() - timedelta(days=7)
    week_rows = [r for r in rows if r.date >= week_start]
    
    return {
        "today": {
            "fii_net": sum(float(r.net_flow or 0) for r in today_rows if r.type == 'FII'),
            "dii_net": sum(float(r.net_flow or 0) for r in today_rows if r.type == 'DII'),
        },
        "week": {
            "fii_net": sum(float(r.net_flow or 0) for r in week_rows if r.type == 'FII'),
            "dii_net": sum(float(r.net_flow or 0) for r in week_rows if r.type == 'DII'),
        },
        "month": {
            "fii_net": sum(float(r.net_flow or 0) for r in rows if r.type == 'FII'),
            "dii_net": sum(float(r.net_flow or 0) for r in rows if r.type == 'DII'),
        },
    }
