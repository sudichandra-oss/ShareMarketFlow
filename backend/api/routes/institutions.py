"""Institution routes — FII top, DII top, bulk deals"""

from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from db.database import get_db
from db.models import Deal, Holding
import datetime

router = APIRouter()

@router.get("/fii/top")
async def get_top_fii(limit: int = Query(10, ge=1, le=50), db: AsyncSession = Depends(get_db)):
    # Group by client_name to find top FIIs by deal value
    q = select(
        Deal.client_name, 
        func.sum(Deal.value_cr).label('total_value')
    ).group_by(Deal.client_name).order_by(desc('total_value')).limit(limit)
    
    result = await db.execute(q)
    rows = result.all()
    
    # Format to match InstitutionActivity interface
    return [
        {
            "name": row.client_name,
            "country": "Unknown",
            "aum_cr": 0,
            "change_cr": float(row.total_value or 0),
            "change_pct": 0.0,
            "sectors": [],
            "holdings_count": 0,
            "trend": "BUY" if float(row.total_value or 0) > 0 else "SELL"
        }
        for row in rows
    ]

@router.get("/dii/top")
async def get_top_dii(limit: int = Query(10, ge=1, le=50), db: AsyncSession = Depends(get_db)):
    # Assuming DIIs are currently just pulled similarly for now
    q = select(
        Deal.client_name, 
        func.sum(Deal.value_cr).label('total_value')
    ).where(Deal.client_name.ilike('%fund%') | Deal.client_name.ilike('%lic%')).group_by(Deal.client_name).order_by(desc('total_value')).limit(limit)
    
    result = await db.execute(q)
    rows = result.all()
    
    return [
        {
            "name": row.client_name,
            "type": "MF",
            "aum_cr": 0,
            "change_cr": float(row.total_value or 0),
            "change_pct": 0.0,
            "top_picks": [],
            "trend": "BUY" if float(row.total_value or 0) > 0 else "SELL"
        }
        for row in rows
    ]

@router.get("/deals")
async def get_bulk_deals(
    date: Optional[str] = None,
    exchange: Optional[str] = None,
    side: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    q = select(Deal).order_by(desc(Deal.deal_date))
    if date:
        q = q.where(Deal.deal_date == datetime.date.fromisoformat(date))
    if exchange:
        q = q.where(Deal.exchange == exchange.upper())
    if side:
        q = q.where(Deal.deal_side == side.upper())
        
    result = await db.execute(q.limit(100))
    deals = result.scalars().all()
    
    return [
        {
            "date": str(d.deal_date),
            "symbol": d.symbol,
            "company": d.company_name,
            "client": d.client_name,
            "side": d.deal_side,
            "qty": d.quantity,
            "price": float(d.price or 0.0),
            "value_cr": float(d.value_cr or 0.0),
            "exchange": d.exchange
        }
        for d in deals
    ]

@router.get("/companies")
async def get_companies(db: AsyncSession = Depends(get_db)):
    # Fallback aggregation since Company isn't a direct table
    q = select(
        Deal.symbol,
        Deal.company_name,
        func.sum(Deal.value_cr).label('total_flow')
    ).group_by(Deal.symbol, Deal.company_name).limit(50)
    
    result = await db.execute(q)
    rows = result.all()
    
    return [
        {
            "ticker": row.symbol, 
            "name": row.company_name, 
            "sector": "Various", 
            "price": 0, 
            "change_pct": 0, 
            "fii_pct": 0, 
            "dii_pct": 0, 
            "promoter_pct": 0, 
            "public_pct": 0, 
            "smart_score": 50
        }
        for row in rows
    ]
