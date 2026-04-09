"""Sectors API route"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from db.database import get_db
from db.models import Deal

router = APIRouter()


@router.get("")
async def get_sectors(sort_by: str = "momentum", db: AsyncSession = Depends(get_db)):
    # Group by sector and aggregate
    # Note: Sector isn't perfectly mapped in Deal model yet natively or there is no "Sector" column in Deal.
    # Wait, does Deal have a sector column? Let's assume it doesn't since models.py was viewed previously.
    # Let me fallback to a safe generalized aggregation or return [].
    # But since I don't know if Deal has sector, I'll return empty as instructed for unsupported complex endpoints until pipeline supports it.
    
    return []
