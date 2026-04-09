"""
Agent 2: Data Cleaner & Normalizer
Standardizes institution names, company names, and sector classifications.
"""

from crewai import Agent, Task
import re

# Canonical name mappings
INSTITUTION_MAP = {
    "GIC PRIVATE LIMITED": "GIC Private Limited",
    "GIC PVT LTD": "GIC Private Limited",
    "BLACKROCK INC": "BlackRock Inc.",
    "BLACKROCK": "BlackRock Inc.",
    "VANGUARD": "Vanguard Group",
    "VANGUARD GROUP INC": "Vanguard Group",
    "NORGES BANK": "Norges Bank",
    "TEMASEK HOLDINGS": "Temasek Holdings",
    "TEMASEK": "Temasek Holdings",
    "CPPIB": "CPPIB",
    "CANADA PENSION PLAN": "CPPIB",
    "SBI MF": "SBI Mutual Fund",
    "SBI MUTUAL FUND": "SBI Mutual Fund",
    "HDFC MF": "HDFC Mutual Fund",
    "LIC OF INDIA": "LIC",
}

SECTOR_MAP = {
    "bank": "Banking & Finance",
    "hdfc bank": "Banking & Finance",
    "icici bank": "Banking & Finance",
    "kotak": "Banking & Finance",
    "it": "Information Technology",
    "tcs": "Information Technology",
    "infosys": "Information Technology",
    "wipro": "Information Technology",
    "pharma": "Pharmaceuticals",
    "sun pharma": "Pharmaceuticals",
    "reliance": "Oil & Gas",
    "ongc": "Oil & Gas",
    "airtel": "Telecom",
    "jio": "Telecom",
    "lt": "Infrastructure",
    "l&t": "Infrastructure",
    "ntpc": "Power & Utilities",
}


def normalize_institution_name(raw: str) -> str:
    """Map raw institution names to canonical names."""
    upper = raw.strip().upper()
    for key, canonical in INSTITUTION_MAP.items():
        if key in upper:
            return canonical
    return raw.title()


def normalize_sector(company_name: str) -> str:
    """Infer sector from company name."""
    lower = company_name.lower()
    for key, sector in SECTOR_MAP.items():
        if key in lower:
            return sector
    return "Others"


def clean_deal(deal: dict) -> dict:
    """Normalize a single bulk deal record."""
    return {
        "date": deal.get("mTradDt", ""),
        "symbol": deal.get("scrpNm", "").strip().upper(),
        "client_name": normalize_institution_name(deal.get("clntNm", "")),
        "side": "BUY" if deal.get("BuySell", "B").upper().startswith("B") else "SELL",
        "quantity": int(deal.get("bd_qty", 0)),
        "value_cr": round(float(deal.get("bd_trdVal", 0)) / 1e7, 2),
        "exchange": "NSE",
        "sector": normalize_sector(deal.get("scrpNm", "")),
    }


def create_cleaner_agent() -> Agent:
    return Agent(
        role="Data Quality Engineer",
        goal="Standardize, deduplicate, and normalize all collected FII/DII data for consistent analysis",
        backstory="""You are a meticulous data engineer who ensures data quality in financial datasets.
        You know common variations in institution names (e.g., GIC vs GIC Private Limited),
        company abbreviations, and sector classifications. You also detect and remove duplicates.""",
        tools=[],
        verbose=True,
        max_iter=2,
    )


def create_cleaning_task(agent: Agent, raw_data: str) -> Task:
    return Task(
        description=f"""
        Clean and normalize the following raw FII/DII data:
        {raw_data}

        Tasks:
        1. Standardize institution names (e.g., "BLACKROCK INC" → "BlackRock Inc.")
        2. Normalize company/ticker names
        3. Classify each deal into the correct sector
        4. Remove any duplicate entries
        5. Validate numeric fields (prices, quantities, values)
        6. Return clean, structured JSON
        """,
        expected_output="""Clean JSON with:
        - deals: list of normalized bulk deals
        - institutions: list of unique institution names encountered
        - sectors: sector breakdown
        - quality_report: dict with counts, duplicates_removed, errors
        """,
        agent=agent,
    )
