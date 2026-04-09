"""API routes — FII/DII daily flows"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from db.database import get_db
from db.models import InstitutionalFlow
from datetime import date, timedelta
import random

router = APIRouter()

# ── mock fallback ─────────────────────────────────────────────────────────────
def _generate_mock_flows(days: int = 30):
    today = date.today()
    rows = []
    for i in range(days):
        d = today - timedelta(days=days - 1 - i)
        fii_net = (random.random() - 0.45) * 4000
        dii_net = (random.random() - 0.42) * 3000
        rows.append({
            "date": str(d),
            "fii_buy": round(abs(fii_net) + random.random() * 2000 + 1000, 2),
            "fii_sell": round(abs(fii_net) + random.random() * 2000 + 500, 2),
            "fii_net": round(fii_net, 2),
            "dii_buy": round(abs(dii_net) + random.random() * 2000 + 800, 2),
            "dii_sell": round(abs(dii_net) + random.random() * 1500 + 400, 2),
            "dii_net": round(dii_net, 2),
        })
    return rows


@router.get("/daily")
async def get_daily_flows(days: int = 30, db: AsyncSession = Depends(get_db)):
    """FII/DII daily net flow for last N days."""
    try:
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

        if not fii_rows:
            return _generate_mock_flows(days)

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
    except Exception:
        return _generate_mock_flows(days)


@router.get("/summary")
async def get_flow_summary(db: AsyncSession = Depends(get_db)):
    """Today's / MTD / YTD summary."""
    mock = _generate_mock_flows(30)
    today = mock[-1]
    week = mock[-5:]
    month = mock

    return {
        "today": {
            "fii_net": today["fii_net"],
            "dii_net": today["dii_net"],
        },
        "week": {
            "fii_net": round(sum(d["fii_net"] for d in week), 2),
            "dii_net": round(sum(d["dii_net"] for d in week), 2),
        },
        "month": {
            "fii_net": round(sum(d["fii_net"] for d in month), 2),
            "dii_net": round(sum(d["dii_net"] for d in month), 2),
        },
    }
