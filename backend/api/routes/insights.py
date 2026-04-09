"""Insights API route"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from db.database import get_db
from db.models import Insight

router = APIRouter()

@router.get("/latest")
async def get_latest_insight(db: AsyncSession = Depends(get_db)):
    q = select(Insight).order_by(desc(Insight.report_date)).limit(1)
    result = await db.execute(q)
    insight = result.scalar_one_or_none()
    
    if not insight:
        return {}
        
    return {
        "report_date": str(insight.report_date),
        "title": insight.title,
        "summary": insight.summary,
        "key_points": insight.key_points or [],
        "smart_money_score": insight.smart_money_score,
        "sector_momentum": insight.sector_momentum,
        "institutional_confidence": insight.institutional_confidence,
        "full_report": insight.full_report,
        "generated_by": "AI Agent Pipeline — CrewAI"
    }


@router.get("/history")
async def get_insight_history(limit: int = 7, db: AsyncSession = Depends(get_db)):
    q = select(Insight).order_by(desc(Insight.report_date)).limit(limit)
    result = await db.execute(q)
    insights = result.scalars().all()
    
    return [
        {
            "report_date": str(i.report_date),
            "title": i.title,
            "summary": i.summary,
            "smart_money_score": i.smart_money_score,
        }
        for i in insights
    ]
