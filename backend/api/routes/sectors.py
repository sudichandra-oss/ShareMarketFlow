"""Sectors API route"""
from fastapi import APIRouter

router = APIRouter()

MOCK_SECTORS = [
    {"name": "Banking & Finance", "fii_flow": 3240, "dii_flow": 5610, "total_flow": 8850, "momentum": 82, "weight_pct": 28.4, "change_pct": 1.8},
    {"name": "Information Technology", "fii_flow": -1240, "dii_flow": 2100, "total_flow": 860, "momentum": 54, "weight_pct": 15.2, "change_pct": 0.3},
    {"name": "Oil & Gas", "fii_flow": 890, "dii_flow": 1230, "total_flow": 2120, "momentum": 67, "weight_pct": 11.8, "change_pct": 1.1},
    {"name": "FMCG", "fii_flow": -340, "dii_flow": 890, "total_flow": 550, "momentum": 48, "weight_pct": 9.4, "change_pct": 0.2},
    {"name": "Automobile", "fii_flow": 1120, "dii_flow": 1870, "total_flow": 2990, "momentum": 74, "weight_pct": 6.8, "change_pct": 1.6},
    {"name": "Pharmaceuticals", "fii_flow": 2100, "dii_flow": 980, "total_flow": 3080, "momentum": 79, "weight_pct": 5.9, "change_pct": 2.4},
    {"name": "Metals & Mining", "fii_flow": -870, "dii_flow": 640, "total_flow": -230, "momentum": 32, "weight_pct": 4.3, "change_pct": -0.4},
    {"name": "Infrastructure", "fii_flow": 1890, "dii_flow": 3240, "total_flow": 5130, "momentum": 88, "weight_pct": 4.1, "change_pct": 3.2},
    {"name": "Telecom", "fii_flow": 2340, "dii_flow": 870, "total_flow": 3210, "momentum": 76, "weight_pct": 3.8, "change_pct": 2.1},
    {"name": "Real Estate", "fii_flow": 780, "dii_flow": 1200, "total_flow": 1980, "momentum": 65, "weight_pct": 2.4, "change_pct": 1.4},
    {"name": "Chemicals", "fii_flow": -230, "dii_flow": 430, "total_flow": 200, "momentum": 41, "weight_pct": 2.1, "change_pct": 0.1},
    {"name": "Power & Utilities", "fii_flow": 1100, "dii_flow": 2100, "total_flow": 3200, "momentum": 80, "weight_pct": 2.0, "change_pct": 2.3},
]


@router.get("")
async def get_sectors(sort_by: str = "momentum"):
    if sort_by == "flow":
        return sorted(MOCK_SECTORS, key=lambda x: x["total_flow"], reverse=True)
    return sorted(MOCK_SECTORS, key=lambda x: x["momentum"], reverse=True)
