"""Alerts API route"""
from fastapi import APIRouter, Body
from typing import Optional

router = APIRouter()

_alerts = [
    {"id": 1, "type": "LARGE_DEAL", "severity": "HIGH", "institution": "GIC Private Limited", "company": "HDFC Bank", "value_cr": 2616, "description": "GIC bought 1.42 Cr shares of HDFC Bank worth ₹2,616 Cr in bulk deal", "time": "15:58", "is_read": False},
    {"id": 2, "type": "STAKE_CHANGE", "severity": "HIGH", "institution": "BlackRock Inc.", "company": "Reliance Industries", "value_cr": 1117, "description": "BlackRock increased stake from 1.2% to 1.8% — ₹1,117 Cr block deal", "time": "15:45", "is_read": False},
    {"id": 3, "type": "SECTOR_FLOW", "severity": "MEDIUM", "institution": "Multiple FIIs", "company": "Telecom Sector", "value_cr": 2340, "description": "Telecom sector FII inflow crossed ₹2,340 Cr — highest in 6 months", "time": "15:30", "is_read": False},
    {"id": 4, "type": "LARGE_DEAL", "severity": "HIGH", "institution": "LIC", "company": "Larsen & Toubro", "value_cr": 955, "description": "LIC bought 28L shares of L&T worth ₹955 Cr — sustained accumulation", "time": "14:22", "is_read": True},
    {"id": 5, "type": "NEW_ENTRY", "severity": "MEDIUM", "institution": "Norges Bank", "company": "Infosys Ltd", "value_cr": 877, "description": "Norges Bank new entry in Infosys — 54L shares at ₹1,624", "time": "13:10", "is_read": True},
]


@router.get("")
async def get_alerts(severity: Optional[str] = None, is_read: Optional[bool] = None):
    result = _alerts
    if severity:
        result = [a for a in result if a["severity"] == severity.upper()]
    if is_read is not None:
        result = [a for a in result if a["is_read"] == is_read]
    return result


@router.patch("/{alert_id}/read")
async def mark_read(alert_id: int):
    for a in _alerts:
        if a["id"] == alert_id:
            a["is_read"] = True
            return {"status": "ok"}
    return {"status": "not_found"}


@router.patch("/mark-all-read")
async def mark_all_read():
    for a in _alerts:
        a["is_read"] = True
    return {"status": "ok", "count": len(_alerts)}
