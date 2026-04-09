"""Alerts API route"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, update
from db.database import get_db
from db.models import Alert
from typing import Optional

router = APIRouter()

@router.get("")
async def get_alerts(severity: Optional[str] = None, is_read: Optional[bool] = None, db: AsyncSession = Depends(get_db)):
    q = select(Alert).order_by(desc(Alert.triggered_at)).limit(50)
    if severity:
        q = q.where(Alert.severity == severity.upper())
    if is_read is not None:
        q = q.where(Alert.is_read == is_read)
        
    result = await db.execute(q)
    alerts = result.scalars().all()
    
    return [
        {
            "id": a.id,
            "type": a.alert_type,
            "severity": a.severity,
            "institution": a.institution_name,
            "company": a.company_name,
            "value_cr": float(a.value_cr or 0),
            "description": a.description,
            "time": a.triggered_at.strftime("%H:%M") if a.triggered_at else "",
            "is_read": a.is_read
        }
        for a in alerts
    ]


@router.patch("/{alert_id}/read")
async def mark_read(alert_id: int, db: AsyncSession = Depends(get_db)):
    q = update(Alert).where(Alert.id == alert_id).values(is_read=True)
    result = await db.execute(q)
    await db.commit()
    if result.rowcount > 0:
        return {"status": "ok"}
    return {"status": "not_found"}


@router.patch("/mark-all-read")
async def mark_all_read(db: AsyncSession = Depends(get_db)):
    q = update(Alert).where(Alert.is_read == False).values(is_read=True)
    result = await db.execute(q)
    await db.commit()
    return {"status": "ok", "count": result.rowcount}
